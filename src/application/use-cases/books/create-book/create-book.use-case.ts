import { Book } from "@/domain/entities/book.entity";
import type { CreateBookRepository } from "./create-book.repository.interface";
import type { CreateBookRequestDto } from "./create-book.request.dto";
import type { CreateBookResponseDto } from "./create-book.response.dto";

export class CreateBookUseCase {
  constructor(private readonly repository: CreateBookRepository) {}

  async execute(bookDto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    const book = Book.create(bookDto);
    const savedBook = await this.repository.create(book);
    return { book: savedBook };
  }
}
