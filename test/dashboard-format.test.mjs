import { test } from "node:test";
import assert from "node:assert/strict";

const { filterAliases, expiryLabel } = await import("../lib/dashboard-format.js");

const aliases = [
  { id: 1, address: "github.k7f2q@ghstmail.space", label: "GitHub", is_active: true },
  { id: 2, address: "shop.m4x8d@ghstmail.space", label: null, is_active: false },
  { id: 3, address: "news.p2r9c@ghstmail.space", label: "Weekly letter", is_active: true },
];

test("filterAliases returns everything for an empty query and the 'all' status", () => {
  assert.equal(filterAliases(aliases, "", "all").length, 3);
});

test("filterAliases matches the address or the label, ignoring case and outer spaces", () => {
  assert.deepEqual(filterAliases(aliases, "  SHOP ", "all").map((a) => a.id), [2]);
  assert.deepEqual(filterAliases(aliases, "weekly", "all").map((a) => a.id), [3]);
});

test("filterAliases narrows by status", () => {
  assert.deepEqual(filterAliases(aliases, "", "active").map((a) => a.id), [1, 3]);
  assert.deepEqual(filterAliases(aliases, "", "paused").map((a) => a.id), [2]);
  assert.deepEqual(filterAliases(aliases, "github", "paused"), []);
});

test("expiryLabel describes how long an alias has left", () => {
  const now = Date.parse("2026-11-13T12:00:00Z");
  assert.equal(expiryLabel(null, now), "Never");
  assert.equal(expiryLabel("2026-11-13T11:00:00Z", now), "Expired");
  assert.equal(expiryLabel("2026-11-13T12:45:00Z", now), "45m left");
  assert.equal(expiryLabel("2026-11-13T17:30:00Z", now), "5h 30m left");
  assert.equal(expiryLabel("2026-11-16T15:00:00Z", now), "3d 3h left");
});

const { deliverySummary, forwardRate } = await import("../lib/dashboard-format.js");

test("deliverySummary adds up mail across aliases and works out what was not forwarded", () => {
  const summary = deliverySummary([
    { emails_received: 42, emails_forwarded: 42 },
    { emails_received: 131, emails_forwarded: 64 },
    { emails_received: 27, emails_forwarded: 26 },
  ]);
  assert.deepEqual(summary, { received: 200, forwarded: 132, stopped: 68, rate: 0.66 });
});

test("deliverySummary has no rate when nothing has arrived yet", () => {
  assert.deepEqual(deliverySummary([{ emails_received: 0, emails_forwarded: 0 }, {}]), { received: 0, forwarded: 0, stopped: 0, rate: null });
});

test("forwardRate is the share of an alias's mail that was forwarded", () => {
  assert.equal(forwardRate({ emails_received: 18, emails_forwarded: 9 }), 0.5);
  assert.equal(forwardRate({ emails_received: 0, emails_forwarded: 0 }), null);
  assert.equal(forwardRate({ emails_received: 3, emails_forwarded: 5 }), 1);
});

const { scrambleFrame } = await import("../lib/dashboard-format.js");

test("scrambleFrame keeps the revealed part and hides the rest behind glyphs", () => {
  const frame = scrambleFrame("github.k7f2q@ghstmail.space", 6, () => "#");
  assert.equal(frame, "github.#####@########.#####");
});

test("scrambleFrame leaves the dots and the @ in place so the shape reads as an email", () => {
  assert.equal(scrambleFrame("a.b@c.d", 0, () => "*"), "*.*@*.*");
});

test("scrambleFrame returns the address itself once everything is revealed", () => {
  assert.equal(scrambleFrame("a.b@c.d", 7, () => "*"), "a.b@c.d");
  assert.equal(scrambleFrame("a.b@c.d", 99, () => "*"), "a.b@c.d");
});

const { paginate } = await import("../lib/dashboard-format.js");

test("paginate slices a list into pages and reports the range shown", () => {
  const items = Array.from({ length: 60 }, (_, i) => i + 1);
  const second = paginate(items, 2, 25);
  assert.deepEqual(second.items, items.slice(25, 50));
  assert.deepEqual({ page: second.page, pages: second.pages, from: second.from, to: second.to }, { page: 2, pages: 3, from: 26, to: 50 });
  assert.deepEqual(paginate(items, 3, 25).items, items.slice(50));
});

