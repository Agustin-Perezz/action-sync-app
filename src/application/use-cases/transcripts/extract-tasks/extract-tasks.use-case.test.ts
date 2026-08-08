import { describe, expect, it, vi } from "vitest";
import { ExtractionError } from "@/domain/entities/errors";
import { Task } from "@/domain/entities/task.entity";
import { Transcript } from "@/domain/entities/transcript.entity";
import { TRANSCRIPT_STATUS } from "@/domain/entities/transcript-status.enum";
import type { ExtractTasksPort } from "./extract-tasks.port";
import type { ExtractTasksRepository } from "./extract-tasks.repository.interface";
import {
  deriveTranscriptTitle,
  ExtractTasksUseCase,
} from "./extract-tasks.use-case";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const TRANSCRIPT_ID = "00000000-0000-4000-8000-000000000010";

function makeFakeRepo(overrides: Partial<ExtractTasksRepository> = {}): {
  repo: ExtractTasksRepository;
  calls: Record<string, ReturnType<typeof vi.fn>>;
} {
  const calls = {
    saveTranscript: vi.fn(async (t: Transcript) => t),
    saveTasks: vi.fn(async (tasks: Task[]) => tasks),
    deleteDraftTasksByTranscript: vi.fn(async () => undefined),
    updateTranscriptStatus: vi.fn(async () => undefined),
  };
  const repo: ExtractTasksRepository = { ...calls, ...overrides };
  return { repo, calls };
}

function makeFakeAi(
  extractImpl: ExtractTasksPort["extract"],
): ExtractTasksPort {
  return { extract: vi.fn(extractImpl) };
}

describe("deriveTranscriptTitle", () => {
  it("uses the first non-empty line as the title", () => {
    expect(deriveTranscriptTitle("  \nWeekly standup\nDiscuss roadmap")).toBe(
      "Weekly standup",
    );
  });

  it("truncates a long first line to 200 characters", () => {
    const longLine = "x".repeat(250);
    expect(deriveTranscriptTitle(longLine)).toHaveLength(200);
  });

  it("falls back to Untitled with today's date when all lines are blank", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(deriveTranscriptTitle("\n  \n")).toBe(`Untitled - ${today}`);
  });
});

describe("ExtractTasksUseCase", () => {
  it("saves a processing transcript, saves extracted tasks, and sets reviewing on success", async () => {
    const { repo, calls } = makeFakeRepo();
    const ai = makeFakeAi(async () => ({
      tasks: [
        { title: "Task A", description: "Desc A", dueDate: "2026-01-15" },
        { title: "Task B", description: "Desc B", dueDate: null },
      ],
    }));
    const useCase = new ExtractTasksUseCase(repo, ai);

    const result = await useCase.execute({
      userId: USER_ID,
      rawText: "Standup notes\nDo the thing",
    });

    expect(calls.saveTranscript).toHaveBeenCalledTimes(1);
    const [saved] = calls.saveTranscript.mock.calls[0];
    expect(saved).toBeInstanceOf(Transcript);
    expect(saved.status).toBe(TRANSCRIPT_STATUS.PROCESSING);
    expect(saved.title).toBe("Standup notes");

    expect(calls.saveTasks).toHaveBeenCalledTimes(1);
    const [tasksArr] = calls.saveTasks.mock.calls[0];
    expect(tasksArr).toHaveLength(2);
    expect(tasksArr[0]).toBeInstanceOf(Task);
    expect(tasksArr[0].toObject()).toMatchObject({
      title: "Task A",
      description: "Desc A",
      dueDate: "2026-01-15",
      status: "draft",
    });

    expect(calls.updateTranscriptStatus).toHaveBeenLastCalledWith(
      saved.id,
      TRANSCRIPT_STATUS.REVIEWING,
    );
    expect(result.transcriptId).toBe(saved.id);
  });

  it("sets reviewing with zero tasks when AI returns an empty array", async () => {
    const { repo, calls } = makeFakeRepo();
    const ai = makeFakeAi(async () => ({ tasks: [] }));
    const useCase = new ExtractTasksUseCase(repo, ai);

    const result = await useCase.execute({
      userId: USER_ID,
      rawText: "No actionable content here",
    });

    expect(calls.saveTasks).not.toHaveBeenCalled();
    expect(calls.updateTranscriptStatus).toHaveBeenLastCalledWith(
      result.transcriptId,
      TRANSCRIPT_STATUS.REVIEWING,
    );
  });

  it("sets status to failed and throws ExtractionError when AI throws, without saving tasks", async () => {
    const { repo, calls } = makeFakeRepo();
    const ai = makeFakeAi(async () => {
      throw new Error("AI service down");
    });
    const useCase = new ExtractTasksUseCase(repo, ai);

    await expect(
      useCase.execute({ userId: USER_ID, rawText: "Some text" }),
    ).rejects.toThrow(ExtractionError);

    expect(calls.saveTasks).not.toHaveBeenCalled();
    expect(calls.updateTranscriptStatus).toHaveBeenLastCalledWith(
      expect.any(String),
      TRANSCRIPT_STATUS.FAILED,
    );
  });

  it("re-extract deletes old draft tasks and resets to processing before re-running AI", async () => {
    const { repo, calls } = makeFakeRepo();
    const ai = makeFakeAi(async () => ({
      tasks: [{ title: "New task", description: "New desc", dueDate: null }],
    }));
    const useCase = new ExtractTasksUseCase(repo, ai);

    const result = await useCase.execute({
      userId: USER_ID,
      rawText: "Re-extract me",
      transcriptId: TRANSCRIPT_ID,
    });

    expect(calls.deleteDraftTasksByTranscript).toHaveBeenCalledWith(
      TRANSCRIPT_ID,
    );
    expect(calls.updateTranscriptStatus).toHaveBeenNthCalledWith(
      1,
      TRANSCRIPT_ID,
      TRANSCRIPT_STATUS.PROCESSING,
    );
    expect(calls.saveTranscript).not.toHaveBeenCalled();
    expect(calls.updateTranscriptStatus).toHaveBeenLastCalledWith(
      TRANSCRIPT_ID,
      TRANSCRIPT_STATUS.REVIEWING,
    );
    expect(result.transcriptId).toBe(TRANSCRIPT_ID);
  });
});
