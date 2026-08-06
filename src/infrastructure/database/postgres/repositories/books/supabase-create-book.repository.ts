import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateBookRepository } from "@/application/use-cases/books/create-book/create-book.repository.interface";
import type { Book } from "@/domain/entities/book.entity";
import type { Database } from "../../database.types";
import { bookMapper } from "../../mappers/book.mapper";

export class SupabaseCreateBookRepository implements CreateBookRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(book: Book): Promise<Book> {
    const insertPayload = bookMapper.toPersistence(book);

    const { data, error } = await this.supabase
      .from("books")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create book: ${error.message}`);
    }

    return bookMapper.toDomain(data);
  }
}
