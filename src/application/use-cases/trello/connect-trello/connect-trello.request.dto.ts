import { z } from "zod";

export const connectTrelloRequestDto = z.object({
  userId: z.string().uuid(),
  token: z.string().check(z.minLength(1)),
});

export type ConnectTrelloRequestDto = z.infer<typeof connectTrelloRequestDto>;
