import type { Book } from "@/domain/entities/book.entity";

export interface CreateBookRepository {
  create(book: Book): Promise<Book>;
}
