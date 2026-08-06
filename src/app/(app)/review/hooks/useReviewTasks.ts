"use client";

import { useCallback, useState } from "react";

import type { Task } from "../types";

const SYNC_DELAY_MS = 1000;

export type UseReviewTasksResult = {
  readonly tasks: readonly Task[];
  readonly board: string;
  readonly list: string;
  readonly isSyncing: boolean;
  readonly handleChange: (updated: Task) => void;
  readonly handleDelete: (id: string) => void;
  readonly handleAddManual: () => void;
  readonly handleSync: () => void;
  readonly setBoard: (value: string) => void;
  readonly setList: (value: string) => void;
};

export function useReviewTasks(
  initialTasks: readonly Task[],
  initialBoard: string,
  initialList: string,
): UseReviewTasksResult {
  const [tasks, setTasks] = useState<readonly Task[]>(initialTasks);
  const [board, setBoard] = useState<string>(initialBoard);
  const [list, setList] = useState<string>(initialList);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleChange = useCallback((updated: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task)),
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleAddManual = useCallback(() => {
    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      title: "",
      description: "",
      dueDate: "",
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const handleSync = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), SYNC_DELAY_MS);
  }, []);

  return {
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
  };
}
