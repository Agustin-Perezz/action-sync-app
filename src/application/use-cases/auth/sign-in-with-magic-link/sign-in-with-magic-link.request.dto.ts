import { z } from "zod";
import { emailSchema } from "@/domain/entities/auth.schema";

export const signInWithMagicLinkSchema = z.object({
  email: emailSchema,
});

export type SignInWithMagicLinkDto = z.infer<typeof signInWithMagicLinkSchema>;
