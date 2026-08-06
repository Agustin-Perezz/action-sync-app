import { InvalidBookError } from "./errors";

export const BOOK_TITLE_MAX_LENGTH = 200;
export const BOOK_AUTHOR_MAX_LENGTH = 100;

export type BookProps = {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly createdAt: string;
};

export class Book {
  private constructor(private readonly props: BookProps) {}

  static create(input: {
    title: string;
    author: string;
    id?: string;
    createdAt?: string;
  }): Book {
    if (
      input.title.length === 0 ||
      input.title.length > BOOK_TITLE_MAX_LENGTH
    ) {
      throw new InvalidBookError(
        `Title must be between 1 and ${BOOK_TITLE_MAX_LENGTH} characters`,
      );
    }

    if (
      input.author.length === 0 ||
      input.author.length > BOOK_AUTHOR_MAX_LENGTH
    ) {
      throw new InvalidBookError(
        `Author must be between 1 and ${BOOK_AUTHOR_MAX_LENGTH} characters`,
      );
    }

    return new Book({
      id: input.id ?? crypto.randomUUID(),
      title: input.title,
      author: input.author,
      createdAt: input.createdAt ?? new Date().toISOString(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get author(): string {
    return this.props.author;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toObject(): BookProps {
    return { ...this.props };
  }
}
