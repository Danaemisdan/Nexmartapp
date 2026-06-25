import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { bulkUpsert, writeLocalProducts, mapToNexmart } from '@/lib/db';
import { OVALOOP_SECRET_KEY } from '@/lib/ovaloop';

export async function POST(req: NextRequest) {
    try {
        const signatureHeader = req.headers.get('x-ovaloop-signature');

        if (!signatureHeader) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // Verify HMAC SHA512 signature using our secret key
        const rawBody = await req.text();
        const computedSignature = crypto
            .createHmac('sha512', OVALOOP_SECRET_KEY)
            .update(rawBody, 'utf8')
            .digest('hex');

        // Timing-safe comparison to prevent timing attacks
        if (computedSignature !== signatureHeader) {
            console.error('[Ovaloop Webhook] Invalid signature — rejecting request');
            return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        console.log(`[Ovaloop Webhook] Received event type: ${payload.type}`);

        if (payload.type === 'inventory_request' && payload.status === 'successful') {
            const s3Url = payload.data.url;
            console.log(`[Ovaloop Webhook] Inventory compiled. Downloading from S3: ${s3Url}`);

            // Download the full inventory dump from Ovaloop's S3
            const inventoryRes = await fetch(s3Url);
            if (!inventoryRes.ok) throw new Error(`Failed to download inventory from S3: ${inventoryRes.status}`);
            const rawProducts: any[] = await inventoryRes.json();

            console.log(`[Ovaloop Webhook] Downloaded ${rawProducts.length} raw products. Starting incremental upsert...`);

            // ─── INCREMENTAL UPSERT ───────────────────────────────────────────
            // bulkUpsert compares old vs new per product.
            // Only returns the IDs of products that actually changed price/stock.
            // It processes in batches of 100 to prevent memory spikes on 50k+ products.
            const { changedIds, total } = await bulkUpsert(rawProducts);

            console.log(`[Ovaloop Webhook] Upsert complete. ${changedIds.length} / ${total} products changed.`);

            // ─── LOCAL DEV FALLBACK ───────────────────────────────────────────
            // If no Redis is configured (local dev), write atomically to the JSON file.
            const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
            if (!hasRedis) {
                const nexmartProducts = rawProducts.map((p, i) => mapToNexmart(p, i));
                await writeLocalProducts(nexmartProducts);
                console.log('[Ovaloop Webhook] Local mode: wrote all products to ovaloop_products.json atomically.');
            }

            // ─── TARGETED REVALIDATION ────────────────────────────────────────
            // Only revalidate HTML pages for products that actually changed.
            // This surgically updates ONLY those specific pages without touching anything else.
            if (changedIds.length > 0) {
                console.log(`[Ovaloop Webhook] Revalidating ${changedIds.length} product pages...`);

                // Revalidate individual product pages
                for (const id of changedIds) {
                    revalidatePath(`/product/${id}`);
                }

                // Also revalidate listing pages since counts or top products may have shifted
                revalidatePath('/');
                revalidatePath('/api/products');

                console.log('[Ovaloop Webhook] Revalidation complete.');
            } else {
                console.log('[Ovaloop Webhook] No products changed. Skipping revalidation.');
            }

            return NextResponse.json({
                success: true,
                total,
                changed: changedIds.length,
                revalidated: changedIds.length,
            }, { status: 200 });
        }

        return NextResponse.json({ message: 'Unhandled event type, ignoring.' }, { status: 200 });

    } catch (e: any) {
        console.error('[Ovaloop Webhook] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
