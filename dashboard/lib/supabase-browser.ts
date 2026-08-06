// lib/supabase-browser.ts
// Client Supabase com anon key — seguro para uso no browser (uploads de arquivo)

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase-types";

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function browserDb() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  _client = createClient<Database>(url, key);
  return _client;
}
