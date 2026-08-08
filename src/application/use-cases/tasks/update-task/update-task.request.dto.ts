import { z } from "zod";

export const updateTaskRequestDto = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  title: z.string().check(z.minLength(1)).optional(),
  description: z.string().check(z.minLength(1)).optional(),
  dueDate: z.string().nullable().optional(),
});

export type UpdateTaskRequestDto = z.infer<typeof updateTaskRequestDto>;
