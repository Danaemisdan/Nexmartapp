/**
 * Nexmart DB Abstraction Layer
 * 
 * In PRODUCTION (Vercel): reads/writes to Upstash Redis (free tier, 10,000 req/day)
 * In LOCAL DEV: falls back to the local ovaloop_products.json file
 * 
 * The interface is IDENTICAL in both environments. No code changes needed when switching.
 */

import path from 'path';

// ─── Canonical Product Type ─────────────────────────────────────────────────
export interface NexmartProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
  sku: string;
}

// ─── Redis Keys ─────────────────────────────────────────────────────────────
const PRODUCT_INDEX_KEY = 'nexmart:product_ids';
const productKey = (id: string) => `nexmart:product:${id}`;

// ─── Redis Client (lazy) ─────────────────────────────────────────────────────
let _redis: any = null;

async function getRedis() {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const { Redis } = await import('@upstash/redis');
  _redis = new Redis({ url, token });
  return _redis;
}

// ─── Local JSON Fallback ─────────────────────────────────────────────────────
async function getLocalProducts(): Promise<NexmartProduct[]> {
  try {
    const fs = await import('fs');
    const filePath = path.join(process.cwd(), 'src/lib/ovaloop_products.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(raw);
    // Map raw Ovaloop schema to NexmartProduct
    return items.map((p: any, i: number) => mapToNexmart(p, i));
  } catch {
    return [];
  }
}

// ─── Ovaloop → NexmartProduct Mapper ────────────────────────────────────────
export function mapToNexmart(p: any, index: number = 0): NexmartProduct {
  const price = parseFloat(p.selling_price) || parseFloat(p.price) || 0;
  const originalPrice = parseFloat(p.cost_price) || price * 1.2;
  const id = String(p.id || p.sku || index);
  const stock = parseInt(p.stock_unit) || parseInt(p.stock) || 0;

  return {
    id,
    title: p.name || p.title || 'Unnamed Product',
    description: p.product_description || p.description || '',
    price,
    originalPrice: Math.round(originalPrice * 100) / 100,
    discount: originalPrice > price ? `-${Math.round((1 - price / originalPrice) * 100)}%` : '',
    rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
    reviews: Math.floor(Math.random() * 500) + 10,
    image: p.image_path || p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: p.category || 'General',
    brand: p.brand || p.manufacturer || 'Generic',
    stock,
    sku: p.sku || id,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get all products (paginated, for listing pages)
 */
export async function getAllProducts(limit = 100, offset = 0): Promise<NexmartProduct[]> {
  const redis = await getRedis();

  if (!redis) {
    const local = await getLocalProducts();
    return local.slice(offset, offset + limit);
  }

  // Get paginated IDs from sorted set
  const ids: string[] = await redis.zrange(PRODUCT_INDEX_KEY, offset, offset + limit - 1);
  if (!ids.length) return [];

  // Batch fetch all product hashes in a single pipeline
  const pipeline = redis.pipeline();
  ids.forEach((id: string) => pipeline.hgetall(productKey(id)));
  const results = await pipeline.exec();

  return results.filter(Boolean) as NexmartProduct[];
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<NexmartProduct | null> {
  const redis = await getRedis();

  if (!redis) {
    const local = await getLocalProducts();
    return local.find(p => p.id === id) || null;
  }

  const product = await redis.hgetall(productKey(id));
  return product as NexmartProduct | null;
}

/**
 * Get all product IDs (used for Next.js generateStaticParams)
 */
export async function getAllProductIds(): Promise<string[]> {
  const redis = await getRedis();

  if (!redis) {
    const local = await getLocalProducts();
    return local.map(p => p.id);
  }

  return redis.zrange(PRODUCT_INDEX_KEY, 0, -1);
}

/**
 * Upsert a single product — INCREMENTAL, safe, does NOT touch other products.
 * Returns { changed: boolean } so the webhook knows to revalidate only if something actually changed.
 */
export async function upsertProduct(raw: any, index: number = 0): Promise<{ changed: boolean; product: NexmartProduct }> {
  const product = mapToNexmart(raw, index);
  const redis = await getRedis();

  if (!redis) {
    // Local mode: just return the product (writes happen in bulk via writeLocalProducts)
    return { changed: true, product };
  }

  // Check if product already exists and get old price/stock
  const existing = await redis.hgetall(productKey(product.id));

  const priceChanged = existing && String(existing.price) !== String(product.price);
  const stockChanged = existing && String(existing.stock) !== String(product.stock);
  const isNew = !existing;
  const changed = isNew || priceChanged || stockChanged;

  // Write the product hash to Redis
  await redis.hset(productKey(product.id), product as any);
  // Add to the sorted index (score = price for sorting by price)
  await redis.zadd(PRODUCT_INDEX_KEY, { score: product.price, member: product.id });

  return { changed, product };
}

/**
 * Bulk upsert from a full Ovaloop inventory dump.
 * Returns only the IDs of products that actually changed, so we revalidate ONLY those.
 */
export async function bulkUpsert(rawProducts: any[]): Promise<{ changedIds: string[]; total: number }> {
  const changedIds: string[] = [];

  // Process in batches of 100 to avoid memory spikes
  const BATCH_SIZE = 100;
  for (let i = 0; i < rawProducts.length; i += BATCH_SIZE) {
    const batch = rawProducts.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((p, j) => upsertProduct(p, i + j)));
    results.forEach(({ changed, product }) => {
      if (changed) changedIds.push(product.id);
    });
  }

  return { changedIds, total: rawProducts.length };
}

/**
 * Write all products to local JSON file (local dev only, atomic write)
 */
export async function writeLocalProducts(products: NexmartProduct[]): Promise<void> {
  const fs = await import('fs');
  const filePath = path.join(process.cwd(), 'src/lib/ovaloop_products.json');
  // Write to a temp file first, then rename atomically to avoid corruption mid-write
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(products, null, 2));
  fs.renameSync(tmp, filePath);
}
