"use server";

import { revalidatePath } from "next/cache";
import { createBookRequestDto } from "@/application/use-cases/books/create-book/create-book.request.dto";
import type { Book } from "@/domain/entities/book.entity";
import { createBooksContainer } from "@/lib/containers/books.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function createBook(formData: FormData): Promise<void> {
  const dto = createBookRequestDto.parse({
    title: formData.get("title"),
    author: formData.get("author"),
  });

  const supabase = await createSupabaseServerClient();
  const { create } = createBooksContainer(supabase);

  await create.execute(dto);

  revalidatePath("/books");
}

export async function getBooks(): Promise<Book[]> {
  const supabase = await createSupabaseServerClient();
  const { getBooks: getBooksUseCase } = createBooksContainer(supabase);

  const { books } = await getBooksUseCase.execute();

  return books;
}
