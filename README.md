# React TS Todos

A small single-page Todos app built with React, Vite, and TypeScript.

## What this app does

- Add todos
- Mark complete/incomplete
- Edit inline
- Delete todos
- Filter: Active / Completed / All
- Clear completed in one click
- Save todos across page reloads (localStorage)

## Architecture

- `src/main.tsx`: starts the app
- `src/App.tsx`: page-level coordinator (state wiring + layout)
- `src/hooks/useTodos.ts`: todo logic and persistence
- `src/components/TodoList.tsx`: todo row rendering and inline edit UI
- `src/components/FilterBar.tsx`: filter buttons
- `src/types/todo.ts`: TypeScript types for todos and filter values

## Overall flow

1. User clicks/types in the UI.
2. A handler in `App` or `TodoList` runs.
3. `useTodos` updates todo state immutably.
4. React re-renders the UI with new values.
5. A `useEffect` in `useTodos` writes todos to localStorage.

## Run locally

```bash
npm install
npm run dev
```

## Type-check

```bash
npx tsc --noEmit
```
