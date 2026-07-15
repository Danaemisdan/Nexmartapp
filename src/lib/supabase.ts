import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side only client (uses service role key — never expose this on the frontend)
export const supabase = (supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null) as any;

export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseKey;
}
