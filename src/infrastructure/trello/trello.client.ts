import type {
  TrelloBoard,
  TrelloCard,
  TrelloCardInput,
  TrelloClientPort,
  TrelloList,
  TrelloMember,
} from "@/application/ports/trello-client.port";
import { TrelloConnectionError } from "@/domain/entities/errors";

const TRELLO_API_BASE = "https://api.trello.com/1";

function authQuery(apiKey: string, token: string): URLSearchParams {
  return new URLSearchParams({ key: apiKey, token });
}

async function parseJson(response: Response): Promise<unknown> {
  return await response.json();
}

export class TrelloClient implements TrelloClientPort {
  constructor(private readonly apiKey: string) {}

  async getMember(token: string): Promise<TrelloMember> {
    const params = authQuery(this.apiKey, token);
    params.set("fields", "fullName");
    const res = await fetch(`${TRELLO_API_BASE}/members/me?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new TrelloConnectionError(`Trello getMember failed: ${res.status}`);
    }
    const body = (await parseJson(res)) as { id: string; fullName: string };
    return { id: body.id, fullName: body.fullName };
  }

  async getBoards(token: string): Promise<TrelloBoard[]> {
    const params = authQuery(this.apiKey, token);
    params.set("fields", "name");
    const res = await fetch(`${TRELLO_API_BASE}/members/me/boards?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new TrelloConnectionError(`Trello getBoards failed: ${res.status}`);
    }
    const body = (await parseJson(res)) as Array<{ id: string; name: string }>;
    return body.map((b) => ({ id: b.id, name: b.name }));
  }

  async getLists(boardId: string, token: string): Promise<TrelloList[]> {
    const params = authQuery(this.apiKey, token);
    params.set("fields", "name");
    const res = await fetch(
      `${TRELLO_API_BASE}/boards/${boardId}/lists?${params}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
      throw new TrelloConnectionError(`Trello getLists failed: ${res.status}`);
    }
    const body = (await parseJson(res)) as Array<{ id: string; name: string }>;
    return body.map((l) => ({ id: l.id, name: l.name }));
  }

  async createCard(input: TrelloCardInput, token: string): Promise<TrelloCard> {
    const params = authQuery(this.apiKey, token);
    params.set("idList", input.idList);
    params.set("name", input.name);
    params.set("desc", input.desc);
    if (input.due !== null) {
      params.set("due", input.due);
    }
    const res = await fetch(`${TRELLO_API_BASE}/cards`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params,
    });
    if (!res.ok) {
      throw new TrelloConnectionError(
        `Trello createCard failed: ${res.status}`,
      );
    }
    const body = (await parseJson(res)) as { id: string; url: string };
    return { id: body.id, url: body.url };
  }
}
