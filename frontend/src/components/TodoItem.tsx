import { useTodoActions } from "../hooks/useTodos";
import type { Todo } from "../types/todo";
import { Icon } from "./Icon";

export function TodoItem({ todo }: { todo: Todo }) {
  const mutation = useTodoActions();
  const done = todo.Completed === 1;
  return (
    <li
      className={`rounded-xl border transition-colors ${done ? "border-slate-100 bg-slate-50/70" : "border-slate-200/80 bg-slate-50"}`}
      aria-busy={mutation.isPending}
    >
      <div className="flex items-center gap-2 p-2 sm:gap-3 sm:px-3">
        <button
          type="button"
          disabled={done || mutation.isPending}
          onClick={() => mutation.mutate({ id: todo.Id, action: "complete" })}
          aria-label={
            done ? `Completed: ${todo.Item}` : `Mark ${todo.Item} as completed`
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-brand disabled:opacity-100"
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full border-2 ${done ? "border-brand bg-brand text-white" : "border-slate-400 hover:border-brand"}`}
          >
            {done && <Icon name="check" className="size-4" />}
          </span>
        </button>
        <span
          className={`min-w-0 flex-1 py-2 text-[15px] [overflow-wrap:anywhere] ${done ? "text-slate-500 line-through" : "text-slate-800"}`}
        >
          {todo.Item}
          <span className="sr-only">
            {done ? ", completed" : ", unfinished"}
          </span>
        </span>
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ id: todo.Id, action: "delete" })}
          aria-label={`Delete ${todo.Item}`}
          title="Delete task"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <Icon name="trash" />
        </button>
      </div>
      {mutation.isPending && (
        <p role="status" className="px-5 pb-3 text-xs text-slate-600">
          {mutation.variables.action === "delete" ? "Deleting…" : "Completing…"}
        </p>
      )}
      {mutation.error && (
        <p role="alert" className="px-5 pb-3 text-sm text-red-700">
          Couldn't {mutation.variables?.action} this task.{" "}
          {mutation.error.message}
        </p>
      )}
    </li>
  );
}
