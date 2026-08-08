import { z } from "zod";

export const disconnectTrelloRequestDto = z.object({
  userId: z.string().uuid(),
});

export type DisconnectTrelloRequestDto = z.infer<
  typeof disconnectTrelloRequestDto
>;
