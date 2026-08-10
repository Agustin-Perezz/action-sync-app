"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { connectTrello } from "./actions";

const TOKEN_HASH_PATTERN = /#token=(.+)/;

export default function TrelloCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const match = window.location.hash.match(TOKEN_HASH_PATTERN);
    if (!match) {
      setError("No token found in URL.");
      return;
    }
    const token = match[1];
    // Clear the fragment so the token does not linger in the address bar.
    window.history.replaceState(null, "", window.location.pathname);
    connectTrello(token)
      .then(() => router.push("/settings"))
      .catch(() => setError("Trello connection failed. Please try again."));
  }, [router]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">Connecting to Trello…</p>
    </div>
  );
}
