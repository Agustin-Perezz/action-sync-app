export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class BookNotFoundError extends DomainError {
  constructor(bookId: string) {
    super(`Book with id "${bookId}" was not found`, "BOOK_NOT_FOUND");
    this.name = "BookNotFoundError";
  }
}

export class InvalidBookError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_BOOK");
    this.name = "InvalidBookError";
  }
}
