"use client";

import { useCallback, useEffect, useState } from "react";
import { TASK_STATUS } from "@/domain/entities/task-status.enum";
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
  readonly syncError: string | null;
  readonly syncSuccess: string | null;
  readonly editingTask: Task | null;
  readonly isSaving: boolean;
  readonly saveError: string | null;
  readonly startEdit: (task: Task) => void;
  readonly setEditField: (updated: Task) => void;
  readonly cancelEdit: () => void;
  readonly saveEdit: () => void;
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
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const startEdit = useCallback((task: Task) => {
    setEditingTask({ ...task });
    setSaveError(null);
  }, []);

  const setEditField = useCallback((updated: Task) => {
    setEditingTask(updated);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingTask(null);
    setSaveError(null);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingTask) return;
    setIsSaving(true);
    setSaveError(null);
    const formData = new FormData();
    formData.set("id", editingTask.id);
    formData.set("title", editingTask.title);
    formData.set("description", editingTask.description);
    formData.set("dueDate", editingTask.dueDate ?? "");
    void updateTask(formData)
      .then(() => {
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? editingTask : task)),
        );
        setEditingTask(null);
      })
      .catch((error: unknown) => {
        setSaveError(
          error instanceof Error
            ? error.message
            : "Failed to save task. Please try again.",
        );
      })
      .finally(() => setIsSaving(false));
  }, [editingTask]);

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
    setSyncError(null);
    setSyncSuccess(null);
    void syncTasksToTrello({ transcriptId, listId: list })
      .then(() => {
        setTasks((prev) =>
          prev.map((task) => ({ ...task, status: TASK_STATUS.SYNCED })),
        );
        setSyncSuccess("Tasks synced to Trello successfully.");
      })
      .catch((error: unknown) => {
        setSyncError(
          error instanceof Error
            ? error.message
            : "Sync failed. Please try again.",
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
    syncError,
    syncSuccess,
    editingTask,
    isSaving,
    saveError,
    startEdit,
    setEditField,
    cancelEdit,
    saveEdit,
    handleDelete,
    handleAddManual,
    handleSync,
    setBoard,
    setList,
  };
}
