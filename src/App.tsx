import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { useTodos, visibleTodos } from "./hooks/useTodos.ts";
import type { Todo, TodoFilter } from "./types/todo.ts";
import { TodoList } from "./components/TodoList.tsx";
import { FilterBar } from "./components/FilterBar.tsx";
import "./App.css";

function App(): JSX.Element {
  const {
    todos,
    addTodo,
    toggleComplete,
    updateTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [newTodoError, setNewTodoError] = useState<string>("");
  const [filter, setFilter] = useState<TodoFilter>("active");

  const handleNewTodoTextChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setNewTodoText(inputValue);
    if (inputValue.trim()) {
      setNewTodoError("");
    }
  };

  const handleAddTodo = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTodoText.trim()) {
      setNewTodoError("Todo text cannot be empty");
      return;
    }
    addTodo(newTodoText);
    setNewTodoText("");
    setNewTodoError("");
  };

  const handleToggleComplete = (id: number): void => {
    toggleComplete(id);
  };

  const handleDeleteTodo = (id: number): void => {
    deleteTodo(id);
  };

  const handleUpdateTodo = (id: number, newText: string): void => {
    updateTodo(id, newText);
  };

  const handleClearCompleted = (): void => {
    clearCompleted();
  };

  const itemsLeft = todos.filter(
    (todo: Todo): boolean => !todo.completed,
  ).length;
  const filteredTodos = visibleTodos(todos, filter);

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Todos</h1>
        <p className="app__subtitle">
          MasterSchool Fellowship week 1 project by Lior Baumoel
        </p>
      </header>

      <p className="app__status">Items left: {itemsLeft}</p>

      <div className="controls">
        <FilterBar filter={filter} onFilterChange={setFilter} />
      </div>

      <button
        className="button button--secondary"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>

      <TodoList
        todos={filteredTodos}
        toggleComplete={handleToggleComplete}
        deleteTodo={handleDeleteTodo}
        updateTodo={handleUpdateTodo}
      />

      <form className="input-row" onSubmit={handleAddTodo}>
        <input
          className="input-row__field"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={handleNewTodoTextChange}
          aria-invalid={Boolean(newTodoError)}
          aria-describedby={newTodoError ? "new-todo-error" : undefined}
        />
        <button className="button button--primary" type="submit">
          Add Todo
        </button>
      </form>
      {newTodoError && (
        <p id="new-todo-error" className="input-row__error" role="alert">
          {newTodoError}
        </p>
      )}
    </main>
  );
}

export default App;
