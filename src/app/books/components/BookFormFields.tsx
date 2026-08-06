import { Input } from "@/components/ui/input";

export function BookFormFields() {
  return (
    <>
      <Input
        type="text"
        name="title"
        placeholder="Title"
        className="flex-1"
        data-testid="book-title-input"
      />
      <Input
        type="text"
        name="author"
        placeholder="Author"
        className="flex-1"
        data-testid="book-author-input"
      />
    </>
  );
}
