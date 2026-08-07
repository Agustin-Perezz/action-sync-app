import { InvalidTranscriptError } from "./errors";
import {
  TRANSCRIPT_STATUS,
  type TranscriptStatus,
} from "./transcript-status.enum";

export const TRANSCRIPT_TITLE_MAX_LENGTH = 200;

export type TranscriptProps = {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly rawText: string;
  readonly status: TranscriptStatus;
  readonly createdAt: string;
};

export class Transcript {
  private constructor(private readonly props: TranscriptProps) {}

  static create(input: {
    userId: string;
    title: string;
    rawText: string;
    status?: TranscriptStatus;
    id?: string;
    createdAt?: string;
  }): Transcript {
    if (
      input.title.length === 0 ||
      input.title.length > TRANSCRIPT_TITLE_MAX_LENGTH
    ) {
      throw new InvalidTranscriptError(
        `Title must be between 1 and ${TRANSCRIPT_TITLE_MAX_LENGTH} characters`,
      );
    }

    if (input.rawText.length === 0) {
      throw new InvalidTranscriptError("rawText must not be empty");
    }

    return new Transcript({
      id: input.id ?? crypto.randomUUID(),
      userId: input.userId,
      title: input.title,
      rawText: input.rawText,
      status: input.status ?? TRANSCRIPT_STATUS.PROCESSING,
      createdAt: input.createdAt ?? new Date().toISOString(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get rawText(): string {
    return this.props.rawText;
  }

  get status(): TranscriptStatus {
    return this.props.status;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toObject(): TranscriptProps {
    return { ...this.props };
  }
}
