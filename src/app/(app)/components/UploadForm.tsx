"use client";

import { useState, useTransition } from "react";

import { extractTasksFromText } from "../actions";
import { TranscriptDropzone } from "./TranscriptDropzone";
import { TranscriptInput } from "./TranscriptInput";
import { UploadActions } from "./UploadActions";

export function UploadForm() {
  const [rawText, setRawText] = useState("");
  const [extractError, setExtractError] = useState<string | null>(null);
  const [isExtracting, startTransition] = useTransition();

  function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) return;
    file
      .text()
      .then(setRawText)
      .catch(() => {
        setExtractError("Failed to read file. Please try pasting the text.");
      });
  }

  function handleExtract() {
    if (rawText.trim().length === 0) return;
    setExtractError(null);
    startTransition(async () => {
      try {
        await extractTasksFromText(rawText);
      } catch (error) {
        setExtractError(
          error instanceof Error
            ? error.message
            : "Extraction failed. Please try again.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <TranscriptDropzone onFilesSelected={handleFilesSelected} />
      <TranscriptInput value={rawText} onChange={setRawText} />
      {extractError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {extractError}
        </p>
      )}
      <UploadActions isExtracting={isExtracting} onExtract={handleExtract} />
    </div>
  );
}
