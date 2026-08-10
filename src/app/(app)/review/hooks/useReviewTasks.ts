"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addManualTask,
  deleteTask,
  getLists,
  syncTasksToTrello,
  updateTask,
} from "../actions";
import type { Board, List, Task } from "../types";

export type UseReviewTasksResult = {
  readonly tasks: readonly Task[];
  readonly board: string | null;
  readonly list: string | null;
  readonly boards: readonly Board[];
  readonly lists: readonly List[];
  readonly isSyncing: boolean;
  readonly handleChange: (updated: Task) => void;
  readonly handleDelete: (id: string) => void;
  readonly handleAddManual: () => void;
  readonly handleSync: () => void;
  readonly setBoard: (id: string) => void;
  readonly setList: (id: string) => void;
};

export type UseReviewTasksParams = {
  readonly transcriptId: string;
  readonly initialTasks: readonly Task[];
  readonly initialBoards: readonly Board[];
};

export function useReviewTasks({
  transcriptId,
  initialTasks,
  initialBoards,
}: UseReviewTasksParams): UseReviewTasksResult {
  const [tasks, setTasks] = useState<readonly Task[]>(initialTasks);
  const [boards] = useState<readonly Board[]>(initialBoards);
  const [board, setBoard] = useState<string | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [list, setList] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleChange = useCallback((updated: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task)),
    );
    const formData = new FormData();
    formData.set("id", updated.id);
    formData.set("title", updated.title);
    formData.set("description", updated.description);
    formData.set("dueDate", updated.dueDate ?? "");
    void updateTask(formData);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    void deleteTask(id);
  }, []);

  const handleAddManual = useCallback(() => {
    void addManualTask(transcriptId).then((created) => {
      if (!created) return;
      setTasks((prev) => [...prev, created]);
    });
  }, [transcriptId]);

  const handleSync = useCallback(() => {
    if (!list) return;
    setIsSyncing(true);
    void syncTasksToTrello({ transcriptId, listId: list })
      .then(() => {
        setTasks((prev) =>
          prev.map((task) => ({ ...task, status: "synced" as const })),
        );
      })
      .finally(() => setIsSyncing(false));
  }, [transcriptId, list]);

  // Fetch Trello lists when the user selects a board.
  useEffect(() => {
    if (!board) {
      setLists([]);
      setList(null);
      return;
    }
    void getLists(board).then(setLists);
  }, [board]);

  return {
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
  };
}
