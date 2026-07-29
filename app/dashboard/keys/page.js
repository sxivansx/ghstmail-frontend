"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
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

export default function KeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState(DEFAULT_SCOPES);
  // The plaintext key is held in memory only, and only until the user leaves.
  const [freshKey, setFreshKey] = useState(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    try {
      const data = await api.getKeys();
      setKeys(data.keys || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    try {
      const data = await api.createKey({ name: name.trim(), scopes });
      setFreshKey(data.key);
      setName("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(key) {
    if (!confirm(`Revoke "${key.name}"? Anything using it stops working immediately.`)) return;
    try {
      await api.revokeKey(key.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function copyFresh() {
    navigator.clipboard.writeText(freshKey.secret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function toggleScope(id) {
    setScopes((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id]
    );
  }

  const live = keys.filter((k) => !k.revoked_at);
  const revoked = keys.filter((k) => k.revoked_at);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl mb-1">API keys</h1>
        <p className="text-sm text-muted-foreground">
          For scripts, servers and the CLI. See the{" "}
          <Link href="/docs" className="text-primary hover:underline">
            API reference
          </Link>{" "}
          to get started.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Shown once, right after creation. */}
      {freshKey && (
        <Card className="mb-8 p-5 border-primary/40 bg-primary/5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="font-medium text-sm mb-1">
                Copy your key now, it will not be shown again
              </div>
              <p className="text-xs text-muted-foreground">
                We store only a hash of it. If you lose it, revoke it and make another.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFreshKey(null)}>
              Done
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-[13px] bg-background border border-border rounded-lg px-3 py-2 overflow-x-auto">
              {freshKey.secret}
            </code>
            <Button size="sm" onClick={copyFresh} className="gap-2 shrink-0">
              <CopyIcon className="w-4 h-4" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="mb-8 p-5">
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <Label htmlFor="key-name" className="mb-1.5 block text-sm">
              Create a key
            </Label>
            <Input
              id="key-name"
              placeholder="What will use it? e.g. signup script"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="mb-4">
            <div className="text-sm mb-2">Permissions</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {ALL_SCOPES.map((scope) => (
                <label
                  key={scope.id}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={scopes.includes(scope.id)}
                    onChange={() => toggleScope(scope.id)}
                    className="accent-primary w-4 h-4"
                  />
                  <span>{scope.label}</span>
                  <code className="text-[11px] font-mono text-muted-foreground/60">{scope.id}</code>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Grant only what the key needs. A read-only key is safe to put in a script you do
              not fully trust.{" "}
              {scopes.includes("messages:send") && (
                <span className="text-primary">
                  This key will be able to send mail as any of your aliases.
                </span>
              )}
            </p>
          </div>

          <Button type="submit" disabled={creating || !name.trim() || scopes.length === 0}>
            {creating ? "Creating..." : "Create key"}
          </Button>
        </form>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : live.length === 0 && revoked.length === 0 ? (
        <p className="text-sm text-muted-foreground">No keys yet.</p>
      ) : (
        <div className="space-y-2">
          {live.map((key) => (
            <Card key={key.id} className="p-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{key.name}</div>
                <code className="text-xs font-mono text-muted-foreground">{key.prefix}…</code>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {key.scopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="text-[10px] font-mono">
                    {scope}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground ml-auto text-right">
                <div>last used {relativeTime(key.last_used_at)}</div>
                <div className="text-muted-foreground/60">created {relativeTime(key.created_at)}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRevoke(key)}
                className="text-destructive hover:text-destructive"
              >
                Revoke
              </Button>
            </Card>
          ))}

          {revoked.length > 0 && (
            <details className="pt-4">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                {revoked.length} revoked {revoked.length === 1 ? "key" : "keys"}
              </summary>
              <div className="space-y-2 mt-3">
                {revoked.map((key) => (
                  <Card key={key.id} className="p-3 flex items-center gap-4 opacity-50">
                    <div className="text-sm">{key.name}</div>
                    <code className="text-xs font-mono text-muted-foreground">{key.prefix}…</code>
                    <div className="text-xs text-muted-foreground ml-auto">
                      revoked {relativeTime(key.revoked_at)}
                    </div>
                  </Card>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
