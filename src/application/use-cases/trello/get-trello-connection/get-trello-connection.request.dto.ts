import { z } from "zod";

export const getTrelloConnectionRequestDto = z.object({
  userId: z.uuid(),
});

export type GetTrelloConnectionRequestDto = z.infer<
  typeof getTrelloConnectionRequestDto
>;
