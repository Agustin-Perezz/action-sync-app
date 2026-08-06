import { Button } from "@/components/ui/button";
import { createBook } from "../actions";
import { BookFormFields } from "./BookFormFields";

export function BookCreateForm() {
  return (
    <form
      action={createBook}
      className="mt-6 flex gap-2"
      data-testid="book-create-form"
    >
      <BookFormFields />
      <Button type="submit" data-testid="book-submit-button">
        Add
      </Button>
    </form>
  );
}
