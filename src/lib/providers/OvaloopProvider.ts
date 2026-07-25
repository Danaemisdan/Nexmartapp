import { CommerceProvider, OrderPayload, OrderResult, WebhookResult, ProductData } from './CommerceProvider';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { bulkUpsert } from '@/lib/db';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export class OvaloopProvider implements CommerceProvider {
    
    private getPublicKey(): string {
        const key = process.env.OVALOOP_PUBLIC_KEY;
        if (!key) throw new Error('OVALOOP_PUBLIC_KEY missing in environment variables');
        return key;
    }

    private getSecretKey(): string {
        const key = process.env.OVALOOP_SECRET_KEY;
        if (!key) throw new Error('OVALOOP_SECRET_KEY missing in environment variables');
        return key;
    }

    private getEndpoint(): string {
        return process.env.OVALOOP_API_URL || 'https://devapi.ovaloop.app';
    }

    private generateRequestHeaders() {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = crypto
            .createHmac('sha512', this.getSecretKey())
            .update(timestamp, 'utf8')
            .digest('hex');
            
        return {
            'Content-Type': 'application/json',
            'X-OVALOOP-PARTNER-KEY': this.getPublicKey(),
            'X-OVALOOP-TIMESTAMP': timestamp,
            'X-OVALOOP-SIGNATURE': signature
        };
    }

    async connect(_credentials: Record<string, unknown>): Promise<boolean> {
        return true;
    }
    
    async createOrder(payload: OrderPayload): Promise<OrderResult> {
        const { cart, customer } = payload;
        
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            throw new Error('Cart is empty or invalid');
        }

        const group_order_reference = `ORD${Date.now()}`;
        const orderPayload = cart.map((item: any) => ({
            business_id: item.product.business_id || "MISSING_BUSINESS_ID",
            customer_firstname: customer?.firstname || "Guest",
            customer_lastname: customer?.lastname || "User",
            customer_phone: customer?.phone || "0000000000",
            customer_address: customer?.address || "Nexmart Delivery",
            product_id: item.product.id,
            unit_measurement: "Unit",
            quantity: item.quantity || 1,
            price: item.product.price,
            group_order_reference
        }));

        const response = await fetch(`${this.getEndpoint()}/partner/orders/`, {
            method: 'POST',
            headers: this.generateRequestHeaders(),
            body: JSON.stringify(orderPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[OvaloopProvider] Error creating order:', response.status, errorText);
            throw new Error('Failed to submit order to Ovaloop');
        }

        const data = await response.json();
        return { ...data, group_order_reference };
    }
    
    async getOrder(orderId: string): Promise<OrderResult> {
        const response = await fetch(`${this.getEndpoint()}/partner/orders/${orderId}/`, {
            method: 'GET',
            headers: this.generateRequestHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[OvaloopProvider] Error fetching order:', response.status, errorText);
            throw new Error('Failed to retrieve order');
        }

        return response.json();
    }
    
    async cancelOrder(orderId: string): Promise<OrderResult> {
        const response = await fetch(`${this.getEndpoint()}/partner/orders/${orderId}/cancel/`, {
            method: 'POST',
            headers: this.generateRequestHeaders(),
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[OvaloopProvider] Error canceling order:', response.status, errorText);
            throw new Error('Failed to cancel order');
        }

        return response.json();
    }
    
    async returnOrder(orderId: string, payload?: Record<string, unknown>): Promise<OrderResult> {
        const response = await fetch(`${this.getEndpoint()}/partner/orders/${orderId}/return/`, {
            method: 'POST',
            headers: this.generateRequestHeaders(),
            body: JSON.stringify(payload || {})
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[OvaloopProvider] Error returning order:', response.status, errorText);
            throw new Error('Failed to return order');
        }

        return response.json();
    }
    
    async registerWebhook(_url: string, _events: string[]): Promise<WebhookResult> {
        throw new Error('Not implemented for Ovaloop directly');
    }
    
    async verifyWebhook(_req: Request): Promise<boolean> {
        // Disabled signature validation intentionally, returning true
        return true; 
    }
    
    async processWebhook(req: Request): Promise<WebhookResult> {
        const rawBody = await req.text();
        
        try {
            if (isSupabaseConfigured() && supabase) {
                await supabase.from('products').upsert({
                    id: 'webhook_debug',
                    title: 'WEBHOOK_RAW',
                    description: rawBody ? rawBody.substring(0, 5000) : 'EMPTY_BODY',
                    price: 0,
                    stock: 0
                });
            }
        } catch (e) {
            console.error('Logger failed', e);
        }

        const payload = JSON.parse(rawBody);
        console.log(`[OvaloopProvider Webhook] Event: ${payload.type}`);

        if (payload && payload.data && payload.data.url) {
            const s3Url = payload.data.url;
            console.log('[OvaloopProvider Webhook] Downloading inventory from S3...');

            const inventoryRes = await fetch(s3Url);
            if (!inventoryRes.ok) throw new Error(`S3 download failed: ${inventoryRes.status}`);
            const rawProducts: any[] = await inventoryRes.json();

            console.log(`[OvaloopProvider Webhook] ${rawProducts.length} products received. Diffing and Upserting...`);

            const { changedIds, total } = await bulkUpsert(rawProducts);
            console.log(`[OvaloopProvider Webhook] ${changedIds.length}/${total} products changed.`);

            if (changedIds.length > 0) {
                for (const id of changedIds) {
                    revalidatePath(`/product/${id}`);
                }
                revalidatePath('/');
                revalidatePath('/api/products');
                console.log(`[OvaloopProvider Webhook] Revalidated ${changedIds.length} product pages.`);
            }

            return {
                success: true,
                total,
                changed: changedIds.length,
                mode: isSupabaseConfigured() ? 'supabase' : 'local',
            };
        }

        return { 
            success: false,
            message: 'Ignored unhandled event.',
            received_type: payload.type,
            received_status: payload.status,
            payload: payload
        };
    }
    
    async getProducts(_merchantId: string, _limit?: number, _offset?: number): Promise<ProductData[]> {
        throw new Error('Not implemented');
    }
    
    async syncProducts(_merchantId: string): Promise<unknown> {
        throw new Error('Not implemented');
    }
    
    async syncInventory(_merchantId: string): Promise<unknown> {
        throw new Error('Not implemented');
    }
}
