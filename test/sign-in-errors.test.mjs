import { test } from "node:test";
import assert from "node:assert/strict";

const { socialSignInError } = await import("../lib/sign-in-errors.js");

test("no error code means no message", () => {
  assert.equal(socialSignInError(null, ["google"]), "");
});

test("an existing account names email and password when Google is the only provider", () => {
  assert.equal(
    socialSignInError("account_not_linked", ["google"]),
    "You already have an account with this email. It signs in with email and password, so use those below."
  );
});

test("the code is matched whatever its case", () => {
  assert.match(socialSignInError("ACCOUNT_NOT_LINKED", ["google"]), /email and password/);
});

test("with several providers it does not guess which one the account uses", () => {
  const message = socialSignInError("account_not_linked", ["google", "github"]);
  assert.match(message, /already have an account/);
  assert.match(message, /the way you signed in before/);
  assert.doesNotMatch(message, /email and password, so/);
});

test("the old promise of a confirmation link is gone", () => {
  assert.doesNotMatch(socialSignInError("account_not_linked", ["google"]), /link we sent/);
});

test("other known codes keep their messages", () => {
  assert.equal(socialSignInError("access_denied", ["google"]), "Sign-in was cancelled.");
});

test("an unknown code gets the general message", () => {
  assert.equal(socialSignInError("boom", ["google"]), "Could not sign you in with that account. Try again.");
});
