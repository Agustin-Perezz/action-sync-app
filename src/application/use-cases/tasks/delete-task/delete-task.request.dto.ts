import { z } from "zod";

export const deleteTaskRequestDto = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export type DeleteTaskRequestDto = z.infer<typeof deleteTaskRequestDto>;
