import { test } from "node:test";
import assert from "node:assert/strict";

const { slugLabel, aliasAddress, randomTail, formatTimeLeft } = await import("../lib/landing-demo.js");

test("slugLabel lowercases and joins words with a hyphen", () => {
  assert.equal(slugLabel("  Night Owl "), "night-owl");
  assert.equal(slugLabel("Free trial!!"), "free-trial");
});

test("slugLabel falls back to the default label when nothing usable is typed", () => {
  assert.equal(slugLabel(""), "netflix");
  assert.equal(slugLabel("@@@"), "netflix");
});

test("aliasAddress matches the label.tail@ghstmail.space shape", () => {
  assert.equal(aliasAddress("github", "k7f2q"), "github.k7f2q@ghstmail.space");
});

test("randomTail returns the requested number of lowercase alphanumerics", () => {
  assert.match(randomTail(5), /^[a-z0-9]{5}$/);
});

test("formatTimeLeft pads minutes and seconds", () => {
  assert.equal(formatTimeLeft(24 * 3600e3), "24h 00m 00s left");
  assert.equal(formatTimeLeft(3725e3), "1h 02m 05s left");
  assert.equal(formatTimeLeft(-5), "0h 00m 00s left");
});
