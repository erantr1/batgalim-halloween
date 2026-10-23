import { createClient } from "@supabase/supabase-js";

// Anon/publishable key only. Never the service_role/secret key (CLAUDE.md privacy rules).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // A slow or overloaded database fails after 15s, so pages show their error message instead of loading forever.
  { global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15_000) }) } },
);
