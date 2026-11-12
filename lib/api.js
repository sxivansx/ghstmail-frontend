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

  // The /api routes send { error }, Better Auth's /api/auth routes send { message }.
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
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

  // Better Auth. These carry its session cookie (credentials: "include") and
  // never the dashboard token. Returns the provider's URL to send the browser to.
  socialSignIn: async (provider, nextPath) => {
    const origin = window.location.origin;
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    const data = await request("/api/auth/sign-in/social", {
      auth: false,
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        provider,
        callbackURL: `${origin}/auth/complete${next}`,
        // Better Auth adds ?error=<code> when sign-in fails.
        errorCallbackURL: `${origin}/login`,
      }),
    });
    return data.url;
  },
  // Trades the Better Auth session cookie for the token every /api route uses.
  exchangeSession: () =>
    request("/api/auth/dashboard-token", { auth: false, credentials: "include" }),
  requestPasswordReset: (email) =>
    request("/api/auth/request-password-reset", {
      auth: false,
      method: "POST",
      body: JSON.stringify({ email, redirectTo: `${window.location.origin}/reset-password` }),
    }),
  // Plans and Dodo Payments checkout. Dodo hosts the payment page; these only
  // start it, confirm it afterwards, and open Dodo's subscription portal.
  getBilling: () => request("/api/billing"),
  startCheckout: async (interval) => {
    const data = await request("/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ interval }),
    });
    return data.url;
  },
  syncBilling: () => request("/api/billing/sync", { method: "POST", body: "{}" }),
  openBillingPortal: async () => {
    const data = await request("/api/billing/portal", { method: "POST", body: "{}" });
    return data.url;
  },
  resetPassword: (token, newPassword) =>
    request("/api/auth/reset-password", {
      auth: false,
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};
