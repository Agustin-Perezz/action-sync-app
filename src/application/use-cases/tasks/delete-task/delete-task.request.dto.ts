import { z } from "zod";

export const deleteTaskRequestDto = z.object({
  id: z.uuid(),
  userId: z.uuid(),
});

export type DeleteTaskRequestDto = z.infer<typeof deleteTaskRequestDto>;
