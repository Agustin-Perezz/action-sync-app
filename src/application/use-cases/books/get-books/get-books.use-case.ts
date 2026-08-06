import type { GetBooksRepository } from "./get-books.repository.interface";
import type { GetBooksRequestDto } from "./get-books.request.dto";
import type { GetBooksResponseDto } from "./get-books.response.dto";

export class GetBooksUseCase {
  constructor(private readonly repository: GetBooksRepository) {}

  async execute(request?: GetBooksRequestDto): Promise<GetBooksResponseDto> {
    const books = await this.repository.findAll(request?.limit);
    return { books };
  }
}
