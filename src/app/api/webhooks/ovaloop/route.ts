import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { bulkUpsert } from '@/lib/db';
import { OVALOOP_SECRET_KEY } from '@/lib/ovaloop';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const signatureHeader = req.headers.get('x-ovaloop-signature');
        if (!signatureHeader) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // Verify HMAC SHA512
        const rawBody = await req.text();
        const computedSignature = crypto
            .createHmac('sha512', OVALOOP_SECRET_KEY)
            .update(rawBody, 'utf8')
            .digest('hex');

        if (computedSignature !== signatureHeader) {
            console.error('[Ovaloop Webhook] Invalid signature — rejecting');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        console.log(`[Ovaloop Webhook] Event: ${payload.type}`);

        if (payload.type === 'inventory_request' && payload.status === 'successful') {
            const s3Url = payload.data.url;
            console.log('[Ovaloop Webhook] Downloading inventory from S3...');

            const inventoryRes = await fetch(s3Url);
            if (!inventoryRes.ok) throw new Error(`S3 download failed: ${inventoryRes.status}`);
            const rawProducts: any[] = await inventoryRes.json();

            console.log(`[Ovaloop Webhook] ${rawProducts.length} products received. Diffing and Upserting...`);

            // ── BULK UPSERT ───────────────────────────────────────────────
            // Updates Supabase or falls back to local file writes. 
            // Returns ONLY the IDs of products that actually changed.
            const { changedIds, total } = await bulkUpsert(rawProducts);

            console.log(`[Ovaloop Webhook] ${changedIds.length}/${total} products changed.`);

            // ── SURGICAL REVALIDATION ─────────────────────────────────────────
            if (changedIds.length > 0) {
                // Tell Next.js to regenerate HTML ONLY for changed product pages.
                for (const id of changedIds) {
                    revalidatePath(`/product/${id}`);
                }
                // Revalidate listing/home
                revalidatePath('/');
                revalidatePath('/api/products');
                console.log(`[Ovaloop Webhook] Revalidated ${changedIds.length} product pages.`);
            }

            return NextResponse.json({
                success: true,
                total,
                changed: changedIds.length,
                mode: isSupabaseConfigured() ? 'supabase' : 'local',
            });
        }

        return NextResponse.json({ message: 'Ignored unhandled event.' });

    } catch (e: any) {
        console.error('[Ovaloop Webhook] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
