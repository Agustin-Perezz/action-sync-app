import type { Book } from "@/domain/entities/book.entity";

export interface GetBooksRepository {
  findAll(limit?: number): Promise<Book[]>;
}
