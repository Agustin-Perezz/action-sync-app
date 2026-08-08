import { z } from "zod";

export const extractTasksRequestDto = z.object({
  userId: z.string().uuid(),
  rawText: z.string().check(z.minLength(1)),
  transcriptId: z.string().uuid().optional(),
});

export type ExtractTasksRequestDto = z.infer<typeof extractTasksRequestDto>;
