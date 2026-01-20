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
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 12, opacity: 0.8 }}>Title</span>
        <input
          className="input"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          required
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={!!values.completed}
          onChange={(e) =>
            setValues((v) => ({ ...v, completed: e.target.checked }))
          }
        />
        <span>Completed</span>
      </label>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
