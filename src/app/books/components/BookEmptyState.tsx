export function BookEmptyState() {
  return (
    <div
      className="mt-8 rounded-lg border border-dashed border-zinc-300 p-12 text-center"
      data-testid="book-empty-state"
    >
      <p className="text-sm text-zinc-500">
        No books yet. Add one using the form above.
      </p>
    </div>
  );
}
