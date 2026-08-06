import { z } from "zod";
import {
  bookAuthorSchema,
  bookTitleSchema,
} from "@/domain/entities/book.schema";

export const createBookRequestDto = z.object({
  title: bookTitleSchema,
  author: bookAuthorSchema,
});

export type CreateBookRequestDto = z.infer<typeof createBookRequestDto>;
