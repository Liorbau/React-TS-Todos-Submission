# CLAUDE.md

Guidance for AI/code assistants working in this repository.

## Project Context

- Stack: React + Vite + TypeScript
- App type: single-page Todos app
- Persistence: browser `localStorage` only (no backend)
- Primary goal: clean, fully typed implementation with explicit return types

## Source of Truth

- Product requirements: `instructions.md`
- Architecture details: `ARCHITECTURE_SUMMARY.md`
- Runtime code: `src/`

If instructions conflict, prioritize:
1. User request in current task
2. `instructions.md`
3. Existing code conventions

## Architecture at a Glance

- `src/main.tsx`: app bootstrap/mount
- `src/App.tsx`: composition container and page-level wiring
- `src/hooks/useTodos.ts`: todo state, mutations, persistence, filtering helper
- `src/components/TodoList.tsx`: list rendering + inline editing UI
- `src/components/FilterBar.tsx`: filter selection UI
- `src/types/todo.ts`: shared domain types

## Coding Standards

- TypeScript strict mode must remain enabled.
- No `any`.
- Every function must have an explicit return type.
- Prefer small, focused components and hooks.
- Keep business logic in hooks or top-level state containers; keep UI components presentational when possible.
- Use immutable updates for state (`map`, `filter`, spread).

## Change Rules

- Do not introduce Redux/Zustand/Next.js.
- Do not add backend/API dependencies for todo persistence.
- Preserve localStorage behavior and storage key compatibility unless explicitly requested.
- Avoid broad refactors unless directly needed for the task.

## Verification Checklist

Run before finalizing changes:

```bash
npx tsc --noEmit
npx eslint .
```

Manual smoke-check in app:

- add todo
- toggle complete
- edit inline
- delete
- filter all/active/completed
- clear completed
- reload page and confirm persistence

## PR / Submission Notes

Include in PR description:

- short summary of what changed
- architecture note (component tree + custom hook rationale)
- tradeoffs or shortcuts taken

