import { z } from "zod";

export const connectTrelloRequestDto = z.object({
  userId: z.string().uuid(),
  token: z.string().min(1),
});

export type ConnectTrelloRequestDto = z.infer<typeof connectTrelloRequestDto>;
