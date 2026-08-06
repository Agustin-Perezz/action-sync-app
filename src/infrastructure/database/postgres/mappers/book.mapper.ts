import { Book } from "@/domain/entities/book.entity";
import type { BookInsert, BookRow } from "../entities/book.entity";

export const bookMapper = {
  toDomain(row: BookRow): Book {
    return Book.create({
      id: row.id,
      title: row.title,
      author: row.author,
      createdAt: row.created_at,
    });
  },

  toPersistence(book: Book): BookInsert {
    const props = book.toObject();
    return {
      id: props.id,
      title: props.title,
      author: props.author,
      created_at: props.createdAt,
    };
  },
};
