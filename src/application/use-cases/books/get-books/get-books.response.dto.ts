import type { Book } from "@/domain/entities/book.entity";

export type GetBooksResponseDto = {
  books: Book[];
};
