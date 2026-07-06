import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { bulkUpsert } from '@/lib/db';
import { OVALOOP_SECRET_KEY } from '@/lib/ovaloop';
import { isSupabaseConfigured } from '@/lib/supabase';

// Give Vercel up to 5 minutes to process massive payloads
export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        
        // --- BULLETPROOF LOGGING ---
        try {
            if (isSupabaseConfigured() && require('@/lib/supabase').supabase) {
                await require('@/lib/supabase').supabase.from('products').upsert({
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
        // ---------------------------

        // === TEMPORARILY DISABLED SIGNATURE VALIDATION ===
        // const signatureHeader = req.headers.get('x-ovaloop-signature');
        // if (!signatureHeader) {
        //     return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        // }
        // 
        // const parsedPayload = JSON.parse(rawBody);
        // const stringifiedBody = JSON.stringify(parsedPayload);
        // 
        // const computedSignature = crypto
        //     .createHmac('sha512', OVALOOP_SECRET_KEY)
        //     .update(rawBody, 'utf8')
        //     .digest('hex');
        // 
        // try {
        //     if (!crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(signatureHeader))) {
        //         console.error('[Ovaloop Webhook] Invalid signature — rejecting');
        //         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        //     }
        // } catch (e) {
        //     console.error('[Ovaloop Webhook] Invalid signature length — rejecting');
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        // =================================================

        const payload = JSON.parse(rawBody);
        console.log(`[Ovaloop Webhook] Event: ${payload.type}`);

        // RELAXED CONDITION: If there is an S3 URL, just process it!
        if (payload && payload.data && payload.data.url) {
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

        return NextResponse.json({ 
            message: 'Ignored unhandled event.',
            received_type: payload.type,
            received_status: payload.status,
            payload: payload
        });

    } catch (e: any) {
        console.error('[Ovaloop Webhook] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
