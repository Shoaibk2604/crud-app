import { useMemo, useState } from "react";
import Modal from "../components/common/Modal";
import TodoForm from "../components/todos/TodoForm";
import TodosTable from "../components/todos/TodosTable";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "../hooks/useTodos";

export default function Home() {
  const todosQuery = useTodos();
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [deleteTodo, setDeleteTodo] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", enableSorting: true },
      { accessorKey: "title", header: "Title", enableSorting: true },
      {
        accessorKey: "completed",
        header: "Completed",
        enableSorting: true,
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-extrabold text-emerald-800">
              Done
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-extrabold text-slate-700">
              Open
            </span>
          ),
      },
      { accessorKey: "userId", header: "User", enableSorting: true },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const todo = row.original;
          return (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 active:translate-y-px"
                onClick={() => {
                  setFeedback(null);
                  setEditTodo(todo);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 active:translate-y-px"
                onClick={() => {
                  setFeedback(null);
                  setDeleteTodo(todo);
                }}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  function showSuccess(message) {
    setFeedback({ type: "success", message });
    window.setTimeout(() => setFeedback(null), 2500);
  }

  function showError(message) {
    setFeedback({ type: "error", message });
  }

  async function onCreate(values) {
    setFeedback(null);
    try {
      await createMutation.mutateAsync(values);
      setCreateOpen(false);
      showSuccess("Created successfully");
    } catch {
      showError("Create failed. Please try again.");
    }
  }

  async function onUpdate(values) {
    if (!editTodo) return;
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({ id: editTodo.id, patch: values });
      setEditTodo(null);
      showSuccess("Updated successfully");
    } catch {
      showError("Update failed. Please try again.");
    }
  }

  async function onDelete() {
    if (!deleteTodo) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(deleteTodo.id);
      setDeleteTodo(null);
      showSuccess("Deleted successfully");
    } catch {
      showError("Delete failed. Please try again.");
    }
  }

  const items = todosQuery.data;

  return (
    <div className="mx-auto max-w-5xl p-6 animate-[ui-fade-in_160ms_ease-out]">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Todos
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Axios + TanStack Query + TanStack Table
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:translate-y-px"
        >
          Add Todo
        </button>
      </header>

      {feedback ? (
        <div
          className={
            feedback.type === "success"
              ? "mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
              : "mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900"
          }
        >
          {feedback.message}
        </div>
      ) : null}

      {todosQuery.isLoading ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          Loading…
        </div>
      ) : null}

      {todosQuery.isError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <div className="font-semibold">Failed to load todos.</div>
          <button
            type="button"
            onClick={() => todosQuery.refetch()}
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm transition hover:bg-rose-100/30 active:translate-y-px"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!todosQuery.isLoading &&
      !todosQuery.isError &&
      Array.isArray(items) &&
      items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          No todos found.
        </div>
      ) : null}

      {!todosQuery.isLoading &&
      !todosQuery.isError &&
      Array.isArray(items) &&
      items.length > 0 ? (
        <div className="mt-4">
          <TodosTable data={items} columns={columns} pageSize={10} />
        </div>
      ) : null}

      {createOpen ? (
        <Modal title="Add Todo" onClose={() => setCreateOpen(false)}>
          <TodoForm
            onSubmit={onCreate}
            onCancel={() => setCreateOpen(false)}
            busy={createMutation.isPending}
          />
        </Modal>
      ) : null}

      {editTodo ? (
        <Modal title="Edit Todo" onClose={() => setEditTodo(null)}>
          <TodoForm
            initialValues={{
              title: editTodo.title ?? "",
              completed: !!editTodo.completed,
              userId: editTodo.userId ?? 1,
            }}
            onSubmit={onUpdate}
            onCancel={() => setEditTodo(null)}
            busy={updateMutation.isPending}
          />
        </Modal>
      ) : null}

      {deleteTodo ? (
        <Modal title="Delete Todo" onClose={() => setDeleteTodo(null)}>
          <div className="grid gap-4">
            <div className="text-sm text-slate-700">
              Are you sure you want to delete “
              <span className="font-semibold">{deleteTodo.title}</span>”?
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTodo(null)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 active:translate-y-px disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 active:translate-y-px disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Working…" : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
