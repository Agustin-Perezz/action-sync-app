import { z } from "zod";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";

export const signInWithOAuthSchema = z.object({
  provider: z.enum(OAuthProvider),
});

export type SignInWithOAuthDto = z.infer<typeof signInWithOAuthSchema>;
