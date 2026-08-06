"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signInWithMagicLinkSchema } from "@/application/use-cases/auth/sign-in-with-magic-link/sign-in-with-magic-link.request.dto";
import type { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { createAuthContainer } from "@/lib/containers/auth.container";
import { AUTH_CALLBACK_PATH } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export type MagicLinkState = {
  error?: string;
  success?: string;
};

export async function signInWithMagicLinkAction(
  _prevState: MagicLinkState,
  formData: FormData,
): Promise<MagicLinkState> {
  const parsed = signInWithMagicLinkSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  try {
    const supabase = await createSupabaseServerClient();
    const { signInWithMagicLink } = createAuthContainer(supabase);

    await signInWithMagicLink.execute(
      parsed.data,
      `${origin}${AUTH_CALLBACK_PATH}`,
    );

    return { success: "Check your email for the sign-in link." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to send sign-in link",
    };
  }
}

export async function signInWithOAuthAction(
  provider: OAuthProvider,
): Promise<void> {
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const supabase = await createSupabaseServerClient();
  const { signInWithOAuth } = createAuthContainer(supabase);

  const url = await signInWithOAuth.execute(
    provider,
    `${origin}${AUTH_CALLBACK_PATH}`,
  );

  redirect(url);
}
