export type ExtractedTask = {
  title: string;
  description: string;
  dueDate: string | null;
};

export type ExtractTasksResult = { tasks: ExtractedTask[] };

export interface ExtractTasksPort {
  extract(transcriptText: string): Promise<ExtractTasksResult>;
}
