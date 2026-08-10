import type { Page } from "@playwright/test";
import { createChunks } from "@supabase/ssr/dist/main/utils/chunker";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

const TEST_USER = {
  email: "e2e@test.local",
  password: "test-password-123",
} as const;

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureTestUser(): Promise<void> {
  const { error } = await adminClient.auth.admin.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    email_confirm: true,
  });
  // User already exists is fine — we just sign in below.
  if (error && !error.message.includes("already been registered")) {
    throw new Error(`Failed to create E2E test user: ${error.message}`);
  }
}

async function signInAndInjectCookies(page: Page): Promise<void> {
  const authClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await authClient.auth.signInWithPassword({
    email: TEST_USER.email,
    password: TEST_USER.password,
  });

  if (error || !data.session) {
    throw new Error(
      `E2E auth fixture sign-in failed: ${error?.message ?? "no session"}`,
    );
  }

  // @supabase/supabase-js derives the storage key from the URL hostname's
  // first dot-separated segment: sb-${hostname.split('.')[0]}-auth-token.
  // For http://127.0.0.1:54321 this is sb-127-auth-token.
  const host = new URL(supabaseUrl).hostname.split(".")[0];
  const storageKey = `sb-${host}-auth-token`;
  const value = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    expires_at: data.session.expires_at,
    token_type: "bearer",
    user: data.user,
  });

  const chunks = createChunks(storageKey, value);
  await page.context().addCookies(
    chunks.map((chunk) => ({
      name: chunk.name,
      value: chunk.value,
      domain: "localhost",
      path: "/",
    })),
  );
}

export async function authenticate(page: Page): Promise<void> {
  await ensureTestUser();
  await signInAndInjectCookies(page);
}
