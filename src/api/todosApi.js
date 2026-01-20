import { httpClient } from "./httpClient";

export async function getTodos() {
  const { data } = await httpClient.get("/todos");
  return data;
}

export async function createTodo(payload) {
  const { data } = await httpClient.post("/todos", payload);
  return data;
}

export async function updateTodo(id, payload) {
  const { data } = await httpClient.put(`/todos/${id}`, payload);
  return data;
}

export async function deleteTodo(id) {
  const { data } = await httpClient.delete(`/todos/${id}`);
  return data;
}
