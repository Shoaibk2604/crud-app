import { readTodos, writeTodos } from "../../../lib/todosStore";

export default function handler(req, res) {
  if (req.method === "GET") {
    const todos = readTodos();
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const todos = readTodos();
    const body = req.body ?? {};

    const maxId = todos.reduce(
      (m, t) => (typeof t.id === "number" && t.id > m ? t.id : m),
      0,
    );
    const created = {
      id: maxId + 1,
      userId: typeof body.userId === "number" ? body.userId : 1,
      title: typeof body.title === "string" ? body.title : "",
      completed: !!body.completed,
    };

    const next = [created, ...todos];
    writeTodos(next);
    return res.status(201).json(created);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
