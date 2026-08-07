import { describe, expect, it } from "vitest";
import { TrelloConnectionError } from "./errors";
import { TrelloConnection } from "./trello-connection.entity";

describe("TrelloConnection", () => {
  it("creates a connection with defaults for id, board, list, and updatedAt", () => {
    const conn = TrelloConnection.create({
      userId: "00000000-0000-4000-8000-000000000001",
      trelloMemberId: "member-abc",
      accessToken: "token-xyz",
    });

    const obj = conn.toObject();
    expect(obj.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(obj.userId).toBe("00000000-0000-4000-8000-000000000001");
    expect(obj.trelloMemberId).toBe("member-abc");
    expect(obj.accessToken).toBe("token-xyz");
    expect(obj.defaultBoardId).toBeNull();
    expect(obj.defaultListId).toBeNull();
    expect(obj.updatedAt).toBe(new Date(obj.updatedAt).toISOString());
  });

  it("preserves an explicit id, board, list, and updatedAt", () => {
    const conn = TrelloConnection.create({
      id: "00000000-0000-4000-8000-000000000002",
      userId: "00000000-0000-4000-8000-000000000003",
      trelloMemberId: "member-def",
      accessToken: "token-uvw",
      defaultBoardId: "board-1",
      defaultListId: "list-1",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(conn.toObject()).toEqual({
      id: "00000000-0000-4000-8000-000000000002",
      userId: "00000000-0000-4000-8000-000000000003",
      trelloMemberId: "member-def",
      accessToken: "token-uvw",
      defaultBoardId: "board-1",
      defaultListId: "list-1",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("rejects an empty trelloMemberId", () => {
    expect(() =>
      TrelloConnection.create({
        userId: "00000000-0000-4000-8000-000000000001",
        trelloMemberId: "",
        accessToken: "token",
      }),
    ).toThrow(TrelloConnectionError);
  });

  it("rejects an empty accessToken", () => {
    expect(() =>
      TrelloConnection.create({
        userId: "00000000-0000-4000-8000-000000000001",
        trelloMemberId: "member",
        accessToken: "",
      }),
    ).toThrow(TrelloConnectionError);
  });

  it("accepts null board and list ids explicitly", () => {
    const conn = TrelloConnection.create({
      userId: "00000000-0000-4000-8000-000000000001",
      trelloMemberId: "member",
      accessToken: "token",
      defaultBoardId: null,
      defaultListId: null,
    });

    expect(conn.toObject().defaultBoardId).toBeNull();
    expect(conn.toObject().defaultListId).toBeNull();
  });
});
