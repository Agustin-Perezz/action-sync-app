import { z } from "zod";

export const updateTaskRequestDto = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.string().nullable().optional(),
});

export type UpdateTaskRequestDto = z.infer<typeof updateTaskRequestDto>;
