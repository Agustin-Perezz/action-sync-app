import { TrelloConnection } from "@/domain/entities/trello-connection.entity";
import type {
  TrelloConnectionInsert,
  TrelloConnectionRow,
} from "../entities/trello-connection.entity";

export const trelloConnectionMapper = {
  toDomain(row: TrelloConnectionRow): TrelloConnection {
    return TrelloConnection.create({
      id: row.id,
      userId: row.user_id,
      trelloMemberId: row.trello_member_id,
      accessToken: row.access_token,
      defaultBoardId: row.default_board_id,
      defaultListId: row.default_list_id,
      updatedAt: row.updated_at,
    });
  },

  toPersistence(connection: TrelloConnection): TrelloConnectionInsert {
    const props = connection.toObject();
    return {
      id: props.id,
      user_id: props.userId,
      trello_member_id: props.trelloMemberId,
      access_token: props.accessToken,
      default_board_id: props.defaultBoardId,
      default_list_id: props.defaultListId,
      updated_at: props.updatedAt,
    };
  },
};
