// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Dies ist der Supabase-Client für den Client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Achte darauf, dass dies in .env.local definiert ist
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabaseClient;
