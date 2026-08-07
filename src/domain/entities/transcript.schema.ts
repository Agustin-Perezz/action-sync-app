import { z } from "zod";
import { TRANSCRIPT_TITLE_MAX_LENGTH } from "./transcript.entity";

export const transcriptTitleSchema = z
  .string()
  .min(1)
  .max(TRANSCRIPT_TITLE_MAX_LENGTH);

export const transcriptRawTextSchema = z.string().min(1);

export const transcriptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: transcriptTitleSchema,
  rawText: transcriptRawTextSchema,
  status: z.enum(["processing", "reviewing", "completed", "failed"]),
  createdAt: z.string(),
});

export type TranscriptSchema = z.infer<typeof transcriptSchema>;
