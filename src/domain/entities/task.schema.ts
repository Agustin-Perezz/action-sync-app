import { z } from "zod";

export const taskTitleSchema = z.string().check(z.minLength(1));
export const taskDescriptionSchema = z.string().check(z.minLength(1));

export const taskSchema = z.object({
  id: z.uuid(),
  transcriptId: z.uuid(),
  userId: z.uuid(),
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  dueDate: z.string().nullable(),
  status: z.enum(["draft", "synced"]),
  trelloCardId: z.string().nullable(),
  createdAt: z.string(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
