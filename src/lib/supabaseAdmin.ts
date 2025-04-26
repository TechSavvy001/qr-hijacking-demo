import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,           // KEIN "NEXT_PUBLIC"
  process.env.SUPABASE_ANON_KEY! 
);

export default supabase;
