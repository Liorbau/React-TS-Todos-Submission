import { useEffect, useState } from "react";
import type { Todo, TodoFilter } from "../types/todo.ts";

// Hook to manage todos state and actions
type UseTodosResult = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleComplete: (id: number) => void;
  updateTodo: (id: number, newText: string) => void;
  deleteTodo: (id: number) => void;
  clearCompleted: () => void;
};

const TODO_STORAGE_KEY = "react-ts-todos.todos";

const getNextIdFromTodos = (todos: Todo[]): number => {
  if (todos.length === 0) {
    return 1;
  }
  const maxId = todos.reduce(
    (max: number, todo: Todo): number => (todo.id > max ? todo.id : max),
    0,
  );
  return maxId + 1;
};

const readStoredTodos = (): Todo[] => {
  const raw = localStorage.getItem(TODO_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch {
    return [];
  }
};

export const useTodos = (): UseTodosResult => {
  const [todos, setTodos] = useState<Todo[]>(readStoredTodos);

  useEffect((): void => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string): void => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    setTodos((prev: Todo[]): Todo[] => {
      const newTodo: Todo = {
        id: getNextIdFromTodos(prev),
        text: trimmedText,
        completed: false,
      };
      return [...prev, newTodo];
    });
  };

  const toggleComplete = (id: number): void => {
    setTodos((prev: Todo[]): Todo[] =>
      prev.map(
        (todo: Todo): Todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const updateTodo = (id: number, newText: string): void => {
    const trimmedText = newText.trim();
    if (!trimmedText) {
      return;
    }

    setTodos((prev: Todo[]): Todo[] =>
      prev.map(
        (todo: Todo): Todo =>
          todo.id === id ? { ...todo, text: trimmedText } : todo,
      ),
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos((prev: Todo[]): Todo[] =>
      prev.filter((todo: Todo): boolean => todo.id !== id),
    );
  };

  const clearCompleted = (): void => {
    setTodos((prev: Todo[]): Todo[] =>
      prev.filter((todo: Todo): boolean => !todo.completed),
    );
  };

  return {
    todos,
    addTodo,
    toggleComplete,
    updateTodo,
    deleteTodo,
    clearCompleted,
  };
};

export const visibleTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  return todos.filter((todo: Todo): boolean => {
    if (filter === "all") {
      return true;
    }
    if (filter === "active") {
      return !todo.completed;
    }
    if (filter === "completed") {
      return todo.completed;
    }

    // fallback – should never happen if TodoFilter is correct
    return true;
  });
};
