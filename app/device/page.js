"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Accepts whatever the user actually pastes: the bare code, lower case, no
// dash, or the entire verification URL copied out of the terminal. Everything
// that is not part of the code is discarded, then the dash is put back.
function normalizeCodeInput(raw) {
  let value = String(raw);
  const fromUrl = value.match(/[?&]code=([^&\s]+)/i);
  if (fromUrl) value = decodeURIComponent(fromUrl[1]);

  const bare = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return bare.length > 4 ? `${bare.slice(0, 4)}-${bare.slice(4)}` : bare;
}

const isComplete = (code) => code.replace(/[^A-Z0-9]/g, "").length === 8;

const SCOPE_LABELS = {
  "aliases:read": "Read your aliases",
  "aliases:write": "Create and delete aliases",
  "filters:read": "Read your filters",
  "filters:write": "Create and delete filters",
  "messages:send": "Send mail from your aliases",
};

// Sending is the one permission that is never pre-ticked, matching the API keys
// page and the column default in the database. Granting it should always be a
// deliberate click, wherever you are.
const NEVER_PRETICKED = new Set(["messages:send"]);

export default function DevicePage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [code, setCode] = useState("");
  const [request, setRequest] = useState(null);
  const [granted, setGranted] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | looking | found | approved | denied
  const [error, setError] = useState("");

  // The whole point of this page is that approval requires a real session, so a
  // signed-out visitor goes to login first, keeping the code in the URL.
  useEffect(() => {
    if (!localStorage.getItem("ghstmail_token")) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/login?next=${next}`);
      return;
    }
    setCheckedAuth(true);
    const fromUrl = new URLSearchParams(window.location.search).get("code");
    if (fromUrl) setCode(normalizeCodeInput(fromUrl));
  }, [router]);

  const lookup = useCallback(async (value) => {
    setStatus("looking");
    setError("");
    try {
      const data = await api.getDeviceRequest(value);
      setRequest(data);
      setGranted(data.scopes.filter((s) => !NEVER_PRETICKED.has(s)));
      setStatus("found");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }, []);

  // Auto-look-up when the CLI sent the user here with the code already attached.
  // When the CLI sent the user here with the code attached (or they pasted the
  // whole URL), skip straight to the approval screen. Nobody should have to
  // retype a code the browser already has.
  useEffect(() => {
    if (checkedAuth && isComplete(code) && status === "idle" && !request) {
      lookup(code);
    }
  }, [checkedAuth, code, status, request, lookup]);

  async function approve() {
    setError("");
    try {
      await api.approveDevice({ user_code: request.user_code, scopes: granted });
      setStatus("approved");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deny() {
    setError("");
    try {
      await api.denyDevice({ user_code: request.user_code });
      setStatus("denied");
    } catch (err) {
      setError(err.message);
    }
  }

  function toggle(scope) {
    setGranted((current) =>
      current.includes(scope) ? current.filter((s) => s !== scope) : [...current, scope]
    );
  }

  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-0 h-full w-px bg-border/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />

        <header className="px-4 pt-4">
          <div className="bg-muted/50 border border-border rounded-2xl px-6 h-14 flex items-center backdrop-blur-sm">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <GhostIcon className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                GhstMail
              </span>
            </Link>
          </div>
        </header>

        <main className="border-x border-border/50">
          <div className="max-w-lg mx-auto px-6 py-20">
            <h1 className="font-display font-bold text-2xl mb-2">Connect a device</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Enter the code shown by the GhstMail CLI.
            </p>

            {error && (
              <div className="mb-6 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {status === "approved" && (
              <Card className="p-6 border-primary/40 bg-primary/5">
                <div className="font-medium mb-1">Connected</div>
                <p className="text-sm text-muted-foreground">
                  The CLI has been given a key. You can close this tab and go back to your
                  terminal. Revoke it any time from{" "}
                  <Link href="/dashboard/keys" className="text-primary hover:underline">
                    API keys
                  </Link>
                  .
                </p>
              </Card>
            )}

            {status === "denied" && (
              <Card className="p-6">
                <div className="font-medium mb-1">Denied</div>
                <p className="text-sm text-muted-foreground">
                  Nothing was granted. If you did not start this, you can ignore it.
                </p>
              </Card>
            )}

            {status !== "approved" && status !== "denied" && (
              <>
                {status !== "found" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isComplete(code)) lookup(code);
                    }}
                  >
                    <Input
                      autoFocus
                      value={code}
                      onChange={(e) => setCode(normalizeCodeInput(e.target.value))}
                      onPaste={(e) => {
                        // Handle the paste ourselves so pasting the whole
                        // verification URL works, not just the bare code.
                        e.preventDefault();
                        setCode(normalizeCodeInput(e.clipboardData.getData("text")));
                      }}
                      placeholder="XXXX-XXXX"
                      // Lets the browser and iOS offer the code from the
                      // clipboard or a notification instead of making you type.
                      autoComplete="one-time-code"
                      inputMode="text"
                      autoCapitalize="characters"
                      spellCheck={false}
                      aria-label="Device code"
                      className="font-mono text-center text-lg tracking-[0.2em] h-14 uppercase"
                      maxLength={9}
                    />
                    <p className="text-xs text-muted-foreground/70 mt-2 text-center">
                      Paste the code or the whole URL. Normally the CLI opens this
                      page with the code already filled in.
                    </p>
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      disabled={status === "looking" || !isComplete(code)}
                    >
                      {status === "looking" ? "Checking..." : "Continue"}
                    </Button>
                  </form>
                ) : (
                  <Card className="p-6">
                    <div className="mb-5">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Requesting access
                      </div>
                      <div className="font-medium">{request.device_name}</div>
                      <code className="text-xs font-mono text-muted-foreground">
                        {request.client_id}
                      </code>
                    </div>

                    <div className="mb-5">
                      <div className="text-sm mb-2">It will be able to:</div>
                      <div className="space-y-2">
                        {request.scopes.map((scope) => (
                          <label
                            key={scope}
                            className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={granted.includes(scope)}
                              onChange={() => toggle(scope)}
                              className="accent-primary w-4 h-4"
                            />
                            <span>{SCOPE_LABELS[scope] || scope}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        Untick anything you would rather not grant.
                      </p>
                    </div>

                    <div className="border border-border rounded-lg px-3 py-2.5 text-xs text-muted-foreground mb-5">
                      Only approve this if you just ran{" "}
                      <code className="font-mono text-foreground">ghstmail login</code> yourself.
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={approve} disabled={granted.length === 0} className="flex-1">
                        Approve
                      </Button>
                      <Button variant="ghost" onClick={deny}>
                        Deny
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
