import type { Book } from "@/domain/entities/book.entity";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <li
      className="flex items-center justify-between px-4 py-3"
      data-testid="book-card"
    >
      <div>
        <p className="font-medium" data-testid="book-card-title">
          {book.title}
        </p>
        <p className="text-sm text-zinc-500" data-testid="book-card-author">
          {book.author}
        </p>
      </div>
    </li>
  );
}
