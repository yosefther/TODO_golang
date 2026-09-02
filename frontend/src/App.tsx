import { AddTodoForm } from "./components/AddTodoForm";
import { Icon } from "./components/Icon";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";

export default function App() {
  const query = useTodos();
  const remaining = query.data?.filter((todo) => todo.Completed === 0).length;

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-16"
    >
      <div className="mb-7 flex items-center gap-2.5 text-sm font-semibold tracking-wide text-slate-600">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
          <Icon name="list" className="size-4" />
        </span>
        A little more organized.
      </div>
      <section
        aria-labelledby="page-title"
        className="rounded-3xl border border-white bg-white p-5 shadow-[0_12px_60px_-24px_rgba(30,41,59,0.2)] sm:p-9"
      >
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1
              id="page-title"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              My Todos
            </h1>
            <p role="status" className="mt-2 text-sm text-slate-500">
              {query.data
                ? `${remaining} of ${query.data.length} remaining`
                : query.isPending
                  ? "Getting your tasks…"
                  : "Your tasks are unavailable"}
            </p>
          </div>
          {remaining !== undefined && (
            <span className="mt-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand">
              {remaining === 0 ? "All clear" : `${remaining} to go`}
            </span>
          )}
        </header>
        <AddTodoForm />
        <section aria-labelledby="tasks-heading">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2
              id="tasks-heading"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Your tasks
            </h2>
            {query.isFetching && !query.isPending && (
              <span role="status" className="text-xs text-slate-500">
                Refreshing…
              </span>
            )}
          </div>
          {query.isPending && (
            <p
              role="status"
              className="rounded-xl bg-slate-50 px-5 py-12 text-center text-sm text-slate-500"
            >
              Loading your todos…
            </p>
          )}
          {query.isError && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"
            >
              <p className="font-semibold">
                {query.data
                  ? "Could not refresh your todos. The list may be out of date."
                  : "Could not load your todos."}
              </p>
              <p className="mt-1 [overflow-wrap:anywhere]">
                {query.error.message}
              </p>
              <button
                type="button"
                disabled={query.isFetching}
                onClick={() => void query.refetch()}
                className="mt-3 min-h-11 rounded-lg border border-red-200 px-4 font-semibold hover:bg-red-100"
              >
                {query.isFetching ? "Retrying…" : "Try again"}
              </button>
            </div>
          )}
          {query.data && <TodoList todos={query.data} />}
        </section>
      </section>
      <p className="mt-6 text-center text-xs text-slate-500">
        One task at a time. You've got this.
      </p>
    </main>
  );
}
