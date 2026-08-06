import type { SupabaseClient } from "@supabase/supabase-js";
import { CreateBookUseCase } from "@/application/use-cases/books/create-book/create-book.use-case";
import { GetBooksUseCase } from "@/application/use-cases/books/get-books/get-books.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseCreateBookRepository } from "@/infrastructure/database/postgres/repositories/books/supabase-create-book.repository";
import { SupabaseGetBooksRepository } from "@/infrastructure/database/postgres/repositories/books/supabase-get-books.repository";

export function createBooksContainer(supabase: SupabaseClient<Database>) {
  const createBookRepository = new SupabaseCreateBookRepository(supabase);
  const getBooksRepository = new SupabaseGetBooksRepository(supabase);

  return {
    create: new CreateBookUseCase(createBookRepository),
    getBooks: new GetBooksUseCase(getBooksRepository),
  };
}
