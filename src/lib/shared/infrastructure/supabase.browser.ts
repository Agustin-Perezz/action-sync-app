import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
