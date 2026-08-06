export type ReviewControlsProps = {
  readonly taskCount: number;
  readonly board: string;
  readonly list: string;
  readonly boards: readonly string[];
  readonly lists: readonly string[];
  readonly isSyncing: boolean;
  readonly onBoardChange: (value: string) => void;
  readonly onListChange: (value: string) => void;
  readonly onSync: () => void;
};
