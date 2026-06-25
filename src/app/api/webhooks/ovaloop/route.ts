import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { OVALOOP_SECRET_KEY } from '@/lib/ovaloop';

export async function POST(req: NextRequest) {
    try {
        const signatureHeader = req.headers.get('x-ovaloop-signature');
        
        if (!signatureHeader) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // We must compute HMAC SHA512 of the RAW stringified body to verify the signature
        const rawBody = await req.text();
        
        const computedSignature = crypto
            .createHmac('sha512', OVALOOP_SECRET_KEY)
            .update(rawBody, 'utf8')
            .digest('hex');

        // Timing safe equal check
        if (computedSignature !== signatureHeader) {
            console.error("Ovaloop Webhook: Invalid signature check!");
            return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);

        if (payload.type === 'inventory_request' && payload.status === 'successful') {
            const s3Url = payload.data.url;
            console.log(`[Ovaloop] Inventory compiled! Downloading from: ${s3Url}`);

            // Fetch the massive JSON from S3
            const inventoryRes = await fetch(s3Url);
            if (!inventoryRes.ok) throw new Error("Failed to download from S3");
            const inventoryData = await inventoryRes.json();
            
            console.log(`[Ovaloop] Downloaded ${inventoryData.length} products.`);

            // For this test environment, we save the products locally to a JSON file
            // so our frontend can import and use them immediately without a Database.
            const outPath = path.join(process.cwd(), 'src/lib/ovaloop_products.json');
            fs.writeFileSync(outPath, JSON.stringify(inventoryData, null, 2));

            console.log(`[Ovaloop] Successfully wrote products to ${outPath}`);

            return NextResponse.json({ success: true, count: inventoryData.length }, { status: 200 });
        }

        return NextResponse.json({ message: 'Unhandled event type' }, { status: 200 });
    } catch (e: any) {
        console.error("[Ovaloop] Webhook error:", e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
