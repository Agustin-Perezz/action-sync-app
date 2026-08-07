import { InvalidTaskError } from "./errors";
import { TASK_STATUS, type TaskStatus } from "./task-status.enum";

export type TaskProps = {
  readonly id: string;
  readonly transcriptId: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string;
  readonly dueDate: string | null;
  readonly status: TaskStatus;
  readonly trelloCardId: string | null;
  readonly createdAt: string;
};

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static create(input: {
    transcriptId: string;
    userId: string;
    title: string;
    description: string;
    dueDate?: string | null;
    status?: TaskStatus;
    trelloCardId?: string | null;
    id?: string;
    createdAt?: string;
  }): Task {
    if (input.title.length === 0) {
      throw new InvalidTaskError("title must not be empty");
    }

    if (input.description.length === 0) {
      throw new InvalidTaskError("description must not be empty");
    }

    return new Task({
      id: input.id ?? crypto.randomUUID(),
      transcriptId: input.transcriptId,
      userId: input.userId,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate ?? null,
      status: input.status ?? TASK_STATUS.DRAFT,
      trelloCardId: input.trelloCardId ?? null,
      createdAt: input.createdAt ?? new Date().toISOString(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get transcriptId(): string {
    return this.props.transcriptId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get dueDate(): string | null {
    return this.props.dueDate;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get trelloCardId(): string | null {
    return this.props.trelloCardId;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toObject(): TaskProps {
    return { ...this.props };
  }
}
