import { describe, expect, it, vi } from "vitest";
import { Book } from "@/domain/entities/book.entity";
import type { CreateBookRepository } from "./create-book.repository.interface";
import { CreateBookUseCase } from "./create-book.use-case";

describe("CreateBookUseCase", () => {
  it("builds a Book from the DTO, persists it, and returns the saved book", async () => {
    const savedBook = Book.create({
      id: "00000000-0000-4000-8000-000000000001",
      title: "The Pragmatic Programmer",
      author: "Hunt & Thomas",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    const create = vi.fn().mockResolvedValue(savedBook);
    const repository: CreateBookRepository = { create };
    const useCase = new CreateBookUseCase(repository);

    const result = await useCase.execute({
      title: "The Pragmatic Programmer",
      author: "Hunt & Thomas",
    });

    expect(create).toHaveBeenCalledTimes(1);
    const [persisted] = create.mock.calls[0];
    expect(persisted).toBeInstanceOf(Book);
    expect(persisted.toObject()).toMatchObject({
      title: "The Pragmatic Programmer",
      author: "Hunt & Thomas",
    });
    expect(result).toEqual({ book: savedBook });
  });
});
