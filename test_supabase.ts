import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  const { data, error } = await supabase.from('products').select('*').limit(5);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products:', data);
  }
}
test();
