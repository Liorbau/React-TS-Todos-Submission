import { useState, type JSX } from "react";
import type { Todo } from "../types/todo.ts";

type TodoListProps = {
  todos: Todo[];
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, newText: string) => void;
};

export const TodoList = ({
  todos,
  toggleComplete,
  deleteTodo,
  updateTodo,
}: TodoListProps): JSX.Element => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  const startEdit = (id: number, text: string): void => {
    setEditingId(id);
    setEditText(text);
    setEditError("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditText("");
    setEditError("");
  };

  const handleEditTextChange = (nextText: string): void => {
    setEditText(nextText);
    if (nextText.trim()) {
      setEditError("");
    }
  };

  const saveEdit = (id: number): void => {
    if (!editText.trim()) {
      setEditError("Todo text cannot be empty");
      return;
    }
    updateTodo(id, editText);
    cancelEdit();
  };

  return (
    <ul className="todo-list">
      {todos.length === 0 && (
        <li className="todo-list__empty">No todos to show</li>
      )}
      {todos.map(
        (todo: Todo): JSX.Element => (
          <li
            key={todo.id}
            className={todo.completed ? "todo-item is-completed" : "todo-item"}
          >
            <input
              type="checkbox"
              className="todo-item__checkbox"
              checked={todo.completed}
              onChange={(): void => toggleComplete(todo.id)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  className="todo-item__edit-input"
                  value={editText}
                  onChange={(event): void =>
                    handleEditTextChange(event.target.value)
                  }
                  autoFocus
                  aria-invalid={Boolean(editError)}
                  aria-describedby={editError ? "edit-todo-error" : undefined}
                />
                <button
                  className="button button--secondary"
                  onClick={(): void => saveEdit(todo.id)}
                >
                  Save
                </button>
                <button className="button button--ghost" onClick={cancelEdit}>
                  Cancel
                </button>
                {editError && (
                  <span
                    id="edit-todo-error"
                    className="todo-item__error"
                    role="alert"
                  >
                    {editError}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="todo-item__text">{todo.text}</span>
                <button
                  className="button button--ghost"
                  onClick={(): void => startEdit(todo.id, todo.text)}
                >
                  Edit
                </button>
                <button
                  className="button button--ghost-danger"
                  onClick={(): void => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ),
      )}
    </ul>
  );
};
