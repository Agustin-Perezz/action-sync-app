import { z } from "zod";

export const addManualTaskRequestDto = z.object({
  transcriptId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type AddManualTaskRequestDto = z.infer<typeof addManualTaskRequestDto>;
