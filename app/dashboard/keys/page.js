"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import { describeScopes } from "../../../lib/dashboard-format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";

const KEY_COLUMNS = "md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_104px_104px_76px]";
const KBD = "hidden lg:inline-flex h-5 min-w-5 items-center justify-center rounded bg-primary-foreground/15 px-1 font-mono text-[10px]";

// messages:send is off by default here, matching the server: a key should not
// gain the ability to send mail unless someone deliberately ticks the box.
const ALL_SCOPES = [
  { id: "aliases:read", label: "Read aliases", default: true },
  { id: "aliases:write", label: "Create and delete aliases", default: true },
  { id: "filters:read", label: "Read filters", default: true },
  { id: "filters:write", label: "Create and delete filters", default: true },
  { id: "messages:send", label: "Send mail from your aliases", default: false },
];

const DEFAULT_SCOPES = ALL_SCOPES.filter((s) => s.default).map((s) => s.id);
const READ_ONLY_SCOPES = ["aliases:read", "filters:read"];

const CURL_SAMPLE = 'curl https://api.ghstmail.space/v1/aliases \\\n  -H "Authorization: Bearer $GHSTMAIL_KEY"';
const CLI_SAMPLE = "npm install -g ghstmail\nghstmail login";

function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function KeyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M10.7 12.3L21 2m-4 0h4v4" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function relativeTime(iso) {
  if (!iso) return "never";
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(delta / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// A copy button that confirms itself for a moment.
function CopyButton({ text, label = "Copy", className = "" }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button onClick={copy} type="button" className={`inline-flex items-center gap-1.5 text-sm transition-colors ${className}`}>
      {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function Snippet({ title, note, code }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 h-11 border-b border-border">
        <span className="text-sm font-medium">{title}</span>
        <CopyButton text={code} className="text-muted-foreground hover:text-foreground" />
      </div>
      <pre className="px-5 py-4 font-mono text-[12.5px] leading-[1.75] text-foreground/85 overflow-x-auto">{code}</pre>
      <p className="px-5 pb-4 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

/* --- Create dialog: the form, then the one-time reveal of the key --- */

function CreateKeyDialog({ open, onClose, onCreated }) {
  const [shown, setShown] = useState(false);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState(DEFAULT_SCOPES);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  // The plaintext key is held in memory only, and only while this dialog is open.
  const [secret, setSecret] = useState(null);

  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    setName("");
    setScopes(DEFAULT_SCOPES);
    setError("");
    setSecret(null);
    const frame = requestAnimationFrame(() => setShown(true));
    document.getElementById("key-name")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event) {
      if (event.key === "Escape" && !creating) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, creating, onClose]);

  if (!open) return null;

  const sameSet = (list) => list.length === scopes.length && list.every((id) => scopes.includes(id));
  const toggle = (id) => setScopes((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));

  async function submit(event) {
    event.preventDefault();
    if (!name.trim() || scopes.length === 0) return;
    setCreating(true);
    setError("");
    try {
      const data = await api.createKey({ name: name.trim(), scopes });
      setSecret(data.key.secret);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
        onClick={creating ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-key-title"
        className={`relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-200 ease-out ${
          shown ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.97] translate-y-1"
        }`}
      >
        {secret ? (
          <div>
            <div className="grid place-items-center w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckIcon className="w-5 h-5" />
            </div>
            <h2 id="create-key-title" className="mt-4 font-display font-semibold text-lg tracking-tight">Your key is ready</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Copy it now. This is the only time it is shown: we store a hash, not the key, so a lost key is replaced rather than recovered.
            </p>
            <code className="mt-5 block rounded-xl border border-border bg-background px-4 py-3 font-mono text-[13px] leading-relaxed break-all">
              {secret}
            </code>
            <div className="mt-5 flex justify-end gap-2">
              <CopyButton text={secret} label="Copy key" className="h-9 px-4 rounded-[0.7rem] border border-border bg-card font-medium hover:bg-muted" />
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 id="create-key-title" className="font-display font-semibold text-lg tracking-tight">New API key</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Give it a name you will recognise later, and only the access it needs.</p>

            {error && (
              <div role="alert" className="mt-4 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Label htmlFor="key-name" className="mt-5 mb-1.5 block text-sm">Name</Label>
            <Input
              id="key-name"
              placeholder="e.g. signup script"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
            />

            <div className="mt-5 mb-2 flex items-center justify-between gap-3">
              <span className="text-sm">Access</span>
              <div className="inline-flex p-0.5 rounded-lg border border-border bg-background">
                {[["Read only", READ_ONLY_SCOPES], ["Read and write", DEFAULT_SCOPES]].map(([label, preset]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setScopes(preset)}
                    aria-pressed={sameSet(preset)}
                    className={`h-7 px-2.5 rounded-md text-xs transition-colors ${
                      sameSet(preset) ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
              {ALL_SCOPES.map((scope) => {
                const on = scopes.includes(scope.id);
                return (
                  <label key={scope.id} className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer select-none hover:bg-muted/50 transition-colors">
                    <input type="checkbox" checked={on} onChange={() => toggle(scope.id)} className="peer sr-only" />
                    <span
                      aria-hidden="true"
                      className={`grid place-items-center shrink-0 w-[18px] h-[18px] rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                        on ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                      }`}
                    >
                      {on && <CheckIcon className="w-3 h-3" />}
                    </span>
                    <span className="flex-1 text-sm">{scope.label}</span>
                    <code className="font-mono text-[11px] text-muted-foreground">{scope.id}</code>
                  </label>
                );
              })}
            </div>
            {scopes.includes("messages:send") && (
              <p className="mt-2.5 text-xs text-primary">This key will be able to send mail as any of your aliases.</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={creating}
                className="h-9 px-4 rounded-[0.7rem] border border-border bg-card text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <Button type="submit" disabled={creating || !name.trim() || scopes.length === 0}>
                {creating ? "Creating..." : "Create key"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* --- Page --- */

export default function KeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revoking, setRevoking] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getKeys();
      setKeys(data.keys || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // "n" opens the new key dialog, unless you are typing somewhere.
  useEffect(() => {
    function onKey(event) {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      if (typing || event.metaKey || event.ctrlKey || event.altKey || event.key !== "n") return;
      event.preventDefault();
      setShowCreate(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function confirmRevoke() {
    try {
      await api.revokeKey(revoking.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
    setRevoking(null);
  }
  const cancelRevoke = useCallback(() => setRevoking(null), []);
  const closeCreate = useCallback(() => setShowCreate(false), []);

  const live = keys.filter((k) => !k.revoked_at);
  const revoked = keys.filter((k) => k.revoked_at);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-[1.75rem] leading-tight tracking-tight">API keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            For scripts, servers and the CLI. See the{" "}
            <Link href="/docs" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-primary">
              API reference
            </Link>{" "}
            to get started.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <PlusIcon className="w-4 h-4" />
          New key
          <kbd className={KBD}>N</kbd>
        </Button>
      </div>

      {error && (
        <div role="alert" className="mb-6 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : live.length === 0 ? (
        <div className="text-center px-6 py-16 border border-border rounded-xl bg-card">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
            <KeyIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="font-display font-semibold text-lg">No keys yet</h2>
          <p className="text-muted-foreground text-sm mt-1.5 mb-6 max-w-sm mx-auto">
            A key lets a script or the CLI manage your aliases without your password. It is shown once, right after you make it.
          </p>
          <Button onClick={() => setShowCreate(true)}>
            <PlusIcon className="w-4 h-4" />
            Create your first key
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className={`hidden md:grid ${KEY_COLUMNS} items-center gap-x-4 px-5 h-10 border-b border-border text-xs text-muted-foreground`}>
            <span>Key</span>
            <span>Access</span>
            <span>Last used</span>
            <span>Created</span>
            <span />
          </div>
          <ul>
            {live.map((key) => (
              <li key={key.id} className={`group grid ${KEY_COLUMNS} items-center gap-x-4 gap-y-3 px-5 py-3.5 border-t border-border first:border-t-0 hover:bg-muted/40 transition-colors`}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <span aria-hidden="true" className="shrink-0 grid place-items-center w-9 h-9 rounded-lg border border-border bg-muted text-muted-foreground">
                    <KeyIcon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{key.name}</div>
                    <code className="font-mono text-[12.5px] text-muted-foreground">{key.prefix}…</code>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5" title={key.scopes.join(", ")}>
                  {describeScopes(key.scopes).map((part) => (
                    <span
                      key={part}
                      className={`inline-flex items-center h-6 px-2 rounded-md border text-xs ${
                        part === "Sends mail" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {part}
                    </span>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="md:hidden text-muted-foreground">Last used </span>
                  {relativeTime(key.last_used_at)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="md:hidden">Created </span>
                  {relativeTime(key.created_at)}
                </div>
                <button
                  onClick={() => setRevoking(key)}
                  className="justify-self-start md:justify-self-end h-8 px-3 -mx-3 md:mx-0 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {revoked.length > 0 && (
        <details className="mt-4 group/revoked">
          <summary className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none [&::-webkit-details-marker]:hidden">
            <svg className="w-3.5 h-3.5 transition-transform group-open/revoked:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
            {revoked.length} revoked {revoked.length === 1 ? "key" : "keys"}
          </summary>
          <ul className="mt-3 rounded-xl border border-border overflow-hidden">
            {revoked.map((key) => (
              <li key={key.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 border-t border-border first:border-t-0 text-sm text-muted-foreground">
                <span className="line-through decoration-border">{key.name}</span>
                <code className="text-xs font-mono">{key.prefix}…</code>
                <span className="ml-auto text-xs">revoked {relativeTime(key.revoked_at)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Snippet title="Call the API" code={CURL_SAMPLE} note="Send the key as a bearer token. Keep it on a server: the API does not accept calls from a browser." />
        <Snippet title="Or use the CLI" code={CLI_SAMPLE} note="The CLI signs in through your browser and stores its own key, so you never paste one." />
      </div>

      <CreateKeyDialog open={showCreate} onClose={closeCreate} onCreated={load} />

      <ConfirmDialog
        open={Boolean(revoking)}
        title="Revoke this key?"
        confirmLabel="Revoke key"
        onConfirm={confirmRevoke}
        onCancel={cancelRevoke}
      >
        <span className="block text-foreground">{revoking?.name}</span>
        <span className="block mt-2">Anything using it stops working immediately. This cannot be undone.</span>
      </ConfirmDialog>
    </div>
  );
}
