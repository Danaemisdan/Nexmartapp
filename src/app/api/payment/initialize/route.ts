import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cart, customer, totalAmount } = body;
        
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is required and must not be empty' }, { status: 400 });
        }
        
        if (!customer || typeof customer !== 'object') {
            return NextResponse.json({ error: 'Customer data is missing or invalid' }, { status: 400 });
        }
        
        if (typeof totalAmount !== 'number' || totalAmount <= 0) {
            return NextResponse.json({ error: 'Valid totalAmount is required' }, { status: 400 });
        }
        
        const GLOBALPAY_SECRET = process.env.GLOBALPAY_SECRET_KEY;
        const GLOBALPAY_PUBLIC = process.env.GLOBALPAY_PUBLIC_KEY;

        if (!GLOBALPAY_SECRET || !GLOBALPAY_PUBLIC) {
            console.warn('[GlobalPay] MOCK MODE ACTIVE: Keys missing, simulating successful payment redirect...');
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            const host = req.headers.get('host');
            const baseUrl = `${protocol}://${host}`;
            
            // Trigger the internal checkout endpoint directly to simulate webhook
            const checkoutRes = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, customer })
            });
            const checkoutData = await checkoutRes.json();

            return NextResponse.json({ 
                success: true, 
                checkoutUrl: `${baseUrl}/?payment=success&orderId=${checkoutData.group_order_reference}` 
            });
        }

        // ==========================================
        // REAL GLOBALPAY INTEGRATION
        // ==========================================
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;
        
        // Generate a unique transaction reference
        const txRef = `TX_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        // Construct the standard payment initialization payload
        const payload = {
            tx_ref: txRef,
            amount: totalAmount,
            currency: "NGN",
            redirect_url: `${baseUrl}/?payment=success`,
            customer: {
                email: customer.email || "customer@nexmart.com",
                phonenumber: customer.phone,
                name: `${customer.firstname} ${customer.lastname}`
            },
            meta: {
                cart: cart // We pack the cart in metadata so the webhook can retrieve it later
            }
        };

        // Call the GlobalPay API (User should replace URL with exact API endpoint from docs)
        const GLOBALPAY_API_URL = "https://api.globalpay.ng/v1/transactions/initialize";
        
        const response = await fetch(GLOBALPAY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GLOBALPAY_SECRET}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.data && data.data.checkout_url) {
            return NextResponse.json({ success: true, checkoutUrl: data.data.checkout_url });
        } else {
            console.error('[GlobalPay] Init Failed:', data);
            return NextResponse.json({ error: 'Payment initialization failed' }, { status: 400 });
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[GlobalPay] API Error:', errorMessage);
        return NextResponse.json({ error: 'Server error processing payment' }, { status: 500 });
    }
}
