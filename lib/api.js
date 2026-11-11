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

const UNREACHABLE = "Could not reach GhstMail. Check your connection and try again.";

// `auth: false` is for the sign-in and sign-up forms: no token is sent, and a
// 401 there means wrong credentials, not an expired session.
async function request(path, { auth = true, ...options } = {}) {
  const token = auth ? getToken() : null;

  let res;
  let data;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    // A gateway error page is HTML, so parsing it throws too.
    data = await res.json();
  } catch {
    throw new Error(UNREACHABLE);
  }

  if (res.status === 401 && token) {
    // The token lasts 7 days. Without this, an expired one made every list
    // load fail quietly and the dashboard looked empty.
    clearToken();
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(`/login?next=${next}`);
    throw new Error("Your session has expired. Sign in again.");
  }

  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  register: (email, password) =>
    request("/api/auth/register", {
      auth: false,
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request("/api/auth/login", {
      auth: false,
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

  // API keys. The plaintext key comes back only from createKey, and only once.
  getKeys: () => request("/api/keys"),
  createKey: (body) =>
    request("/api/keys", { method: "POST", body: JSON.stringify(body) }),
  revokeKey: (id) => request(`/api/keys/${id}`, { method: "DELETE" }),

  // Device authorization, used by the CLI. The dashboard is the approval step.
  getDeviceRequest: (userCode) =>
    request(`/api/device/${encodeURIComponent(userCode)}`),
  approveDevice: (body) =>
    request("/api/device/approve", { method: "POST", body: JSON.stringify(body) }),
  denyDevice: (body) =>
    request("/api/device/deny", { method: "POST", body: JSON.stringify(body) }),
};
