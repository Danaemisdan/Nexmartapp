import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cart, customer } = body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 });
        }

        const OVALOOP_PUBLIC_KEY = process.env.OVALOOP_PUBLIC_KEY;
        const OVALOOP_SECRET_KEY = process.env.OVALOOP_SECRET_KEY;

        if (!OVALOOP_PUBLIC_KEY || !OVALOOP_SECRET_KEY) {
            console.error('Ovaloop API keys missing in environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Generate group_order_reference and timestamp
        const group_order_reference = `ORD${Date.now()}`;
        const timestamp = Math.floor(Date.now() / 1000).toString();

        // Compute HMAC SHA512 signature on the timestamp
        const signature = crypto
            .createHmac('sha512', OVALOOP_SECRET_KEY)
            .update(timestamp, 'utf8')
            .digest('hex');

        // Construct the Ovaloop order payload using actual Cart data
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

        const ovaloopEndpoint = process.env.OVALOOP_API_URL || 'https://devapi.ovaloop.app';
        
        const response = await fetch(`${ovaloopEndpoint}/partner/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-OVALOOP-PARTNER-KEY': OVALOOP_PUBLIC_KEY,
                'X-OVALOOP-TIMESTAMP': timestamp,
                'X-OVALOOP-SIGNATURE': signature
            },
            body: JSON.stringify(orderPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Checkout API] Error:', response.status, errorText);
            return NextResponse.json({ error: 'Failed to submit order to Ovaloop' }, { status: response.status });
        }

        const data = await response.json();
        
        return NextResponse.json({ 
            success: true, 
            message: "Order placed successfully",
            data,
            group_order_reference 
        });

    } catch (error: any) {
        console.error('[Checkout API] Internal Server Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
