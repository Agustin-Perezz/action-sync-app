import { z } from "zod";

export const getReviewDataRequestDto = z.object({
  transcriptId: z.uuid(),
  userId: z.uuid(),
});

export type GetReviewDataRequestDto = z.infer<typeof getReviewDataRequestDto>;
