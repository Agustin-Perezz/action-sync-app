import { describe, expect, it, vi } from "vitest";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
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

    const result = await useCase.execute(OAuthProvider.Google, "/dashboard");

    expect(repository.signInWithOAuth).toHaveBeenCalledWith(
      OAuthProvider.Google,
      "/dashboard",
    );
    expect(result).toBe(oauthUrl);
  });
});
