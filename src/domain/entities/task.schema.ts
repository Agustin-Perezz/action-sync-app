import { z } from "zod";

export const taskTitleSchema = z.string().check(z.minLength(1));
export const taskDescriptionSchema = z.string().check(z.minLength(1));

export const taskSchema = z.object({
  id: z.string().uuid(),
  transcriptId: z.string().uuid(),
  userId: z.string().uuid(),
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  dueDate: z.string().nullable(),
  status: z.enum(["draft", "synced"]),
  trelloCardId: z.string().nullable(),
  createdAt: z.string(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
