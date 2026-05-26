## Summary

This PR delivers a fully typed single-page Todos app built with React + Vite + TypeScript for Week 1.  
The app supports full todo lifecycle management: add, toggle complete/incomplete, inline edit, delete, filtering (All / Active / Completed), clear completed, items-left counter, empty state, and persistence with localStorage.

## Architecture Notes

Component tree and responsibilities:

- `src/main.tsx` mounts the app.
- `src/App.tsx` is the page-level orchestrator:
  - owns UI state for new todo input/error and active filter
  - wires handlers and composes child components
  - computes derived values like itemsLeft and filteredTodos
- `src/components/TodoList.tsx` handles list rendering + inline editing UI
- `src/components/FilterBar.tsx` is a focused presentational control for filter selection
- `src/types/todo.ts` centralizes shared domain types (Todo, TodoFilter)

Custom hook(s) and why:

- `src/hooks/useTodos.ts` (`useTodos`) centralizes todo business logic and persistence:
  - CRUD mutations + clearCompleted
  - immutable updates (map / filter / spread)
  - localStorage read/write lifecycle
  - visibleTodos helper for filter behavior

Reason: keeps business/state logic out of UI components and makes App + child components simpler, more testable, and easier to reason about.

## Tradeoffs / Shortcuts

- IDs are generated incrementally from the highest stored ID (simple and predictable for this local-only app).
- (Not unique if would track deleted Todos as well)
- Filter default is 'Active' for a user friendly experience.

## Validation / Acceptance Checklist

- Vite + React + TypeScript scaffold
- Full CRUD flow implemented
- Filter view (All / Active / Completed) implemented
- Persistence across reloads via localStorage
- At least one meaningful custom hook (useTodos)
- Lifted state at appropriate level (App + hook separation)
- 3+ single-responsibility components

Quality checks used in this repo:

- `npx tsc --noEmit`
- `npx eslint .`
- `npm run test:run` (includes integration + hook edge-case coverage)
