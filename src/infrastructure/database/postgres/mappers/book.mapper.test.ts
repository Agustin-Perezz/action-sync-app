import { describe, expect, it } from "vitest";
import { Book } from "@/domain/entities/book.entity";
import type { BookRow } from "../entities/book.entity";
import { bookMapper } from "./book.mapper";

const row: BookRow = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "Domain-Driven Design",
  author: "Eric Evans",
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("bookMapper", () => {
  it("maps a persistence row to a domain Book", () => {
    const book = bookMapper.toDomain(row);

    expect(book.id).toBe(row.id);
    expect(book.title).toBe(row.title);
    expect(book.author).toBe(row.author);
    expect(book.createdAt).toBe(row.created_at);
  });

  it("maps a domain Book back to a persistence insert", () => {
    const book = bookMapper.toDomain(row);

    expect(bookMapper.toPersistence(book)).toEqual({
      id: row.id,
      title: row.title,
      author: row.author,
      created_at: row.created_at,
    });
  });

  it("round-trips a Book through persistence without loss", () => {
    const book = bookMapper.toDomain(row);
    const inserted = bookMapper.toPersistence(book);

    // Feeding the persisted shape back through the mapper reconstructs the same entity.
    const restored = bookMapper.toDomain({
      id: row.id,
      title: inserted.title,
      author: inserted.author,
      created_at: row.created_at,
    });

    expect(restored.toObject()).toEqual(book.toObject());
  });

  it("preserves an explicit id and createdAt on the domain entity", () => {
    const book = Book.create({
      id: row.id,
      title: row.title,
      author: row.author,
      createdAt: row.created_at,
    });

    expect(book.toObject()).toEqual({
      id: row.id,
      title: row.title,
      author: row.author,
      createdAt: row.created_at,
    });
  });
});
