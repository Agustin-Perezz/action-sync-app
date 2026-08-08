import { describe, expect, it } from "vitest";
import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type { TrelloConnectionRow } from "../entities/trello-connection.entity";
import { trelloConnectionMapper } from "./trello-connection.mapper";

const row: TrelloConnectionRow = {
  id: "00000000-0000-4000-8000-000000000001",
  user_id: "00000000-0000-4000-8000-000000000002",
  trello_member_id: "member123",
  access_token: "token-abc",
  default_board_id: null,
  default_list_id: null,
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("trelloConnectionMapper", () => {
  it("maps a persistence row to a domain TrelloConnection", () => {
    const connection = trelloConnectionMapper.toDomain(row);

    expect(connection.id).toBe(row.id);
    expect(connection.userId).toBe(row.user_id);
    expect(connection.trelloMemberId).toBe(row.trello_member_id);
    expect(connection.accessToken).toBe(row.access_token);
    expect(connection.defaultBoardId).toBe(row.default_board_id);
    expect(connection.defaultListId).toBe(row.default_list_id);
    expect(connection.updatedAt).toBe(row.updated_at);
  });

  it("maps a domain TrelloConnection back to a persistence insert", () => {
    const connection = trelloConnectionMapper.toDomain(row);

    expect(trelloConnectionMapper.toPersistence(connection)).toEqual({
      id: row.id,
      user_id: row.user_id,
      trello_member_id: row.trello_member_id,
      access_token: row.access_token,
      default_board_id: row.default_board_id,
      default_list_id: row.default_list_id,
      updated_at: row.updated_at,
    });
  });

  it("round-trips a TrelloConnection through persistence without loss", () => {
    const connection = trelloConnectionMapper.toDomain(row);
    const inserted = trelloConnectionMapper.toPersistence(connection);

    const restored = trelloConnectionMapper.toDomain({
      id: row.id,
      user_id: inserted.user_id,
      trello_member_id: inserted.trello_member_id,
      access_token: inserted.access_token,
      default_board_id: inserted.default_board_id ?? null,
      default_list_id: inserted.default_list_id ?? null,
      updated_at: row.updated_at,
    });

    expect(restored.toObject()).toEqual(connection.toObject());
  });

  it("preserves nullable default board/list ids on the domain entity", () => {
    const connection = TrelloConnection.create({
      id: row.id,
      userId: row.user_id,
      trelloMemberId: row.trello_member_id,
      accessToken: row.access_token,
      defaultBoardId: null,
      defaultListId: null,
      updatedAt: row.updated_at,
    });

    expect(connection.toObject()).toEqual({
      id: row.id,
      userId: row.user_id,
      trelloMemberId: row.trello_member_id,
      accessToken: row.access_token,
      defaultBoardId: null,
      defaultListId: null,
      updatedAt: row.updated_at,
    });
  });
});
