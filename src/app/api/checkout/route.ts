import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cart, customer } = body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 });
        }

        if (!customer || typeof customer !== 'object') {
            return NextResponse.json({ error: 'Customer information is missing or invalid' }, { status: 400 });
        }

        if (!customer.firstname || typeof customer.firstname !== 'string' || customer.firstname.trim() === '') {
             return NextResponse.json({ error: 'Customer firstname is required' }, { status: 400 });
        }

        if (!customer.lastname || typeof customer.lastname !== 'string' || customer.lastname.trim() === '') {
             return NextResponse.json({ error: 'Customer lastname is required' }, { status: 400 });
        }

        // Group cart items by provider
        const providerCarts: Record<string, unknown[]> = {};
        for (const item of cart) {
            const providerName = (item as any)?.product?.provider || 'ovaloop';
            if (!providerCarts[providerName]) {
                providerCarts[providerName] = [];
            }
            providerCarts[providerName].push(item);
        }

        const results = [];
        let primaryGroupOrderReference = null;

        // Process orders per provider
        for (const [providerName, items] of Object.entries(providerCarts)) {
            const provider = getProvider(providerName);
            const providerPayload = { cart: items, customer };
            
            try {
                const result = await provider.createOrder(providerPayload);
                results.push({ provider: providerName, success: true, data: result });
                // If Ovaloop was the provider or it's the first one, grab its reference
                if (providerName === 'ovaloop' || !primaryGroupOrderReference) {
                    primaryGroupOrderReference = result.group_order_reference;
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error(`[Checkout API] Error processing provider ${providerName}:`, errorMessage);
                results.push({ provider: providerName, success: false, error: errorMessage });
            }
        }

        // Check if all failed
        const allFailed = results.every(r => !r.success);
        if (allFailed) {
            return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Order placed successfully",
            data: results,
            group_order_reference: primaryGroupOrderReference
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Checkout API] Internal Server Error:', errorMessage);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
