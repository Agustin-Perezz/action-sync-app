import { describe, expect, it, vi } from "vitest";
import type { Book } from "@/domain/entities/book.entity";
import type { GetBooksRepository } from "./get-books.repository.interface";
import { GetBooksUseCase } from "./get-books.use-case";

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: overrides.id ?? "00000000-0000-4000-8000-000000000001",
    title: overrides.title ?? "The Pragmatic Programmer",
    author: overrides.author ?? "Hunt & Thomas",
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
  } as Book;
}

describe("GetBooksUseCase", () => {
  it("returns the books provided by the repository", async () => {
    const books = [
      makeBook(),
      makeBook({ id: "00000000-0000-4000-8000-000000000002" }),
    ];
    const repository: GetBooksRepository = {
      findAll: vi.fn().mockResolvedValue(books),
    };
    const useCase = new GetBooksUseCase(repository);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({ books });
  });

  it("forwards the requested limit to the repository", async () => {
    const repository: GetBooksRepository = {
      findAll: vi.fn().mockResolvedValue([]),
    };
    const useCase = new GetBooksUseCase(repository);

    await useCase.execute({ limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith(10);
  });

  it("returns an empty list when the repository has no books", async () => {
    const repository: GetBooksRepository = {
      findAll: vi.fn().mockResolvedValue([]),
    };
    const useCase = new GetBooksUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual({ books: [] });
  });
});
