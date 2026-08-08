import type { Task } from "@/domain/entities/task.entity";
import type { Transcript } from "@/domain/entities/transcript.entity";
import type { TranscriptStatus } from "@/domain/entities/transcript-status.enum";

export interface ExtractTasksRepository {
  saveTranscript(transcript: Transcript): Promise<Transcript>;
  saveTasks(tasks: Task[]): Promise<Task[]>;
  deleteDraftTasksByTranscript(transcriptId: string): Promise<void>;
  updateTranscriptStatus(
    transcriptId: string,
    status: TranscriptStatus,
  ): Promise<void>;
}
