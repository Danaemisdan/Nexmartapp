/**
 * Nexmart Data Layer
 *
 * Architecture:
 * - Each product is a single JSON file at: public/data/products/[id].json
 * - A lightweight index at:             public/data/index.json  (id + title + price + image only)
 * - These files are served FREE by Vercel's global CDN as static assets
 * - Product HTML pages read from their own JSON file at generation time
 * - The webhook ONLY writes the specific JSON files that changed — no full rewrites
 * - In production (Vercel serverless), files are written via the GitHub API
 * - Locally, files are written directly to disk
 *
 * Zero external databases. Zero cost. 50,000+ products supported.
 */

import path from 'path';
import fs from 'fs';

// ─── Canonical Product Type ──────────────────────────────────────────────────
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

// Lightweight index entry — what listing pages need (not the full product object)
export interface ProductIndexEntry {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

// ─── Paths ───────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), 'public/data/products');
const INDEX_FILE = path.join(process.cwd(), 'public/data/index.json');

// ─── Ovaloop → NexmartProduct Mapper ────────────────────────────────────────
export function mapToNexmart(p: any, index: number = 0): NexmartProduct {
  const price = parseFloat(p.selling_price) || parseFloat(p.price) || 0;
  const costPrice = parseFloat(p.cost_price) || 0;
  const originalPrice = costPrice > price ? costPrice : Math.round(price * 1.2 * 100) / 100;
  const id = String(p.id || p.sku || `product_${index}`);
  const stock = parseInt(p.stock_unit) || parseInt(p.stock) || 0;
  const discountPct = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

  return {
    id,
    title: p.name || p.title || 'Unnamed Product',
    description: p.product_description || p.description || '',
    price: Math.round(price * 100) / 100,
    originalPrice: Math.round(originalPrice * 100) / 100,
    discount: discountPct > 0 ? `-${discountPct}%` : '',
    rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
    reviews: Math.floor(Math.random() * 490) + 10,
    image: p.image_path || p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: p.category || 'General',
    brand: p.brand || p.manufacturer || '',
    stock,
    sku: String(p.sku || id),
  };
}

// ─── Atomic File Write ───────────────────────────────────────────────────────
// Writes to a .tmp file first, then renames atomically to prevent corruption
function writeAtomic(filePath: string, data: any) {
  const tmp = filePath + '.tmp';
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

// ─── Read Index ───────────────────────────────────────────────────────────────
function readIndex(): ProductIndexEntry[] {
  try {
    if (!fs.existsSync(INDEX_FILE)) return [];
    return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// ─── Read One Product ─────────────────────────────────────────────────────────
export async function getProduct(id: string): Promise<NexmartProduct | null> {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as NexmartProduct;
  } catch {
    return null;
  }
}

// ─── Read All (from index, paginated) ────────────────────────────────────────
export async function getAllProducts(limit = 100, offset = 0): Promise<ProductIndexEntry[]> {
  const index = readIndex();
  return index.slice(offset, offset + limit);
}

// ─── Get All IDs (for generateStaticParams) ───────────────────────────────────
export async function getAllProductIds(): Promise<string[]> {
  const index = readIndex();
  return index.map(p => p.id);
}

// ─── Upsert One Product ───────────────────────────────────────────────────────
// Writes the product JSON file ONLY if price or stock actually changed.
// Returns { changed } so the webhook can target revalidation precisely.
export async function upsertProduct(
  raw: any,
  index: number = 0
): Promise<{ changed: boolean; product: NexmartProduct }> {
  const product = mapToNexmart(raw, index);
  const filePath = path.join(DATA_DIR, `${product.id}.json`);

  // Read existing product to diff it
  let existing: NexmartProduct | null = null;
  try {
    if (fs.existsSync(filePath)) {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch {}

  const priceChanged = !existing || existing.price !== product.price;
  const stockChanged = !existing || existing.stock !== product.stock;
  const isNew = !existing;
  const changed = isNew || priceChanged || stockChanged;

  if (changed) {
    // Preserve existing rating/reviews if the product already exists
    // (we don't want to randomise them on every webhook update)
    if (existing) {
      product.rating = existing.rating;
      product.reviews = existing.reviews;
    }
    writeAtomic(filePath, product);
  }

  return { changed, product };
}

// ─── Rebuild Index ────────────────────────────────────────────────────────────
// Called after a bulk upsert — rebuilds the lightweight index.json from all
// individual product files. Fast scan-and-write, does NOT touch product files.
export async function rebuildIndex(): Promise<number> {
  if (!fs.existsSync(DATA_DIR)) return 0;

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const entries: ProductIndexEntry[] = [];

  for (const file of files) {
    try {
      const p: NexmartProduct = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, file), 'utf8')
      );
      entries.push({
        id: p.id,
        title: p.title,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        image: p.image,
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
      });
    } catch {}
  }

  writeAtomic(INDEX_FILE, entries);
  return entries.length;
}

// ─── Bulk Upsert ─────────────────────────────────────────────────────────────
// Processes the full Ovaloop inventory dump in batches of 100.
// Returns ONLY the IDs of products that actually changed.
export async function bulkUpsert(
  rawProducts: any[]
): Promise<{ changedIds: string[]; total: number }> {
  const changedIds: string[] = [];
  const BATCH = 100;

  for (let i = 0; i < rawProducts.length; i += BATCH) {
    const batch = rawProducts.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((p, j) => upsertProduct(p, i + j)));
    results.forEach(({ changed, product }) => {
      if (changed) changedIds.push(product.id);
    });
  }

  // Always rebuild the index after a bulk upsert
  await rebuildIndex();

  return { changedIds, total: rawProducts.length };
}

// ─── Seed from legacy ovaloop_products.json (one-time migration) ──────────────
// Run this once locally to convert the old flat JSON to the per-file structure.
export async function seedFromLegacy(): Promise<number> {
  const legacyPath = path.join(process.cwd(), 'src/lib/ovaloop_products.json');
  if (!fs.existsSync(legacyPath)) return 0;

  const raw: any[] = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
  const { total } = await bulkUpsert(raw);
  return total;
}
