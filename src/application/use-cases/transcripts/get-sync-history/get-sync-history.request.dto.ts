import { z } from "zod";

export const getSyncHistoryRequestDto = z.object({
  userId: z.uuid(),
});

export type GetSyncHistoryRequestDto = z.infer<typeof getSyncHistoryRequestDto>;
