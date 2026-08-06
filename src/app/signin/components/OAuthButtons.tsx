"use client";

import { Button } from "@/components/ui/button";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { signInWithOAuthAction } from "../actions";

export function OAuthButtons() {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signInWithOAuthAction(OAuthProvider.Google)}
      >
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signInWithOAuthAction(OAuthProvider.Facebook)}
      >
        Continue with Facebook
      </Button>
    </div>
  );
}
