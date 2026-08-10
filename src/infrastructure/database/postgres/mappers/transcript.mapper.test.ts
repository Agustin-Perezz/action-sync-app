import { describe, expect, it } from "vitest";
import { Transcript } from "@/domain/entities/transcript.entity";
import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import type { TranscriptRow } from "../entities/transcript.entity";
import { transcriptMapper } from "./transcript.mapper";

const row: TranscriptRow = {
  id: "00000000-0000-4000-8000-000000000001",
  user_id: "00000000-0000-4000-8000-000000000002",
  title: "Weekly Sync",
  raw_text: "Discuss roadmap and hiring",
  status: "reviewing",
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("transcriptMapper", () => {
  it("maps a persistence row to a domain Transcript", () => {
    const transcript = transcriptMapper.toDomain(row);

    expect(transcript.id).toBe(row.id);
    expect(transcript.userId).toBe(row.user_id);
    expect(transcript.title).toBe(row.title);
    expect(transcript.rawText).toBe(row.raw_text);
    expect(transcript.status).toBe(row.status);
    expect(transcript.createdAt).toBe(row.created_at);
  });

  it("maps a domain Transcript back to a persistence insert", () => {
    const transcript = transcriptMapper.toDomain(row);

    expect(transcriptMapper.toPersistence(transcript)).toEqual({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      raw_text: row.raw_text,
      status: row.status,
      created_at: row.created_at,
    });
  });

  it("round-trips a Transcript through persistence without loss", () => {
    const transcript = transcriptMapper.toDomain(row);
    const inserted = transcriptMapper.toPersistence(transcript);

    const restored = transcriptMapper.toDomain({
      id: row.id,
      user_id: inserted.user_id,
      title: inserted.title,
      raw_text: inserted.raw_text,
      status: inserted.status ?? row.status,
      created_at: row.created_at,
    });

    expect(restored.toObject()).toEqual(transcript.toObject());
  });

  it("preserves an explicit id and createdAt on the domain entity", () => {
    const transcript = Transcript.create({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      rawText: row.raw_text,
      status: TRANSCRIPT_STATUS.REVIEWING,
      createdAt: row.created_at,
    });

    expect(transcript.toObject()).toEqual({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      rawText: row.raw_text,
      status: "reviewing",
      createdAt: row.created_at,
    });
  });
});
