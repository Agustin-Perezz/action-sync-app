import { FileDropzone } from "@/components/ui/file-dropzone";

const ACCEPTED_EXTENSIONS = [".txt"] as const;
const ACCEPTED_MIME_TYPES = ["text/plain"] as const;

const DROPZONE_ACCEPT = Object.fromEntries(
  ACCEPTED_MIME_TYPES.map((mime) => [mime, [...ACCEPTED_EXTENSIONS]]),
);

export type TranscriptDropzoneProps = {
  readonly onFilesSelected: (files: File[]) => void;
};

export function TranscriptDropzone({
  onFilesSelected,
}: TranscriptDropzoneProps) {
  return (
    <FileDropzone
      onFilesSelected={onFilesSelected}
      accept={DROPZONE_ACCEPT}
      multiple={false}
      label="Drag a .txt file or click to browse"
      description="Meeting transcripts only"
    />
  );
}
