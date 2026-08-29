import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAddTodo } from "../hooks/useTodos";
import { Icon } from "./Icon";

export function AddTodoForm() {
  const [text, setText] = useState("");
  const [validation, setValidation] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const add = useAddTodo();
  const error =
    validation ||
    (add.error ? `Couldn't add your task. ${add.error.message}` : "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (add.isPending) return;
    if (!text.trim()) {
      setValidation("Please enter a task.");
      input.current?.focus();
      return;
    }
    setValidation("");
    add.mutate(text, {
      onSuccess: () => {
        setText("");
        requestAnimationFrame(() => input.current?.focus());
      },
    });
  }

  return (
    <form onSubmit={submit} className="mb-8" aria-busy={add.isPending}>
      <label
        htmlFor="new-todo"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        What's on your list?
      </label>
      <div className="flex gap-2 sm:gap-3">
        <input
          ref={input}
          id="new-todo"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setValidation("");
            add.reset();
          }}
          disabled={add.isPending}
          aria-invalid={!!error}
          aria-describedby={error ? "add-error" : undefined}
          autoComplete="off"
          placeholder="Add a task…"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={add.isPending}
          aria-label={add.isPending ? "Adding task" : "Add task"}
          className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-xl bg-brand px-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:px-5"
        >
          <Icon name="plus" />
          <span className="hidden sm:inline">
            {add.isPending ? "Adding…" : "Add task"}
          </span>
        </button>
      </div>
      {error && (
        <p id="add-error" role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <span role="status" className="sr-only">
        {add.isSuccess ? "Task added." : ""}
      </span>
    </form>
  );
}
