import { describe, expect, it, vi } from "vitest";
import { AUTH_CALLBACK_PATH } from "@/lib/shared/infrastructure/auth-paths";
import type { ISignInWithMagicLinkRepository } from "./sign-in-with-magic-link.repository.interface";
import { SignInWithMagicLinkUseCase } from "./sign-in-with-magic-link.use-case";

describe("SignInWithMagicLinkUseCase", () => {
  it("delegates to the repository with the email and redirect target", async () => {
    const repository: ISignInWithMagicLinkRepository = {
      signInWithOtp: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new SignInWithMagicLinkUseCase(repository);

    await useCase.execute({ email: "user@example.com" }, AUTH_CALLBACK_PATH);

    expect(repository.signInWithOtp).toHaveBeenCalledWith(
      "user@example.com",
      AUTH_CALLBACK_PATH,
    );
  });

  it("resolves without a return value", async () => {
    const repository: ISignInWithMagicLinkRepository = {
      signInWithOtp: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new SignInWithMagicLinkUseCase(repository);

    await expect(
      useCase.execute({ email: "user@example.com" }, AUTH_CALLBACK_PATH),
    ).resolves.toBeUndefined();
  });
});
