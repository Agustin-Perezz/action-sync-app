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
  const {
    tasks,
    board,
    list,
    boards,
    lists,
    isSyncing,
    handleChange,
    handleDelete,
    handleAddManual,
    handleSync,
    setBoard,
    setList,
  } = useReviewTasks({ transcriptId, initialTasks, initialBoards });

  return (
    <div>
      <ReviewControls
        taskCount={tasks.length}
        board={board}
        list={list}
        boards={boards}
        lists={lists}
        isSyncing={isSyncing}
        onBoardChange={setBoard}
        onListChange={setList}
        onSync={handleSync}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8">
        <TaskList
          tasks={tasks}
          onChange={handleChange}
          onDelete={handleDelete}
        />
        <AddManualTaskButton onAdd={handleAddManual} />
      </div>
    </div>
  );
}
