import { z } from "zod";

export const emailSchema = z.email("Invalid email address");

export type EmailSchema = z.infer<typeof emailSchema>;
