import { z } from "zod";

export const getReviewDataRequestDto = z.object({
  transcriptId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type GetReviewDataRequestDto = z.infer<typeof getReviewDataRequestDto>;
