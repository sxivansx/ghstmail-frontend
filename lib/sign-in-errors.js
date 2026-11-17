// Which providers the backend has credentials for, e.g. "google,github".
// Unset means none, so a provider never shows a button that cannot work.
export const ENABLED_PROVIDERS = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// Better Auth sends people back to /login?error=<code> when a provider
// sign-in fails. These are the codes a person can do something about.
const SIGN_IN_ERRORS = {
  access_denied: "Sign-in was cancelled.",
  email_not_found: "That account did not share an email address with us.",
};

// The backend does not say how the existing account signs in. With one
// provider on offer it can only be email and password; with more, it could be
// another provider, so the message does not guess.
function existingAccountMessage(providers) {
  if (providers.length <= 1) {
    return "You already have an account with this email. It signs in with email and password, so use those below.";
  }
  return "You already have an account with this email. Sign in the way you signed in before.";
}

export function socialSignInError(code, providers = ENABLED_PROVIDERS) {
  if (!code) return "";
  const key = code.toLowerCase();
  if (key === "account_not_linked") return existingAccountMessage(providers);
  return SIGN_IN_ERRORS[key] || "Could not sign you in with that account. Try again.";
}
