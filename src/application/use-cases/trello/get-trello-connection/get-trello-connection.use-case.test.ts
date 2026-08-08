import { describe, expect, it, vi } from "vitest";
import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { GetTrelloConnectionRepository } from "./get-trello-connection.repository.interface";
import { GetTrelloConnectionUseCase } from "./get-trello-connection.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const MEMBER_ID = "member123";

describe("GetTrelloConnectionUseCase", () => {
  it("returns connected=true with the trello member id when a row exists", async () => {
    const connection = TrelloConnection.create({
      id: "00000000-0000-4000-8000-000000000002",
      userId: USER_ID,
      trelloMemberId: MEMBER_ID,
      accessToken: "tok-abc",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const repository: GetTrelloConnectionRepository = {
      findByUserId: vi.fn().mockResolvedValue(connection),
    };
    const useCase = new GetTrelloConnectionUseCase(repository);

    const result = await useCase.execute({ userId: USER_ID });

    expect(repository.findByUserId).toHaveBeenCalledWith(USER_ID);
    expect(result).toEqual({
      connected: true,
      memberName: null,
      trelloMemberId: MEMBER_ID,
    });
  });

  it("returns connected=false with null fields when no row exists", async () => {
    const repository: GetTrelloConnectionRepository = {
      findByUserId: vi.fn().mockResolvedValue(null),
    };
    const useCase = new GetTrelloConnectionUseCase(repository);

    const result = await useCase.execute({ userId: USER_ID });

    expect(result).toEqual({
      connected: false,
      memberName: null,
      trelloMemberId: null,
    });
  });
});
