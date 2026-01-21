import { useEffect, useState } from "react";

const empty = { title: "", completed: false, userId: 1 };

export default function TodoForm({ initialValues, onSubmit, onCancel, busy }) {
  const [values, setValues] = useState(empty);

  useEffect(() => {
    setValues({ ...empty, ...(initialValues ?? {}) });
  }, [initialValues]);

  function submit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs font-semibold text-slate-600">Title</span>
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          required
        />
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!values.completed}
          onChange={(e) =>
            setValues((v) => ({ ...v, completed: e.target.checked }))
          }
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
        />
        <span className="text-sm font-medium text-slate-800">Completed</span>
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 active:translate-y-px disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:translate-y-px disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
