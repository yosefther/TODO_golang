# TODO_golang

A small todo app. The backend is a Go REST API (Gorilla Mux + SQLite), the frontend is React + TypeScript with Vite, Tailwind and TanStack Query.

## How to run it

You need Go 1.26.3+ (see `backend/go.mod`) and Node.js 22.12+.

Backend, from `backend/` (SQLite opens `./gotodo.db` relative to where you run it):

```sh
cd backend
go run .
```

It listens on `http://localhost:8080`. The repo ships with an existing `gotodo.db`.

Frontend, in a second terminal:

```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open `http://localhost:5173`.

## How it works

The API has four routes:

| Method | Route | Does |
| --- | --- | --- |
| GET | `/` | list all todos (`null` when empty) |
| POST | `/add` | add `{"Item": "..."}` |
| PUT | `/complete/{id}` | mark done |
| DELETE | `/delete/{id}` | delete, 404 if missing |

The frontend doesn't call Go directly. It calls `/api/...` and Vite proxies that to `localhost:8080` with the `/api` prefix stripped. That keeps everything same-origin, because the Go server doesn't handle CORS preflight. You can change the target with `API_PROXY_TARGET` in `frontend/.env`. For a production build you'd need your own reverse proxy doing the same thing.

On the frontend, `src/hooks/useTodos.ts` holds the TanStack Query logic. Since `POST /add` doesn't return the new todo, adding waits for a refetch. Complete and delete update the cache once the server confirms, then refetch to stay in sync.

## Tests

No backend tests yet (`go test ./...` finds no test files). The frontend has a type check and build:

```sh
cd frontend
npm run typecheck
npm run build
```

## Limitations

- The API doesn't validate input (blank items get through if you skip the UI) and `/complete` returns success even for an ID that doesn't exist.
- No editing, un-completing, auth or pagination.

## License

MIT. See [LICENSE](LICENSE).
