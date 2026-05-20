import { useState, type ChangeEvent, type JSX } from "react";
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

  const startEdit = (id: number, text: string): void => {
    setEditingId(id);
    setEditText(text);
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = (id: number): void => {
    if (!editText.trim()) return;
    updateTodo(id, editText);
    cancelEdit();
  };
  const handleTodoToggle = (id: number): void => {
    toggleComplete(id);
  };
  const handleEditTextChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditText(e.target.value);
  };
  const handleSaveClick = (id: number): void => {
    saveEdit(id);
  };
  const handleStartEdit = (id: number, text: string): void => {
    startEdit(id, text);
  };
  const handleDeleteClick = (id: number): void => {
    deleteTodo(id);
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
              onChange={(): void => handleTodoToggle(todo.id)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  className="todo-item__edit-input"
                  value={editText}
                  onChange={handleEditTextChange}
                  autoFocus
                />
                <button
                  className="button button--secondary"
                  onClick={(): void => handleSaveClick(todo.id)}
                >
                  Save
                </button>
                <button className="button button--ghost" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="todo-item__text">{todo.text}</span>
                <button
                  className="button button--ghost"
                  onClick={(): void => handleStartEdit(todo.id, todo.text)}
                >
                  Edit
                </button>
                <button
                  className="button button--ghost-danger"
                  onClick={(): void => handleDeleteClick(todo.id)}
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
