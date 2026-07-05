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

        const ovaloopEndpoint = process.env.OVALOOP_API_URL || 'https://apiv2.ovaloop.app';
        
        console.log(`[Checkout] MOCK MODE ACTIVE: Order would have been sent to ${ovaloopEndpoint}/partner/orders/`);
        console.log('[Checkout] Payload:', JSON.stringify(orderPayload, null, 2));

        // Return a mock success response instead of actually hitting the API
        return NextResponse.json({ 
            success: true, 
            message: "MOCK_MODE_ACTIVE - Order was safely mocked and not sent to production.",
            data: orderPayload,
            group_order_reference 
        });

    } catch (error: any) {
        console.error('[Checkout] Internal Server Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
