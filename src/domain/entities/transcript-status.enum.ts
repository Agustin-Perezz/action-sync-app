export const TRANSCRIPT_STATUS = {
  PROCESSING: "processing",
  REVIEWING: "reviewing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type TranscriptStatus =
  (typeof TRANSCRIPT_STATUS)[keyof typeof TRANSCRIPT_STATUS];
