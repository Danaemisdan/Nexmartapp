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
      .select('id, title, price, originalPrice, discount, image, category, rating, reviews')
      .range(offset, offset + limit - 1)
      .order('price', { ascending: false }); // Sort by price or however you want
      
    if (error || !data) return [];
    
    // Map database result to ProductIndexEntry
    return data.map((d: any) => ({
        id: d.id, title: d.title, price: d.price, originalPrice: d.originalPrice, 
        discount: d.discount, image: d.image, category: d.category, 
        rating: d.rating, reviews: d.reviews
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

// ─── Bulk Upsert ─────────────────────────────────────────────────────────────
// Processes the full Ovaloop inventory dump in batches of 100.
// Returns ONLY the IDs of products that actually changed.
export async function bulkUpsert(
  rawProducts: any[]
): Promise<{ changedIds: string[]; total: number }> {
  const changedIds: string[] = [];
  const BATCH = 100;

  if (isSupabaseConfigured() && supabase) {
    // ── Supabase Upsert ──
    for (let i = 0; i < rawProducts.length; i += BATCH) {
      const batch = rawProducts.slice(i, i + BATCH);
      const mappedBatch = batch.map((p, j) => mapToNexmart(p, i + j));

      // 1. Fetch existing products for this batch to compare
      const batchIds = mappedBatch.map(p => p.id);
      const { data: existingData } = await supabase
        .from('products')
        .select('id, price, stock, rating, reviews')
        .in('id', batchIds);

      const existingMap = new Map((existingData || []).map((p: any) => [p.id, p]));
      
      const toUpsert = [];

      // 2. Diff each product
      for (const product of mappedBatch) {
        const existing = existingMap.get(product.id);
        const priceChanged = !existing || existing.price !== product.price;
        const stockChanged = !existing || existing.stock !== product.stock;
        const isNew = !existing;
        const changed = isNew || priceChanged || stockChanged;

        if (changed) {
          if (existing) {
            // Preserve existing rating/reviews
            product.rating = existing.rating;
            product.reviews = existing.reviews;
          }
          toUpsert.push(product);
          changedIds.push(product.id);
        }
      }

      // 3. Upsert the changed ones
      if (toUpsert.length > 0) {
        const { error } = await supabase
            .from('products')
            .upsert(toUpsert, { onConflict: 'id' });
            
        if (error) {
            console.error("Supabase upsert error:", error);
        }
      }
    }
  } else {
     // ── Local File Fallback ──
     // Re-use logic from previous implementation for local dev
     console.log("Supabase not configured, using local file writes...");
     
     // Helper for atomic file write
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
                if (fs.existsSync(filePath)) {
                    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                }
            } catch {}
            
            const priceChanged = !existing || existing.price !== product.price;
            const stockChanged = !existing || existing.stock !== product.stock;
            const isNew = !existing;
            const changed = isNew || priceChanged || stockChanged;
            
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
    
    // Rebuild index
    if (fs.existsSync(DATA_DIR)) {
        const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
        const entries: ProductIndexEntry[] = [];
        for (const file of files) {
            try {
                const p: NexmartProduct = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
                entries.push({ id: p.id, title: p.title, price: p.price, originalPrice: p.originalPrice, discount: p.discount, image: p.image, category: p.category, rating: p.rating, reviews: p.reviews });
            } catch {}
        }
        writeAtomic(INDEX_FILE, entries);
    }
  }

  return { changedIds, total: rawProducts.length };
}
