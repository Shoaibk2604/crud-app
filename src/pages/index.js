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
            <span className="pill pill-green">Done</span>
          ) : (
            <span className="pill pill-gray">Open</span>
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
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFeedback(null);
                  setEditTodo(todo);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
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
    <div
      className="ui-fade-in"
      style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Todos</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            Next.js API + Axios + TanStack Query + TanStack Table
          </p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          Add Todo
        </button>
      </header>

      {feedback ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background:
              feedback.type === "success"
                ? "rgba(0,200,120,0.12)"
                : "rgba(255,0,0,0.10)",
          }}
        >
          {feedback.message}
        </div>
      ) : null}

      {todosQuery.isLoading ? (
        <div style={{ marginTop: 16 }}>Loading…</div>
      ) : null}

      {todosQuery.isError ? (
        <div style={{ marginTop: 16 }}>
          <div>Failed to load todos.</div>
          <button
            type="button"
            onClick={() => todosQuery.refetch()}
            className="btn btn-secondary"
            style={{ marginTop: 8 }}
          >
            Retry
          </button>
        </div>
      ) : null}

      {!todosQuery.isLoading &&
      !todosQuery.isError &&
      Array.isArray(items) &&
      items.length === 0 ? (
        <div style={{ marginTop: 16 }}>No todos found.</div>
      ) : null}

      {!todosQuery.isLoading &&
      !todosQuery.isError &&
      Array.isArray(items) &&
      items.length > 0 ? (
        <div style={{ marginTop: 16 }}>
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
          <div style={{ display: "grid", gap: 12 }}>
            <div>Are you sure you want to delete “{deleteTodo.title}”?</div>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setDeleteTodo(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={onDelete}
                disabled={deleteMutation.isPending}
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
