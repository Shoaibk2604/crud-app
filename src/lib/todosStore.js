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

export function readTodos() {
  ensureDbFile();
  const raw = fs.readFileSync(getDbPath(), "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

export function writeTodos(todos) {
  ensureDbFile();
  fs.writeFileSync(getDbPath(), JSON.stringify(todos, null, 2), "utf8");
}