test("paginate clamps a page that no longer exists, for example after deleting rows", () => {
  const result = paginate([1, 2, 3], 5, 25);
  assert.deepEqual({ page: result.page, pages: result.pages, from: result.from, to: result.to }, { page: 1, pages: 1, from: 1, to: 3 });
  assert.equal(paginate([1, 2, 3], 0, 25).page, 1);
});

test("paginate handles an empty list", () => {
  assert.deepEqual(paginate([], 1, 25), { items: [], page: 1, pages: 1, from: 0, to: 0 });
});

const { describeScopes } = await import("../lib/dashboard-format.js");

test("describeScopes turns scope ids into plain descriptions, one per area", () => {
  assert.deepEqual(describeScopes(["aliases:read", "aliases:write", "filters:read"]), ["Aliases: read and write", "Filters: read only"]);
  assert.deepEqual(describeScopes(["filters:write"]), ["Filters: write only"]);
});

test("describeScopes calls out a key that can send mail, and keeps scopes it does not know", () => {
  assert.deepEqual(describeScopes(["aliases:read", "messages:send", "billing:read"]), ["Aliases: read only", "Sends mail", "billing:read"]);
  assert.deepEqual(describeScopes([]), []);
});

const { aliasQuery, resolveAliasPage } = await import("../lib/dashboard-format.js");

test("aliasQuery asks for one page and only sends the filters that are set", () => {
  assert.equal(aliasQuery({ page: 1, size: 25, query: "", status: "all" }), "?limit=25&offset=0");
  assert.equal(aliasQuery({ page: 3, size: 25, query: " shop & co ", status: "paused" }), "?limit=25&offset=50&q=shop+%26+co&status=paused");
});

const request = { page: 2, size: 2, query: "", status: "all" };

test("resolveAliasPage reads a paged response from the server as it is", () => {
  const view = resolveAliasPage(
    { aliases: [{ id: "c" }, { id: "d" }], total: 5, limit: 2, offset: 2, summary: { total: 9, active: 6, received: 200, forwarded: 150 } },
    request
  );
  assert.equal(view.paged, true);
  assert.deepEqual(view.rows.map((a) => a.id), ["c", "d"]);
  assert.deepEqual({ matching: view.matching, page: view.page, pages: view.pages, from: view.from, to: view.to }, { matching: 5, page: 2, pages: 3, from: 3, to: 4 });
  assert.deepEqual(view.summary, { count: 9, active: 6, received: 200, forwarded: 150, stopped: 50, rate: 0.75 });
});

test("resolveAliasPage pages and totals a full list itself when the server sent everything", () => {
  const all = [
    { id: "a", address: "a@x", is_active: true, emails_received: 10, emails_forwarded: 10 },
    { id: "b", address: "b@x", is_active: false, emails_received: 10, emails_forwarded: 0 },
    { id: "c", address: "c@x", is_active: true, emails_received: 0, emails_forwarded: 0 },
  ];
  const view = resolveAliasPage({ aliases: all }, request);
  assert.equal(view.paged, false);
  assert.deepEqual(view.rows.map((a) => a.id), ["c"]);
  assert.deepEqual({ matching: view.matching, page: view.page, pages: view.pages, from: view.from, to: view.to }, { matching: 3, page: 2, pages: 2, from: 3, to: 3 });
  assert.deepEqual(view.summary, { count: 3, active: 2, received: 20, forwarded: 10, stopped: 10, rate: 0.5 });
  assert.deepEqual(resolveAliasPage({ aliases: all }, { ...request, page: 1, status: "paused" }).rows.map((a) => a.id), ["b"]);
});

test("resolveAliasPage reports the last real page when the one asked for is now empty", () => {
  const view = resolveAliasPage({ aliases: [], total: 4, limit: 2, offset: 4, summary: { total: 4, active: 4, received: 0, forwarded: 0 } }, { ...request, page: 3 });
  assert.deepEqual({ page: view.page, pages: view.pages, from: view.from, to: view.to }, { page: 2, pages: 2, from: 0, to: 0 });
  assert.equal(view.summary.rate, null);
});
