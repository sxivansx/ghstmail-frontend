import { test } from "node:test";
import assert from "node:assert/strict";

const { releases, AREAS, formatReleaseDate } = await import("../lib/changelog.js");

test("releases are listed newest first, each with a real date", () => {
  assert.ok(releases.length > 0);
  for (const release of releases) {
    assert.match(release.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(release.date)), release.date);
  }
  const dates = releases.map((release) => release.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.equal(new Set(dates).size, dates.length, "one entry per date");
});

test("every release has a title, a summary and at least one change in a known area", () => {
  for (const release of releases) {
    assert.ok(release.title && release.summary, release.date);
    assert.ok(release.changes.length > 0, release.date);
    for (const group of release.changes) {
      assert.ok(AREAS.includes(group.area), `${release.date}: ${group.area}`);
      assert.ok(group.items.length > 0, `${release.date}: ${group.area}`);
    }
  }
});

test("the copy keeps to the house style: no em dashes", () => {
  assert.doesNotMatch(JSON.stringify(releases), /—/);
});

test("formatReleaseDate writes the date out the same way everywhere", () => {
  assert.equal(formatReleaseDate("2026-11-13"), "13 November 2026");
  assert.equal(formatReleaseDate("2026-03-08"), "8 March 2026");
});
