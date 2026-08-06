"use client";

import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export type UploadActionsProps = {
  readonly isExtracting: boolean;
  readonly onExtract: () => void;
};

export function UploadActions({ isExtracting, onExtract }: UploadActionsProps) {
  return (
    <Button
      type="button"
      onClick={onExtract}
      disabled={isExtracting}
      className="h-11 gap-2 rounded-xl px-6 text-sm"
    >
      {isExtracting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {isExtracting ? "Extracting…" : "Extract Tasks"}
    </Button>
  );
}
