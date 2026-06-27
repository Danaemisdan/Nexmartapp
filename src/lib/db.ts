/**
 * Nexmart Data Layer — Supabase
 *
 * Architecture:
 * - Products are stored in a Supabase Postgres database.
 * - The Ovaloop webhook updates Supabase, inserting new products and updating existing ones.
 * - Local dev mode still falls back to public/data if Supabase isn't configured, ensuring smooth local dev.
 */

import path from 'path';
import fs from 'fs';
import { supabase, isSupabaseConfigured } from './supabase';

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
  business_id?: string;
}

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
  business_id?: string;
}

// ─── Paths (For Local Fallback) ──────────────────────────────────────────────
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
    business_id: p.business_id || p.business || '',
  };
}

// ─── Read One Product ─────────────────────────────────────────────────────────
export async function getProduct(id: string): Promise<NexmartProduct | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data as NexmartProduct;
  }

  // Local fallback
  const filePath = path.join(DATA_DIR, `${id}.json`);
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as NexmartProduct;
  } catch {
    return null;
  }
}

// ─── Read All (paginated) ────────────────────────────────────────────────────
export async function getAllProducts(limit = 100, offset = 0): Promise<ProductIndexEntry[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, price, originalPrice, discount, image, category, rating, reviews, business_id')
      .range(offset, offset + limit - 1)
      .order('price', { ascending: false }); // Sort by price or however you want
      
    if (error || !data) return [];
    
    // Map database result to ProductIndexEntry
    return data.map((d: any) => ({
        id: d.id, title: d.title, price: d.price, originalPrice: d.originalPrice, 
        discount: d.discount, image: d.image, category: d.category, 
        rating: d.rating, reviews: d.reviews, business_id: d.business_id
    }));
  }

  // Local fallback
  try {
    if (!fs.existsSync(INDEX_FILE)) return [];
    const index: ProductIndexEntry[] = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    return index.slice(offset, offset + limit);
  } catch {
    return [];
  }
}

// ─── Get All IDs (for generateStaticParams) ───────────────────────────────────
export async function getAllProductIds(): Promise<string[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('id');
    if (error || !data) return [];
    return data.map((d: any) => d.id);
  }

  // Local fallback
  try {
    if (!fs.existsSync(INDEX_FILE)) return [];
    const index: ProductIndexEntry[] = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    return index.map(p => p.id);
  } catch {
    return [];
  }
}

// ─── Bulk Upsert (Insanely Optimized for 100k+ Products) ───────────
// Ovaloop sends the full 100k inventory as a massive JSON. If we diff 1-by-1, Vercel times out.
// The solution:
// 1. Fetch ALL existing basic metadata (id, price, stock) from Supabase (fast, paginated).
// 2. Diff against the massive JSON entirely in memory (instant).
// 3. Upsert ONLY the products that actually changed in chunks of 1000.
export async function bulkUpsert(
  rawProducts: any[]
): Promise<{ changedIds: string[]; total: number }> {
  const changedIds: string[] = [];

  if (isSupabaseConfigured() && supabase) {
    console.log(`[DB] Starting optimized bulk upsert for ${rawProducts.length} products...`);
    
    // 1. Fetch existing map efficiently (paginated to avoid PostgREST limits)
    const existingMap = new Map<string, any>();
    let offset = 0;
    const fetchLimit = 2000;
    while (true) {
      const { data, error } = await supabase
        .from('products')
        .select('id, price, stock, rating, reviews')
        .range(offset, offset + fetchLimit - 1);
        
      if (error) {
        console.error('[DB] Error fetching existing products:', error);
        break;
      }
      if (!data || data.length === 0) break;
      
      for (const p of data) existingMap.set(p.id, p);
      if (data.length < fetchLimit) break;
      offset += fetchLimit;
    }
    console.log(`[DB] Fetched ${existingMap.size} existing products for memory diffing.`);

    // 2. Diff in memory
    const toUpsert: NexmartProduct[] = [];
    for (let i = 0; i < rawProducts.length; i++) {
      const product = mapToNexmart(rawProducts[i], i);
      const existing = existingMap.get(product.id);

      const priceChanged = !existing || existing.price !== product.price;
      const stockChanged = !existing || existing.stock !== product.stock;
      const isNew = !existing;
      
      if (isNew || priceChanged || stockChanged) {
        if (existing) {
          // Preserve existing rating/reviews
          product.rating = existing.rating;
          product.reviews = existing.reviews;
        }
        toUpsert.push(product);
        changedIds.push(product.id);
      }
    }

    console.log(`[DB] Diff complete: ${toUpsert.length} products actually changed.`);

    // 3. Push only the changed products in chunks of 1000
    const UPSERT_CHUNK = 1000;
    for (let i = 0; i < toUpsert.length; i += UPSERT_CHUNK) {
      const chunk = toUpsert.slice(i, i + UPSERT_CHUNK);
      const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'id' });
      if (error) console.error(`[DB] Upsert error chunk ${i}:`, error);
    }
    console.log('[DB] Supabase upsert complete.');

  } else {
    // ── Local Fallback (unchanged) ──
    const BATCH = 100;
    const writeAtomic = (filePath: string, data: any) => {
       const tmp = filePath + '.tmp';
       fs.mkdirSync(path.dirname(filePath), { recursive: true });
       fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
       fs.renameSync(tmp, filePath);
    };

    for (let i = 0; i < rawProducts.length; i += BATCH) {
       const batch = rawProducts.slice(i, i + BATCH);
       for (let j=0; j < batch.length; j++) {
           const product = mapToNexmart(batch[j], i + j);
           const filePath = path.join(DATA_DIR, `${product.id}.json`);
           let existing: NexmartProduct | null = null;
           try {
               if (fs.existsSync(filePath)) existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
           } catch {}
           const changed = !existing || existing.price !== product.price || existing.stock !== product.stock;
           if (changed) {
               if (existing) {
                   product.rating = existing.rating;
                   product.reviews = existing.reviews;
               }
               writeAtomic(filePath, product);
               changedIds.push(product.id);
           }
       }
    }
  }

  return { changedIds, total: rawProducts.length };
}
