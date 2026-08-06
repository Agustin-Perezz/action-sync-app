import { getBooks } from "./actions";
import { BookCreateForm } from "./components/BookCreateForm";
import { BookHeader } from "./components/BookHeader";
import { BookList } from "./components/BookList";

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <BookHeader />
      <BookCreateForm />
      <BookList books={books} />
    </main>
  );
}
