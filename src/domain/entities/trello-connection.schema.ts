import { z } from "zod";

export const trelloConnectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  trelloMemberId: z.string().check(z.minLength(1)),
  accessToken: z.string().check(z.minLength(1)),
  defaultBoardId: z.string().nullable(),
  defaultListId: z.string().nullable(),
  updatedAt: z.string(),
});

export type TrelloConnectionSchema = z.infer<typeof trelloConnectionSchema>;
