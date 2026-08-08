import { describe, expect, it, vi } from "vitest";
import type { DisconnectTrelloRepository } from "./disconnect-trello.repository.interface";
import { DisconnectTrelloUseCase } from "./disconnect-trello.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";

describe("DisconnectTrelloUseCase", () => {
  it("deletes the connection by userId", async () => {
    const remove = vi.fn().mockResolvedValue(undefined);
    const repository: DisconnectTrelloRepository = { delete: remove };
    const useCase = new DisconnectTrelloUseCase(repository);

    await useCase.execute({ userId: USER_ID });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(USER_ID);
  });

  it("resolves to void when the connection does not exist", async () => {
    const remove = vi.fn().mockResolvedValue(undefined);
    const repository: DisconnectTrelloRepository = { delete: remove };
    const useCase = new DisconnectTrelloUseCase(repository);

    await expect(
      useCase.execute({ userId: "00000000-0000-4000-8000-000000000002" }),
    ).resolves.toBeUndefined();

    expect(remove).toHaveBeenCalledWith("00000000-0000-4000-8000-000000000002");
  });
});
