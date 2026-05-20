import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "../types/todo.ts";
import { useTodos, visibleTodos } from "./useTodos.ts";

const STORAGE_KEY = "react-ts-todos.todos";

const sampleTodos = (): Todo[] => [
  { id: 1, text: "A", completed: false },
  { id: 2, text: "B", completed: true },
];

describe("useTodos edge cases", (): void => {
  beforeEach((): void => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("falls back to empty array on malformed JSON", (): void => {
    localStorage.setItem(STORAGE_KEY, "{broken");

    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );
    expect(result.current.todos).toEqual([]);
  });

  it("falls back to empty array when storage value is not an array", (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ wrong: true }));

    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );
    expect(result.current.todos).toEqual([]);
  });

  it("loads valid todos from storage", (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTodos()));

    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );
    expect(result.current.todos).toEqual(sampleTodos());
  });

  it("trims added text and persists it", (): void => {
    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );

    act((): void => {
      result.current.addTodo("   ship tests   ");
    });

    expect(result.current.todos).toEqual([
      { id: 1, text: "ship tests", completed: false },
    ]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")).toEqual(
      result.current.todos,
    );
  });

  it("rejects whitespace-only todo text", (): void => {
    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );

    act((): void => {
      result.current.addTodo("    ");
    });

    expect(result.current.todos).toEqual([]);
  });

  it("continues id counter from the highest persisted todo id", (): void => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 2, text: "Older", completed: true } satisfies Todo,
        { id: 10, text: "Latest", completed: false } satisfies Todo,
      ]),
    );
    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );

    act((): void => {
      result.current.addTodo("new item");
    });

    expect(result.current.todos.at(-1)).toEqual({
      id: 11,
      text: "new item",
      completed: false,
    });
  });

  it("ignores whitespace-only update requests", (): void => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 7, text: "Keep me", completed: false } satisfies Todo,
      ]),
    );
    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );

    act((): void => {
      result.current.updateTodo(7, "   ");
    });

    expect(result.current.todos[0]?.text).toBe("Keep me");
  });

  it("handles toggle, delete, and clear completed in sequence", (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTodos()));
    const { result } = renderHook(
      (): ReturnType<typeof useTodos> => useTodos(),
    );

    act((): void => {
      result.current.toggleComplete(1);
    });
    expect(
      result.current.todos.every((todo: Todo): boolean => todo.completed),
    ).toBe(true);

    act((): void => {
      result.current.deleteTodo(2);
    });
    expect(result.current.todos).toHaveLength(1);

    act((): void => {
      result.current.clearCompleted();
    });
    expect(result.current.todos).toEqual([]);
  });
});

describe("visibleTodos edge cases", (): void => {
  it("filters active and completed correctly", (): void => {
    const todos = sampleTodos();
    expect(visibleTodos(todos, "active")).toEqual([
      { id: 1, text: "A", completed: false },
    ]);
    expect(visibleTodos(todos, "completed")).toEqual([
      { id: 2, text: "B", completed: true },
    ]);
  });

  it("falls back to returning all when filter is invalid at runtime", (): void => {
    const todos = sampleTodos();
    const invalidFilter = "weird-filter" as unknown as "active";

    expect(visibleTodos(todos, invalidFilter)).toEqual(todos);
  });
});
