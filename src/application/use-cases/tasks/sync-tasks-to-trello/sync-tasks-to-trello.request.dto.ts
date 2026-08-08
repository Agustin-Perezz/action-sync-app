import { z } from "zod";

export const syncTasksToTrelloRequestDto = z.object({
  transcriptId: z.string().uuid(),
  userId: z.string().uuid(),
  listId: z.string().check(z.minLength(1)),
});

export type SyncTasksToTrelloRequestDto = z.infer<
  typeof syncTasksToTrelloRequestDto
>;
