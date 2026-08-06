"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FileDropzone } from "@/components/ui/file-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { UploadActions } from "./UploadActions";

const EXTRACT_DELAY_MS = 1200;

export function UploadForm() {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);

  function handleExtract() {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      router.push("/review");
    }, EXTRACT_DELAY_MS);
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
          placeholder="Paste your meeting transcript here…"
          className="min-h-[160px] bg-card"
        />
      </div>
      <UploadActions isExtracting={isExtracting} onExtract={handleExtract} />
    </div>
  );
}
