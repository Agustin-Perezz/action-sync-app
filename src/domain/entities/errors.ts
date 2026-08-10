export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class TranscriptNotFoundError extends DomainError {
  constructor(transcriptId: string) {
    super(
      `Transcript with id "${transcriptId}" was not found`,
      "TRANSCRIPT_NOT_FOUND",
    );
    this.name = "TranscriptNotFoundError";
  }
}

export class InvalidTranscriptError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_TRANSCRIPT");
    this.name = "InvalidTranscriptError";
  }
}

export class TaskNotFoundError extends DomainError {
  constructor(taskId: string) {
    super(`Task with id "${taskId}" was not found`, "TASK_NOT_FOUND");
    this.name = "TaskNotFoundError";
  }
}

export class InvalidTaskError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_TASK");
    this.name = "InvalidTaskError";
  }
}

export class TrelloConnectionNotFoundError extends DomainError {
  constructor(userId: string) {
    super(
      `Trello connection for user "${userId}" was not found`,
      "TRELLO_CONNECTION_NOT_FOUND",
    );
    this.name = "TrelloConnectionNotFoundError";
  }
}

export class TrelloConnectionError extends DomainError {
  constructor(message: string) {
    super(message, "TRELLO_CONNECTION_ERROR");
    this.name = "TrelloConnectionError";
  }
}

export class ExtractionError extends DomainError {
  constructor(message: string) {
    super(message, "EXTRACTION_ERROR");
    this.name = "ExtractionError";
  }
}

export class TrelloApiError extends DomainError {
  constructor(message: string) {
    super(message, "TRELLO_API_ERROR");
    this.name = "TrelloApiError";
  }
}
