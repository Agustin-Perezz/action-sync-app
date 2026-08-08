import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import type {
  ExtractTasksPort,
  ExtractTasksResult,
} from "@/application/use-cases/transcripts/extract-tasks/extract-tasks.port";
import { aiModel, getOpenaiApiKey } from "@/lib/shared/infrastructure/env";

const extractTasksSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      dueDate: z.string().nullable(),
    }),
  ),
});

const EXTRACT_TASKS_SYSTEM_PROMPT =
  "Extract actionable tasks from the meeting transcript. Each task must have a title (short, actionable), a description (detailed context), and an optional due date in YYYY-MM-DD format. Return an empty array if no actionable tasks are found.";

export class VercelAiExtractTasksAdapter implements ExtractTasksPort {
  async extract(transcriptText: string): Promise<ExtractTasksResult> {
    const openai = createOpenAI({ apiKey: getOpenaiApiKey() });
    const { output } = await generateText({
      model: openai(aiModel),
      output: Output.object({ schema: extractTasksSchema }),
      system: EXTRACT_TASKS_SYSTEM_PROMPT,
      prompt: transcriptText,
    });
    return output;
  }
}
