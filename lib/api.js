const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ghstmail_token");
}

export function setToken(token) {
  localStorage.setItem("ghstmail_token", token);
}

export function clearToken() {
  localStorage.removeItem("ghstmail_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  register: (email, password) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getAliases: () => request("/api/aliases"),
  createAlias: (body) =>
    request("/api/aliases", { method: "POST", body: JSON.stringify(body) }),
  updateAlias: (id, body) =>
    request(`/api/aliases/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteAlias: (id) =>
    request(`/api/aliases/${id}`, { method: "DELETE" }),
  getFilters: () => request("/api/filters"),
  createFilter: (body) =>
    request("/api/filters", { method: "POST", body: JSON.stringify(body) }),
  deleteFilter: (id) =>
    request(`/api/filters/${id}`, { method: "DELETE" }),
};
