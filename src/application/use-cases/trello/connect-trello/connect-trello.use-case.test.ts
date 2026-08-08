import { describe, expect, it, vi } from "vitest";
import type { TrelloClientPort } from "@/application/ports/trello-client.port";
import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { ConnectTrelloRepository } from "./connect-trello.repository.interface";
import { ConnectTrelloUseCase } from "./connect-trello.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const TOKEN = "trello-token-abc";
const MEMBER_ID = "member123";

describe("ConnectTrelloUseCase", () => {
  it("fetches the member, saves the connection, and returns the member name", async () => {
    const savedConnection = TrelloConnection.create({
      id: "00000000-0000-4000-8000-000000000002",
      userId: USER_ID,
      trelloMemberId: MEMBER_ID,
      accessToken: TOKEN,
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const save = vi.fn().mockResolvedValue(savedConnection);
    const repository: ConnectTrelloRepository = { save };
    const trelloClient: TrelloClientPort = {
      getMember: vi
        .fn()
        .mockResolvedValue({ id: MEMBER_ID, fullName: "Jane Doe" }),
      getBoards: vi.fn(),
      getLists: vi.fn(),
      createCard: vi.fn(),
    };
    const useCase = new ConnectTrelloUseCase(repository, trelloClient);

    const result = await useCase.execute({ userId: USER_ID, token: TOKEN });

    expect(trelloClient.getMember).toHaveBeenCalledWith(TOKEN);
    expect(save).toHaveBeenCalledTimes(1);
    const [persisted] = save.mock.calls[0];
    expect(persisted).toBeInstanceOf(TrelloConnection);
    expect(persisted.toObject()).toMatchObject({
      userId: USER_ID,
      trelloMemberId: MEMBER_ID,
      accessToken: TOKEN,
    });
    expect(result).toEqual({ memberName: "Jane Doe" });
  });

  it("uses different member details from Trello", async () => {
    const save = vi.fn().mockResolvedValue(
      TrelloConnection.create({
        userId: USER_ID,
        trelloMemberId: "member456",
        accessToken: "tok2",
      }),
    );
    const repository: ConnectTrelloRepository = { save };
    const trelloClient: TrelloClientPort = {
      getMember: vi
        .fn()
        .mockResolvedValue({ id: "member456", fullName: "John Smith" }),
      getBoards: vi.fn(),
      getLists: vi.fn(),
      createCard: vi.fn(),
    };
    const useCase = new ConnectTrelloUseCase(repository, trelloClient);

    const result = await useCase.execute({ userId: USER_ID, token: "tok2" });

    expect(result).toEqual({ memberName: "John Smith" });
    expect(save.mock.calls[0][0].toObject()).toMatchObject({
      trelloMemberId: "member456",
      accessToken: "tok2",
    });
  });
});
