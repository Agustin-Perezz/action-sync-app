"use client";

import { useReviewTasks } from "../hooks/useReviewTasks";
import { INITIAL_TASKS, MOCK_BOARDS, MOCK_LISTS } from "../types";
import { AddManualTaskButton } from "./AddManualTaskButton";
import { ReviewControls } from "./ReviewControls";
import { TaskList } from "./TaskList";

export function ReviewWorkspace() {
  const {
    tasks,
    board,
    list,
    isSyncing,
    handleChange,
    handleDelete,
    handleAddManual,
    handleSync,
    setBoard,
    setList,
  } = useReviewTasks(INITIAL_TASKS, MOCK_BOARDS[0], MOCK_LISTS[0]);

  return (
    <div>
      <ReviewControls
        taskCount={tasks.length}
        board={board}
        list={list}
        boards={MOCK_BOARDS}
        lists={MOCK_LISTS}
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
