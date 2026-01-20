import fs from "fs";
import path from "path";

function getDbPath() {
  return path.join(process.cwd(), "data", "todos.json");
}

function ensureDbFile() {
  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]", "utf8");
}

function readTodos() {
  ensureDbFile();
  const raw = fs.readFileSync(getDbPath(), "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

function writeTodos(todos) {
  ensureDbFile();
  fs.writeFileSync(getDbPath(), JSON.stringify(todos, null, 2), "utf8");
}

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
