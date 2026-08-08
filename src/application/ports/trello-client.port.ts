export type TrelloBoard = { id: string; name: string };
export type TrelloList = { id: string; name: string };
export type TrelloMember = { id: string; fullName: string };
export type TrelloCardInput = {
  idList: string;
  name: string;
  desc: string;
  due: string | null;
};
export type TrelloCard = { id: string; url: string };

export interface TrelloClientPort {
  getMember(token: string): Promise<TrelloMember>;
  getBoards(token: string): Promise<TrelloBoard[]>;
  getLists(boardId: string, token: string): Promise<TrelloList[]>;
  createCard(input: TrelloCardInput, token: string): Promise<TrelloCard>;
}
