import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// lib/api.js reads these browser globals at call time.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
let redirectedTo = null;
globalThis.window = {
  location: {
    origin: "https://www.ghstmail.test",
    pathname: "/dashboard/filters",
    search: "",
    replace: (url) => {
      redirectedTo = url;
    },
  },
};

const { api, setToken } = await import("../lib/api.js");

let lastRequest = null;
const respond = (status, body, { json = true } = {}) => {
  globalThis.fetch = async (url, options) => {
    lastRequest = { url, ...options, body: options?.body ? JSON.parse(options.body) : undefined };
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => {
        if (!json) throw new SyntaxError("Unexpected token < in JSON");
        return body;
      },
    };
  };
};

beforeEach(() => {
  store.clear();
  redirectedTo = null;
});

test("returns the body of a successful request", async () => {
  setToken("t");
  respond(200, { aliases: [{ id: "a1" }] });
  assert.deepEqual(await api.getAliases(), { aliases: [{ id: "a1" }] });
});

test("surfaces the server's error message", async () => {
  setToken("t");
  respond(429, { error: "Too many attempts. Try again in a few minutes." });
  await assert.rejects(api.getAliases(), /Too many attempts/);
});

test("an expired session signs the user out and sends them to login", async () => {
  setToken("expired");
  respond(401, { error: "Invalid token" });
  await assert.rejects(api.getAliases(), /session has expired/i);
  assert.equal(localStorage.getItem("ghstmail_token"), null);
  assert.equal(redirectedTo, "/login?next=%2Fdashboard%2Ffilters");
});

test("a wrong password on the login form does not redirect", async () => {
  respond(401, { error: "Invalid credentials" });
  await assert.rejects(api.login("a@example.com", "wrong password"), /Invalid credentials/);
  assert.equal(redirectedTo, null);
});

test("a response that is not JSON gives a readable message", async () => {
  setToken("t");
  respond(502, null, { json: false });
  await assert.rejects(api.getAliases(), /could not reach ghstmail/i);
});

test("a network failure gives a readable message", async () => {
  setToken("t");
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(api.getAliases(), /could not reach ghstmail/i);
});

test("an error in Better Auth's shape shows its message", async () => {
  respond(400, { code: "PASSWORD_TOO_SHORT", message: "Password too short" });
  await assert.rejects(api.resetPassword("tok", "short"), /Password too short/);
});

test("social sign-in asks for a provider URL and comes back to /auth/complete", async () => {
  respond(200, { url: "https://accounts.google.com/o/oauth2/auth?x=1", redirect: true });
  const url = await api.socialSignIn("google", "/dashboard/keys");
  assert.equal(url, "https://accounts.google.com/o/oauth2/auth?x=1");
  assert.match(lastRequest.url, /\/api\/auth\/sign-in\/social$/);
  assert.equal(lastRequest.method, "POST");
  assert.equal(lastRequest.credentials, "include");
  assert.equal(lastRequest.body.provider, "google");
  assert.equal(
    lastRequest.body.callbackURL,
    "https://www.ghstmail.test/auth/complete?next=%2Fdashboard%2Fkeys"
  );
  assert.equal(lastRequest.body.errorCallbackURL, "https://www.ghstmail.test/login");
  assert.equal(lastRequest.headers.Authorization, undefined);
});

test("exchanging the session sends the cookie and returns the dashboard token", async () => {
  respond(200, { token: "jwt", user: { id: "u1", email: "a@example.com" } });
  const data = await api.exchangeSession();
  assert.equal(data.token, "jwt");
  assert.match(lastRequest.url, /\/api\/auth\/dashboard-token$/);
  assert.equal(lastRequest.credentials, "include");
});

test("a missing session on exchange is an error, not a redirect", async () => {
  respond(401, { error: "Not signed in" });
  await assert.rejects(api.exchangeSession(), /Not signed in/);
  assert.equal(redirectedTo, null);
});

test("a reset request points the emailed link at our reset page", async () => {
  respond(200, { status: true });
  await api.requestPasswordReset("a@example.com");
  assert.match(lastRequest.url, /\/api\/auth\/request-password-reset$/);
  assert.deepEqual(lastRequest.body, {
    email: "a@example.com",
    redirectTo: "https://www.ghstmail.test/reset-password",
  });
});

test("resetting sends the token and the new password", async () => {
  respond(200, { status: true });
  await api.resetPassword("tok123", "brand new password");
  assert.match(lastRequest.url, /\/api\/auth\/reset-password$/);
  assert.deepEqual(lastRequest.body, { token: "tok123", newPassword: "brand new password" });
});
