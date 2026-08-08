import { z } from "zod";

export const getTrelloConnectionRequestDto = z.object({
  userId: z.string().uuid(),
});

export type GetTrelloConnectionRequestDto = z.infer<
  typeof getTrelloConnectionRequestDto
>;
