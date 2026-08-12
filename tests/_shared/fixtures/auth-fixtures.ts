import { createChunks } from "@supabase/ssr/dist/main/utils/chunker";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/infrastructure/database/postgres/database.types";

const supabaseUrl = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
const AUTH_STORAGE_KEY_PREFIX = "sb-";
const AUTH_STORAGE_KEY_SUFFIX = "-auth-token";
const APP_COOKIE_DOMAIN = "localhost";
const APP_COOKIE_PATH = "/";
const PASSWORD = "Test1234!";

export type TestUser = {
  id: string;
  email: string;
  password: string;
};

export async function createTestUser(
  admin: SupabaseClient<Database>,
): Promise<TestUser> {
  const id = crypto.randomUUID();
  const email = `e2e-${id}@test.com`;

  const { error } = await admin.auth.admin.createUser({
    id,
    email,
    password: PASSWORD,
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  return { id, email, password: PASSWORD };
}

export async function deleteTestUser(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete test user: ${error.message}`);
  }
}

export type SessionCookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
};

export async function signInAndGetCookies(
  admin: SupabaseClient<Database>,
  email: string,
  password: string,
): Promise<SessionCookie[]> {
  const { data, error } = await admin.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw new Error(`Failed to sign in for cookies: ${error?.message}`);
  }

  const host = new URL(supabaseUrl).hostname.split(".")[0];
  const storageKey = `${AUTH_STORAGE_KEY_PREFIX}${host}${AUTH_STORAGE_KEY_SUFFIX}`;
  const value = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at,
    token_type: "bearer",
    user: data.user,
  });

  const chunks = createChunks(storageKey, value);
  return chunks.map((chunk) => ({
    name: chunk.name,
    value: chunk.value,
    domain: APP_COOKIE_DOMAIN,
    path: APP_COOKIE_PATH,
  }));
}
