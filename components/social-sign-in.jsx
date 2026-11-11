"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

// Which providers the backend has credentials for, e.g. "google,github".
// Unset means none, so a provider never shows a button that cannot work.
const ENABLED = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 010-4.22V7.05H2.18a11 11 0 000 9.9l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0012 1 11 11 0 002.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 00-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0012 .5z" />
    </svg>
  );
}

const PROVIDERS = {
  google: { label: "Continue with Google", Icon: GoogleIcon },
  github: { label: "Continue with GitHub", Icon: GitHubIcon },
};

export function SocialSignIn({ nextPath }) {
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const providers = ENABLED.filter((id) => PROVIDERS[id]);

  if (providers.length === 0) return null;

  async function start(provider) {
    setError("");
    setPending(provider);
    try {
      window.location.assign(await api.socialSignIn(provider, nextPath));
    } catch (err) {
      setError(err.message);
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div role="alert" className="px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {providers.map((id) => {
        const { label, Icon } = PROVIDERS[id];
        return (
          <Button
            key={id}
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={pending !== null}
            onClick={() => start(id)}
          >
            {pending === id ? (
              <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {label}
          </Button>
        );
      })}
      <p className="text-center text-[11px] text-muted-foreground">
        We only receive your email address.
      </p>
      <div className="flex items-center gap-3 pt-1" aria-hidden="true">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

// Better Auth sends people back to /login?error=<code> when a provider
// sign-in fails. These are the codes a person can do something about.
const SIGN_IN_ERRORS = {
  account_not_linked:
    "An account with this email already exists. Sign in with your password, confirm your email from the link we sent, then try again.",
  access_denied: "Sign-in was cancelled.",
  email_not_found: "That account did not share an email address with us.",
};

export function socialSignInError(code) {
  if (!code) return "";
  return SIGN_IN_ERRORS[code.toLowerCase()] || "Could not sign you in with that account. Try again.";
}
