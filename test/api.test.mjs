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
    pathname: "/dashboard/filters",
    search: "",
    replace: (url) => {
      redirectedTo = url;
    },
  },
};

const { api, setToken } = await import("../lib/api.js");

const respond = (status, body, { json = true } = {}) => {
  globalThis.fetch = async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (!json) throw new SyntaxError("Unexpected token < in JSON");
      return body;
    },
  });
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
