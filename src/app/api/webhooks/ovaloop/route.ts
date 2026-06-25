import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { bulkUpsert, rebuildIndex, mapToNexmart, NexmartProduct } from '@/lib/db';
import { OVALOOP_SECRET_KEY } from '@/lib/ovaloop';
import { commitFiles, isGitHubConfigured, GitHubFile } from '@/lib/github';
import fs from 'fs';
import path from 'path';

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

            console.log(`[Ovaloop Webhook] ${rawProducts.length} products received. Diffing...`);

            // ── DIFF: find which products actually changed ────────────────────
            const changedProducts: NexmartProduct[] = [];
            const allProducts: NexmartProduct[] = [];

            for (let i = 0; i < rawProducts.length; i++) {
                const product = mapToNexmart(rawProducts[i], i);
                allProducts.push(product);

                // Check existing file to see if price/stock changed
                const filePath = path.join(process.cwd(), 'public/data/products', `${product.id}.json`);
                let changed = true;
                try {
                    if (fs.existsSync(filePath)) {
                        const existing: NexmartProduct = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        // Preserve existing rating/reviews (don't re-randomise on each update)
                        product.rating = existing.rating;
                        product.reviews = existing.reviews;
                        changed = existing.price !== product.price || existing.stock !== product.stock;
                    }
                } catch {}

                if (changed) changedProducts.push(product);
            }

            console.log(`[Ovaloop Webhook] ${changedProducts.length}/${rawProducts.length} products changed.`);

            if (changedProducts.length === 0) {
                return NextResponse.json({ success: true, total: rawProducts.length, changed: 0 });
            }

            // ── BUILD INDEX from all products ─────────────────────────────────
            const index = allProducts.map(p => ({
                id: p.id, title: p.title, price: p.price,
                originalPrice: p.originalPrice, discount: p.discount,
                image: p.image, category: p.category,
                rating: p.rating, reviews: p.reviews,
            }));

            // ── FILES TO COMMIT ───────────────────────────────────────────────
            // Only changed product JSON files + the updated index
            const files: GitHubFile[] = [
                // Lightweight index (always update it)
                {
                    path: 'public/data/index.json',
                    content: JSON.stringify(index, null, 2),
                },
                // Only the specific product files that actually changed
                ...changedProducts.map(p => ({
                    path: `public/data/products/${p.id}.json`,
                    content: JSON.stringify(p, null, 2),
                })),
            ];

            if (isGitHubConfigured()) {
                // ── PRODUCTION: commit to GitHub → Vercel auto-redeploys ──────
                await commitFiles(
                    files,
                    `[Ovaloop] Update ${changedProducts.length} product(s) — ${new Date().toISOString()}`
                );
                console.log('[Ovaloop Webhook] GitHub commit complete. Vercel will auto-rebuild.');
            } else {
                // ── LOCAL DEV: write files directly to disk ───────────────────
                for (const file of files) {
                    const absPath = path.join(process.cwd(), file.path);
                    fs.mkdirSync(path.dirname(absPath), { recursive: true });
                    const tmp = absPath + '.tmp';
                    fs.writeFileSync(tmp, file.content, 'utf8');
                    fs.renameSync(tmp, absPath);
                }
                // In local dev, also call revalidatePath for hot ISR
                for (const p of changedProducts) {
                    revalidatePath(`/product/${p.id}`);
                }
                revalidatePath('/');
                revalidatePath('/api/products');
                console.log('[Ovaloop Webhook] Local mode: wrote files to disk and revalidated pages.');
            }

            return NextResponse.json({
                success: true,
                total: rawProducts.length,
                changed: changedProducts.length,
                mode: isGitHubConfigured() ? 'github' : 'local',
            });
        }

        return NextResponse.json({ message: 'Ignored unhandled event.' });

    } catch (e: any) {
        console.error('[Ovaloop Webhook] Error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
