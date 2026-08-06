import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetBooksRepository } from "@/application/use-cases/books/get-books/get-books.repository.interface";
import type { Book } from "@/domain/entities/book.entity";
import type { Database } from "../../database.types";
import { bookMapper } from "../../mappers/book.mapper";

export class SupabaseGetBooksRepository implements GetBooksRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findAll(limit?: number): Promise<Book[]> {
    let query = this.supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }

    return data.map((row) => bookMapper.toDomain(row));
  }
}
