import type { AddTodoRequest, MutationResponse, Todo } from "../types/todo";

const baseUrl = (import.meta.env.VITE_API_BASE_URL?.trim() || "/api").replace(
  /\/+$/,
  "",
);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    signal: options.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(15_000)])
      : AbortSignal.timeout(15_000),
    headers: { Accept: "application/json", ...options.headers },
  });

  if (!response.ok) {
    // Go's http.Error sends plain text, even on these JSON endpoints.
    const detail = (await response.text()).trim();
    throw new Error(
      detail || `Request failed (${response.status}). Please try again.`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getTodos(signal?: AbortSignal): Promise<Todo[]> {
  const todos = await request<Todo[] | null>("/", { signal });
  // The backend serializes an empty slice as null.
  return todos ?? [];
}

export function addTodo(item: string): Promise<MutationResponse> {
  const body: AddTodoRequest = { Item: item.trim() };
  if (!body.Item) return Promise.reject(new Error("Please enter a task."));
  return request("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function completeTodo(id: number): Promise<MutationResponse> {
  return request(`/complete/${id}`, { method: "PUT" });
}

export function deleteTodo(id: number): Promise<MutationResponse> {
  return request(`/delete/${id}`, { method: "DELETE" });
}
