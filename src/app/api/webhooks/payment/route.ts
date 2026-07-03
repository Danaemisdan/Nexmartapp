import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signatureHeader = req.headers.get('x-globalpay-signature') || req.headers.get('x-gp-signature');
        const GLOBALPAY_SECRET = process.env.GLOBALPAY_SECRET_KEY;

        if (!GLOBALPAY_SECRET) {
            console.error('[GlobalPay] Secret key missing');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        if (!signatureHeader) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // Verify GlobalPay HMAC-SHA512 Signature
        const computedSignature = crypto
            .createHmac('sha512', GLOBALPAY_SECRET)
            .update(rawBody, 'utf8')
            .digest('hex');

        if (computedSignature !== signatureHeader) {
            console.error('[GlobalPay] Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        console.log('[GlobalPay Webhook] Verified Payment received:', body.reference || body.tx_ref);

        // TODO in production: Verify body.status === 'SUCCESS' or 'SUCCESSFUL'
        // If payment is successful, trigger the Ovaloop checkout
        if (body.cart && Array.isArray(body.cart)) {
            // Forward the cart payload to our internal checkout API to create the Ovaloop order
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            const host = req.headers.get('host');
            const baseUrl = `${protocol}://${host}`;
            
            await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    cart: body.cart, 
                    customer: body.customer || { firstname: "Verified", lastname: "Buyer" }
                })
            });
        }
        
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error('[GlobalPay Webhook] Error processing:', error.message);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
    }
}
