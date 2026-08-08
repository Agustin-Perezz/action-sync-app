import { z } from "zod";

export const addManualTaskRequestDto = z.object({
  transcriptId: z.uuid(),
  userId: z.uuid(),
});

export type AddManualTaskRequestDto = z.infer<typeof addManualTaskRequestDto>;
