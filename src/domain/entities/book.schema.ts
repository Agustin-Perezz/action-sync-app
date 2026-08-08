import { z } from "zod";
import { BOOK_AUTHOR_MAX_LENGTH, BOOK_TITLE_MAX_LENGTH } from "./book.entity";

export const bookTitleSchema = z
  .string()
  .check(z.minLength(1))
  .check(z.maxLength(BOOK_TITLE_MAX_LENGTH));
export const bookAuthorSchema = z
  .string()
  .check(z.minLength(1))
  .check(z.maxLength(BOOK_AUTHOR_MAX_LENGTH));

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: bookTitleSchema,
  author: bookAuthorSchema,
  createdAt: z.string(),
});

export type BookSchema = z.infer<typeof bookSchema>;
