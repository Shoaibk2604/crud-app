import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../api/todosApi";

const todosKey = ["todos"];

export function useTodos() {
  return useQuery({
    queryKey: todosKey,
    queryFn: getTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: todosKey });
      const previous = queryClient.getQueryData(todosKey);

      const optimistic = {
        id: `tmp-${Date.now()}`,
        userId: 1,
        completed: false,
        ...newTodo,
      };

      queryClient.setQueryData(todosKey, (old) => {
        const safe = Array.isArray(old) ? old : [];
        return [optimistic, ...safe];
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(todosKey, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosKey });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }) => updateTodo(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: todosKey });
      const previous = queryClient.getQueryData(todosKey);

      queryClient.setQueryData(todosKey, (old) => {
        const safe = Array.isArray(old) ? old : [];
        return safe.map((t) => (t.id === id ? { ...t, ...patch } : t));
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(todosKey, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosKey });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todosKey });
      const previous = queryClient.getQueryData(todosKey);

      queryClient.setQueryData(todosKey, (old) => {
        const safe = Array.isArray(old) ? old : [];
        return safe.filter((t) => t.id !== id);
      });

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(todosKey, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosKey });
    },
  });
}
