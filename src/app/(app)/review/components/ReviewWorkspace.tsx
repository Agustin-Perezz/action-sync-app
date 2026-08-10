"use client";

import { useReviewTasks } from "../hooks/useReviewTasks";
import type { Board, Task } from "../types";
import { AddManualTaskButton } from "./AddManualTaskButton";
import { ReviewControls } from "./ReviewControls";
import { TaskList } from "./TaskList";

export type ReviewWorkspaceProps = {
  readonly transcriptId: string;
  readonly initialTasks: readonly Task[];
  readonly initialBoards: readonly Board[];
};

export function ReviewWorkspace({
  transcriptId,
  initialTasks,
  initialBoards,
}: ReviewWorkspaceProps) {
  const review = useReviewTasks({
    transcriptId,
    initialTasks,
    initialBoards,
  });

  return (
    <div>
      <ReviewControls
        taskCount={review.tasks.length}
        board={review.board}
        list={review.list}
        boards={review.boards}
        lists={review.lists}
        isSyncing={review.isSyncing}
        onBoardChange={review.setBoard}
        onListChange={review.setList}
        onSync={review.handleSync}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8">
        <TaskList
          tasks={review.tasks}
          onChange={review.handleChange}
          onDelete={review.handleDelete}
        />
        <AddManualTaskButton onAdd={review.handleAddManual} />
      </div>
    </div>
  );
}
