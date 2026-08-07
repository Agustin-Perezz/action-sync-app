import { describe, expect, it } from "vitest";
import { InvalidTranscriptError } from "./errors";
import { Transcript } from "./transcript.entity";
import { TRANSCRIPT_STATUS } from "./transcript-status.enum";

describe("Transcript", () => {
  it("creates a transcript with defaults for id, status, and createdAt", () => {
    const transcript = Transcript.create({
      userId: "00000000-0000-4000-8000-000000000001",
      title: "Weekly standup",
      rawText: "Discuss roadmap",
    });

    const obj = transcript.toObject();
    expect(obj.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(obj.userId).toBe("00000000-0000-4000-8000-000000000001");
    expect(obj.title).toBe("Weekly standup");
    expect(obj.rawText).toBe("Discuss roadmap");
    expect(obj.status).toBe(TRANSCRIPT_STATUS.PROCESSING);
    expect(obj.createdAt).toBe(new Date(obj.createdAt).toISOString());
  });

  it("preserves an explicit id, status, and createdAt", () => {
    const transcript = Transcript.create({
      id: "00000000-0000-4000-8000-000000000002",
      userId: "00000000-0000-4000-8000-000000000003",
      title: "Planning",
      rawText: "Body text",
      status: TRANSCRIPT_STATUS.REVIEWING,
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(transcript.toObject()).toEqual({
      id: "00000000-0000-4000-8000-000000000002",
      userId: "00000000-0000-4000-8000-000000000003",
      title: "Planning",
      rawText: "Body text",
      status: TRANSCRIPT_STATUS.REVIEWING,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("rejects an empty title", () => {
    expect(() =>
      Transcript.create({
        userId: "00000000-0000-4000-8000-000000000001",
        title: "",
        rawText: "Body",
      }),
    ).toThrow(InvalidTranscriptError);
  });

  it("rejects a title longer than 200 characters", () => {
    expect(() =>
      Transcript.create({
        userId: "00000000-0000-4000-8000-000000000001",
        title: "x".repeat(201),
        rawText: "Body",
      }),
    ).toThrow(InvalidTranscriptError);
  });

  it("rejects empty rawText", () => {
    expect(() =>
      Transcript.create({
        userId: "00000000-0000-4000-8000-000000000001",
        title: "Title",
        rawText: "",
      }),
    ).toThrow(InvalidTranscriptError);
  });

  it("accepts the failed status", () => {
    const transcript = Transcript.create({
      userId: "00000000-0000-4000-8000-000000000001",
      title: "Failed run",
      rawText: "Body",
      status: TRANSCRIPT_STATUS.FAILED,
    });

    expect(transcript.toObject().status).toBe(TRANSCRIPT_STATUS.FAILED);
  });
});
