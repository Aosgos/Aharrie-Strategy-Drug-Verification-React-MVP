import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization — the client is only built (and env vars only checked)
// the first time it's actually used at request time, not at module load time.
// This prevents Next.js's build-time "Collecting page data" step from crashing
// when env vars haven't been configured yet (e.g. first deploy, preview branches).
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY — set these in Vercel: " +
      "Project Settings → Environment Variables, then redeploy."
    );
  }

  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

// Proxy preserves the exact same `import { supabase } from "@/lib/supabase"`
// usage everywhere else in the codebase — no other files need to change.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    return Reflect.get(client, prop, receiver);
  },
});
