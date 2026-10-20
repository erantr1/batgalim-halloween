import { createClient } from "@supabase/supabase-js";

// Anon/publishable key only. Never the service_role/secret key (CLAUDE.md privacy rules).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
