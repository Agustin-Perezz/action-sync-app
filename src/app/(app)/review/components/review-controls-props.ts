import type { Board, List } from "../types";

export type ReviewControlsProps = {
  readonly taskCount: number;
  readonly board: string | null;
  readonly list: string | null;
  readonly boards: readonly Board[];
  readonly lists: readonly List[];
  readonly isSyncing: boolean;
  readonly syncError: string | null;
  readonly syncSuccess: string | null;
  readonly onBoardChange: (id: string) => void;
  readonly onListChange: (id: string) => void;
  readonly onSync: () => void;
};
