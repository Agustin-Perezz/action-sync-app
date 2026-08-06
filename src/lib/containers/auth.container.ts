import type { SupabaseClient } from "@supabase/supabase-js";
import { SignInWithMagicLinkUseCase } from "@/application/use-cases/auth/sign-in-with-magic-link/sign-in-with-magic-link.use-case";
import { SignInWithOAuthUseCase } from "@/application/use-cases/auth/sign-in-with-oauth/sign-in-with-oauth.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseAuthRepository } from "@/infrastructure/database/postgres/repositories/auth/supabase-auth.repository";

export type AuthContainer = {
  signInWithMagicLink: SignInWithMagicLinkUseCase;
  signInWithOAuth: SignInWithOAuthUseCase;
};

export function createAuthContainer(
  supabase: SupabaseClient<Database>,
): AuthContainer {
  const authRepository = new SupabaseAuthRepository(supabase);

  return {
    signInWithMagicLink: new SignInWithMagicLinkUseCase(authRepository),
    signInWithOAuth: new SignInWithOAuthUseCase(authRepository),
  };
}
