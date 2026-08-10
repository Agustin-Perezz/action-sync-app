"use client";

import { useState, useTransition } from "react";

import { FileDropzone } from "@/components/ui/file-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { extractTasksFromText } from "../actions";
import { UploadActions } from "./UploadActions";

export function UploadForm() {
  const [rawText, setRawText] = useState("");
  const [isExtracting, startTransition] = useTransition();

  function handleExtract() {
    if (rawText.trim().length === 0) return;
    startTransition(async () => {
      // The action redirects to /review?transcript={id} on success; for
      // anonymous visitors it redirects to /signin via requireUser().
      await extractTasksFromText(rawText);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <FileDropzone
        onFilesSelected={() => undefined}
        accept={{ "text/plain": [".txt"] }}
        multiple={false}
        label="Drag a .txt file or click to browse"
        description="Meeting transcripts only"
      />
      <div className="flex flex-col gap-2">
        <label
          htmlFor="transcript-text"
          className="text-sm font-medium text-muted-foreground"
        >
          Or paste transcript text
        </label>
        <Textarea
          id="transcript-text"
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder="Paste your meeting transcript here…"
          className="min-h-[160px] bg-card"
        />
      </div>
      <UploadActions isExtracting={isExtracting} onExtract={handleExtract} />
    </div>
  );
}
