import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

async function buildSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

// ponytail: one client per request — getUser/requireUser/trello-connection
// all share the same SupabaseClient instead of constructing 3+ instances.
export const createSupabaseServerClient = cache(buildSupabaseServerClient);
