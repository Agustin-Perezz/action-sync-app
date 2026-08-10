import { describe, expect, it, vi } from "vitest";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { AUTH_CALLBACK_PATH } from "@/lib/shared/infrastructure/auth-paths";
import type { ISignInWithOAuthRepository } from "./sign-in-with-oauth.repository.interface";
import { SignInWithOAuthUseCase } from "./sign-in-with-oauth.use-case";

describe("SignInWithOAuthUseCase", () => {
  it("returns the OAuth URL provided by the repository", async () => {
    const oauthUrl =
      "https://example.supabase.co/auth/callback?provider=google";
    const repository: ISignInWithOAuthRepository = {
      signInWithOAuth: vi.fn().mockResolvedValue(oauthUrl),
    };
    const useCase = new SignInWithOAuthUseCase(repository);

    const result = await useCase.execute(
      OAuthProvider.Google,
      AUTH_CALLBACK_PATH,
    );

    expect(repository.signInWithOAuth).toHaveBeenCalledWith(
      OAuthProvider.Google,
      AUTH_CALLBACK_PATH,
    );
    expect(result).toBe(oauthUrl);
  });
});
