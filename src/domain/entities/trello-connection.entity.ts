import { TrelloConnectionError } from "./errors";

export type TrelloConnectionProps = {
  readonly id: string;
  readonly userId: string;
  readonly trelloMemberId: string;
  readonly accessToken: string;
  readonly defaultBoardId: string | null;
  readonly defaultListId: string | null;
  readonly updatedAt: string;
};

export class TrelloConnection {
  private constructor(private readonly props: TrelloConnectionProps) {}

  static create(input: {
    userId: string;
    trelloMemberId: string;
    accessToken: string;
    defaultBoardId?: string | null;
    defaultListId?: string | null;
    id?: string;
    updatedAt?: string;
  }): TrelloConnection {
    if (input.trelloMemberId.length === 0) {
      throw new TrelloConnectionError("trelloMemberId must not be empty");
    }

    if (input.accessToken.length === 0) {
      throw new TrelloConnectionError("accessToken must not be empty");
    }

    return new TrelloConnection({
      id: input.id ?? crypto.randomUUID(),
      userId: input.userId,
      trelloMemberId: input.trelloMemberId,
      accessToken: input.accessToken,
      defaultBoardId: input.defaultBoardId ?? null,
      defaultListId: input.defaultListId ?? null,
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get trelloMemberId(): string {
    return this.props.trelloMemberId;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get defaultBoardId(): string | null {
    return this.props.defaultBoardId;
  }

  get defaultListId(): string | null {
    return this.props.defaultListId;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  toObject(): TrelloConnectionProps {
    return { ...this.props };
  }
}
