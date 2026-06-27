import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DATA_DIR = path.join(process.cwd(), 'public/data/products');
const INDEX_FILE = path.join(process.cwd(), 'public/data/index.json');

async function sync() {
  console.log('Fetching products from Supabase...');
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const index = data.map((d: any) => ({
    id: d.id, title: d.title, price: d.price, originalPrice: d.originalPrice, 
    discount: d.discount, image: d.image, category: d.category, 
    rating: d.rating, reviews: d.reviews, business_id: d.business_id
  }));

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`Wrote index.json with ${index.length} products.`);

  for (const p of data) {
    fs.writeFileSync(path.join(DATA_DIR, `${p.id}.json`), JSON.stringify(p, null, 2));
  }
  console.log(`Wrote ${data.length} product files to ${DATA_DIR}.`);
}

sync();
