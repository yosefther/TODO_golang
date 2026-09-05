# Go Todo

A small todo app with a Go + SQLite API and a responsive React, TypeScript, Vite,
Tailwind CSS, and TanStack Query frontend.

## Run locally

Requirements: Go **1.26.3 or newer** (see `backend/go.mod`) and Node.js **22.12 or newer** with npm.

From the repository root, start the backend:

```sh
cd backend
go mod download
go run .
```

The API listens on `http://localhost:8080`. Run it from `backend/` because SQLite
opens `./gotodo.db` relative to the working directory. The repository includes an
existing database; it is preserved by the frontend migration.

In a second terminal, from the repository root:

```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Add a task with Enter or the Add task button, mark it
completed with the circular button, or delete it with the trash button. Completed
tasks cannot be reopened because the API only supports completion.

## API configuration

`VITE_API_BASE_URL` defaults to `/api`. Vite proxies `/api/` to
`http://localhost:8080/`, removing the `/api` prefix. This keeps browser requests on
the same origin and avoids the Go server's incomplete CORS preflight support.
Set `API_PROXY_TARGET` in `frontend/.env` to change the proxy destination. Restart
Vite after changing environment variables.

For production, serve `frontend/dist/` and configure your web server to proxy
`/api/*` to Go, stripping `/api`. Alternatively, set `VITE_API_BASE_URL` to an
absolute API URL **before building**, and configure that API's hosting layer to
handle CORS, including OPTIONS, POST, PUT, DELETE, and Content-Type. Vite's proxy
is available during development and local preview; it is not part of the static
build. Client environment variables are public and must not contain secrets.

## API contract

| Method | Go endpoint | Request body | Successful response |
| --- | --- | --- | --- |
| GET | `/` | None | `[{"Id":1,"Item":"Read a book","Completed":0}]`, or `null` when empty |
| POST | `/add` | `{"Item":"Read a book"}` | HTTP 201, `{"message":"created"}` |
| PUT | `/complete/{id}` | None | `{"message":"completed"}` |
| DELETE | `/delete/{id}` | None | `{"message":"deleted"}` |

`Completed` is numeric: `0` for unfinished, `1` for completed. Errors may be plain
text; deleting a missing ID returns HTTP 404. Creation returns no ID or new todo,
so the frontend waits for a fresh list after adding. Completion and deletion
update cached data after server success, then refresh it. Failed requests retain
the entered text or existing task, show an error, and trigger reconciliation.
If refreshing fails, the UI explicitly warns that the displayed list may be stale.

Other backend limitations: creation does not validate JSON or reject blank items
(the frontend trims and validates text); completion reports success even when an
ID does not exist; list ordering is not explicitly specified. There is no undo,
editing, authentication, or pagination.

## Frontend structure

```text
frontend/src/
  api/todos.ts                 HTTP requests and API error handling
  types/todo.ts                Go JSON contract
  hooks/useTodos.ts            TanStack Query queries and mutations
  components/AddTodoForm.tsx   Input validation and add request state
  components/TodoItem.tsx      Completion, deletion, and per-task errors
  components/TodoList.tsx      List and empty state
  components/Icon.tsx          Shared SVG icons
  App.tsx                     Page, count, loading, and fetch errors
  main.tsx                    React root and query provider
  index.css                   Tailwind and global accessibility styles
```

## Checks and production build

```sh
cd frontend
npm ci
npm run typecheck
npm run build
npm run preview
```

Preview runs at `http://localhost:4173` and uses the same API proxy; keep Go running.

Backend checks, from the repository root:

```sh
cd backend
go test ./...
```

The original repository contains no Go test files. For a manual workflow check,
add a task, reload to confirm persistence, complete it, reload again, and delete
it. Try submitting whitespace and stopping the backend to check validation and
request errors.

The migration was verified with TypeScript checking, a production build, and
`go test ./...`. Headless Chromium checks against the real Go API and an isolated
temporary database covered CRUD, reload persistence, counts, whitespace
validation, loading/empty states, disabled controls, keyboard operation, visible
focus, and layouts down to 320px. Simulated request failures covered add,
completion, deletion, initial loading, and a failed refresh after successful
creation. The checked-in SQLite database was not changed.

Implementation references: [Vite proxy configuration](https://vite.dev/config/server-options#server-proxy),
[Tailwind's Vite integration](https://tailwindcss.com/docs/installation/using-vite),
and [TanStack Query mutation invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations).
