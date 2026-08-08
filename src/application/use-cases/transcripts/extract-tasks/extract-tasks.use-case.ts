import { ExtractionError } from "@/domain/entities/errors";
import { Task } from "@/domain/entities/task.entity";
import {
  TRANSCRIPT_TITLE_MAX_LENGTH,
  Transcript,
} from "@/domain/entities/transcript.entity";
import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import type { ExtractTasksPort } from "./extract-tasks.port";
import type { ExtractTasksRepository } from "./extract-tasks.repository.interface";
import type { ExtractTasksRequestDto } from "./extract-tasks.request.dto";
import type { ExtractTasksResponseDto } from "./extract-tasks.response.dto";

const UNTITLED_PREFIX = "Untitled - ";
const ISO_DATE_LENGTH = 10; // YYYY-MM-DD

// Pure: derive a transcript title from raw text. First non-empty line,
// truncated to TRANSCRIPT_TITLE_MAX_LENGTH, fallback "Untitled - {YYYY-MM-DD}".
export function deriveTranscriptTitle(rawText: string): string {
  const firstLine = rawText
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (firstLine) {
    return firstLine.slice(0, TRANSCRIPT_TITLE_MAX_LENGTH);
  }
  return `${UNTITLED_PREFIX}${todayIsoDate()}`;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, ISO_DATE_LENGTH);
}

export class ExtractTasksUseCase {
  constructor(
    private readonly repository: ExtractTasksRepository,
    private readonly ai: ExtractTasksPort,
  ) {}

  async execute(dto: ExtractTasksRequestDto): Promise<ExtractTasksResponseDto> {
    const transcriptId = await this.prepareTranscript(dto);
    await this.runExtraction(dto.rawText, dto.userId, transcriptId);
    return { transcriptId };
  }

  private async prepareTranscript(
    dto: ExtractTasksRequestDto,
  ): Promise<string> {
    if (dto.transcriptId) {
      await this.repository.deleteDraftTasksByTranscript(dto.transcriptId);
      await this.repository.updateTranscriptStatus(
        dto.transcriptId,
        TRANSCRIPT_STATUS.PROCESSING,
      );
      return dto.transcriptId;
    }
    const transcript = Transcript.create({
      userId: dto.userId,
      title: deriveTranscriptTitle(dto.rawText),
      rawText: dto.rawText,
      status: TRANSCRIPT_STATUS.PROCESSING,
    });
    const saved = await this.repository.saveTranscript(transcript);
    return saved.id;
  }

  private async runExtraction(
    rawText: string,
    userId: string,
    transcriptId: string,
  ): Promise<void> {
    try {
      const { tasks: extractedTasks } = await this.ai.extract(rawText);
      const tasks = extractedTasks.map((t) =>
        Task.create({
          transcriptId,
          userId,
          title: t.title,
          description: t.description,
          dueDate: t.dueDate,
        }),
      );
      if (tasks.length > 0) {
        await this.repository.saveTasks(tasks);
      }
      await this.repository.updateTranscriptStatus(
        transcriptId,
        TRANSCRIPT_STATUS.REVIEWING,
      );
    } catch (error) {
      await this.repository.updateTranscriptStatus(
        transcriptId,
        TRANSCRIPT_STATUS.FAILED,
      );
      throw new ExtractionError(
        error instanceof Error ? error.message : "AI extraction failed",
      );
    }
  }
}
