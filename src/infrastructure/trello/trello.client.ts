import type {
  TrelloBoard,
  TrelloCard,
  TrelloCardInput,
  TrelloClientPort,
  TrelloList,
  TrelloMember,
} from "@/application/ports/trello-client.port";
import { TrelloConnectionError } from "@/domain/entities/errors";
import { trelloApiBaseUrl } from "@/lib/shared/infrastructure/env";

// ponytail: fixed 09:00:00.000Z suffix — Trello treats due as a timestamp;
// start-of-day UTC 09:00 is the project convention from design #72.
const DUE_TIME_SUFFIX = "T09:00:00.000Z";

function toTrelloDue(due: string | null): string | undefined {
  if (due === null) return undefined;
  // DB timestamptz round-trip returns full ISO (e.g. 2024-12-31T09:00:00.000Z).
  // Only append the suffix for bare YYYY-MM-DD dates from the AI/input fields.
  if (due.length <= 10) return `${due}${DUE_TIME_SUFFIX}`;
  return due;
}

function authQuery(apiKey: string, token: string): URLSearchParams {
  return new URLSearchParams({ key: apiKey, token });
}

async function parseJson(response: Response): Promise<unknown> {
  return await response.json();
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text || response.statusText;
  } catch {
    return response.statusText;
  }
}

export class TrelloClient implements TrelloClientPort {
  constructor(private readonly apiKey: string) {}

  async getMember(token: string): Promise<TrelloMember> {
    const params = authQuery(this.apiKey, token);
    params.set("fields", "fullName");
    const res = await fetch(`${trelloApiBaseUrl}/members/me?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new TrelloConnectionError(
        `Trello getMember failed: ${res.status} ${await readErrorBody(res)}`,
      );
    }
    const body = (await parseJson(res)) as { id: string; fullName: string };
    return { id: body.id, fullName: body.fullName };
  }

  async getBoards(token: string): Promise<TrelloBoard[]> {
    const params = authQuery(this.apiKey, token);
    params.set("fields", "name");
    params.set("filter", "open");
    const res = await fetch(`${trelloApiBaseUrl}/members/me/boards?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new TrelloConnectionError(
        `Trello getBoards failed: ${res.status} ${await readErrorBody(res)}`,
      );
    }
    const body = (await parseJson(res)) as Array<{ id: string; name: string }>;
    return body.map((b) => ({ id: b.id, name: b.name }));
  }

  async getLists(boardId: string, token: string): Promise<TrelloList[]> {
    const params = authQuery(this.apiKey, token);
    params.set("fields", "name");
    const res = await fetch(
      `${trelloApiBaseUrl}/boards/${boardId}/lists?${params}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
      throw new TrelloConnectionError(
        `Trello getLists failed: ${res.status} ${await readErrorBody(res)}`,
      );
    }
    const body = (await parseJson(res)) as Array<{ id: string; name: string }>;
    return body.map((l) => ({ id: l.id, name: l.name }));
  }

  async createCard(input: TrelloCardInput, token: string): Promise<TrelloCard> {
    const params = authQuery(this.apiKey, token);
    params.set("idList", input.idList);
    params.set("name", input.name);
    params.set("desc", input.desc);
    const due = toTrelloDue(input.due);
    if (due !== undefined) {
      params.set("due", due);
    }
    const res = await fetch(`${trelloApiBaseUrl}/cards?${params}`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new TrelloConnectionError(
        `Trello createCard failed: ${res.status} ${await readErrorBody(res)}`,
      );
    }
    const body = (await parseJson(res)) as { id: string; url: string };
    return { id: body.id, url: body.url };
  }
}
