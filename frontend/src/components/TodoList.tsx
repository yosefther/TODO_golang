import type { Todo } from "../types/todo";
import { Icon } from "./Icon";
import { TodoItem } from "./TodoItem";

export function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-slate-200 px-5 py-14 text-center"
        role="status"
      >
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-blue-50 text-brand">
          <Icon name="check" className="size-7" />
        </span>
        <h3 className="text-lg font-semibold">All clear</h3>
        <p className="mt-2 text-sm text-slate-500">
          Add your first task and take it one step at a time.
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-2.5" aria-label="Todos">
      {todos.map((todo) => (
        <TodoItem key={todo.Id} todo={todo} />
      ))}
    </ul>
  );
}
