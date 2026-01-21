import { readTodos, writeTodos } from "../../../lib/todosStore";

export default function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ message: "Invalid id" });

  if (req.method === "GET") {
    const todos = readTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(todo);
  }

  if (req.method === "PUT") {
    const todos = readTodos();
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    const body = req.body ?? {};
    const updated = {
      ...todos[idx],
      ...(typeof body.title === "string" ? { title: body.title } : null),
      ...(typeof body.userId === "number" ? { userId: body.userId } : null),
      ...(typeof body.completed === "boolean"
        ? { completed: body.completed }
        : null),
    };

    const next = [...todos];
    next[idx] = updated;
    writeTodos(next);
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const todos = readTodos();
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    const next = todos.filter((t) => t.id !== id);
    writeTodos(next);
    return res.status(200).json({ id });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
