import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, completeTodo, deleteTodo, getTodos } from "../api/todos";
import type { Todo } from "../types/todo";

const todoKey = ["todos"] as const;

export function useTodos() {
  return useQuery({
    queryKey: todoKey,
    queryFn: ({ signal }) => getTodos(signal),
  });
}

export function useAddTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: addTodo,
    // Creation returns no ID, so wait for the authoritative list to refresh.
    onSuccess: () => client.invalidateQueries({ queryKey: todoKey }),
    onError: () => {
      void client.invalidateQueries({ queryKey: todoKey });
    },
  });
}

export function useTodoActions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: number;
      action: "complete" | "delete";
    }) => (action === "complete" ? completeTodo(id) : deleteTodo(id)),
    onSuccess: async (_, { id, action }) => {
      await client.cancelQueries({ queryKey: todoKey });
      client.setQueryData<Todo[]>(todoKey, (todos) =>
        action === "delete"
          ? todos?.filter((todo) => todo.Id !== id)
          : todos?.map((todo) =>
              todo.Id === id ? { ...todo, Completed: 1 } : todo,
            ),
      );
      await client.invalidateQueries({ queryKey: todoKey });
    },
    onError: () => {
      // A connection can fail after the server committed a change.
      void client.invalidateQueries({ queryKey: todoKey });
    },
  });
}
