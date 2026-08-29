import type { Board, Task } from "../types";

export type ReviewWorkspaceProps = {
  readonly transcriptId: string;
  readonly initialTasks: readonly Task[];
  readonly initialBoards: readonly Board[];
};
