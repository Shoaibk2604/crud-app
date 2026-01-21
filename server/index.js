import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/todos", (_req, res) => {
  res.json(readTodos());
});

app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ message: "Invalid id" });

  const todos = readTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ message: "Not found" });
  return res.json(todo);
});

app.post("/todos", (req, res) => {
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
});

app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ message: "Invalid id" });

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
  return res.json(updated);
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ message: "Invalid id" });

  const todos = readTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  const next = todos.filter((t) => t.id !== id);
  writeTodos(next);
  return res.json({ id });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
