import { test } from "node:test";
import assert from "node:assert/strict";

const { splitEndpoint } = await import("../lib/docs-format.js");

test("splitEndpoint separates one method from its path", () => {
  assert.deepEqual(splitEndpoint("POST /v1/aliases"), { methods: ["POST"], rest: "/v1/aliases" });
});

test("splitEndpoint handles a comma-separated list of methods", () => {
  assert.deepEqual(splitEndpoint("GET, DELETE /v1/filters"), { methods: ["GET", "DELETE"], rest: "/v1/filters" });
});

test("splitEndpoint keeps whatever follows the method, even when it is not a path", () => {
  assert.deepEqual(splitEndpoint('PATCH … {"active": false}'), { methods: ["PATCH"], rest: '… {"active": false}' });
});

test("splitEndpoint returns no methods for text that does not start with one", () => {
  assert.deepEqual(splitEndpoint("ghstmail send"), { methods: [], rest: "ghstmail send" });
});
