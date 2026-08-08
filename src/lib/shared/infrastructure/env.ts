// Public env vars — validated at module load (needed by client + server).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL — set it in your .env file",
  );
}

if (!publishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — set it in your .env file",
  );
}

// Server-only secrets — lazy getters so the module loads at build time.
// Throws on first call (request-time), not on import (build-time).
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} — set it in your .env file`);
  }
  return value;
}

// Config value, not a secret — the only env var allowed a default.
const aiModel = process.env.AI_MODEL ?? "gpt-4o";
const trelloApiBaseUrl =
  process.env.TRELLO_API_BASE_URL ?? "https://api.trello.com/1";

export const supabaseUrl = url;
export const supabasePublishableKey = publishableKey;
export { aiModel, trelloApiBaseUrl };

export function getTrelloApiKey(): string {
  return requireEnv("TRELLO_API_KEY");
}

export function getOpenaiApiKey(): string {
  return requireEnv("OPENAI_API_KEY");
}
