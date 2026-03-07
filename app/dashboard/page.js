"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* --- Icons --- */

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function InboxIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* --- Expiration bar --- */

function ExpirationBar({ expiresAt, createdAt }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const expires = new Date(expiresAt).getTime();
  const created = createdAt ? new Date(createdAt).getTime() : expires - 86400000;
  const total = expires - created;
  const remaining = Math.max(0, expires - now);
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const expired = remaining <= 0;

  const hoursLeft = Math.floor(remaining / 3600000);
  const minsLeft = Math.floor((remaining % 3600000) / 60000);

  let color = "bg-primary";
  if (pct < 15) color = "bg-destructive";
  else if (pct < 40) color = "bg-amber-500";

  const label = expired
    ? "Expired"
    : hoursLeft > 0
    ? `${hoursLeft}h ${minsLeft}m left`
    : `${minsLeft}m left`;

  return (
    <div className="px-4 pb-3">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
        <span>{label}</span>
        {!expired && <span>{Math.round(pct)}%</span>}
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* --- Create modal --- */

function CreateModal({ open, onClose, onCreated }) {
  const [label, setLabel] = useState("");
  const [expiresHours, setExpiresHours] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createAlias({
        label: label || undefined,
        expires_in_hours: expiresHours ? Number(expiresHours) : undefined,
      });
      setLabel("");
      setExpiresHours("");
      onCreated();
      onClose();
    } catch {
    } finally {
      setCreating(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card border border-border p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg">New Alias</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Label (optional)</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Netflix, Newsletter, Shopping"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Auto-expire after (hours)</Label>
            <Input
              type="number"
              value={expiresHours}
              onChange={(e) => setExpiresHours(e.target.value)}
              placeholder="Leave empty for never"
              min="1"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={creating} className="flex-1 glow-primary">
              {creating ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating...
                </span>
              ) : "Create Alias"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- Alias card --- */

function AliasCard({ alias, copied, onCopy, onToggle, onDelete }) {
  const a = alias;

  return (
    <div
      className={`group relative rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-200 flex flex-col ${
        !a.is_active ? "opacity-45" : ""
      }`}
    >
      {/* Top section: toggle + actions */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch
                  checked={a.is_active}
                  onCheckedChange={() => onToggle(a)}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {a.is_active ? "Deactivate" : "Activate"}
            </TooltipContent>
          </Tooltip>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {a.is_active ? "Active" : "Paused"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(a.id)}
          className="text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Address + label */}
      <div className="px-4 pt-3 pb-2 flex-1">
        {a.label && (
          <Badge variant="secondary" className="mb-2 text-[11px]">
            {a.label}
          </Badge>
        )}
        <div className="font-mono text-[13px] leading-tight text-foreground break-all">
          {a.address}
        </div>
      </div>

      {/* Copy button */}
      <div className="px-4 pb-3">
        <button
          onClick={() => onCopy(a.id, a.address)}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
            copied === a.id
              ? "bg-primary/15 text-primary"
              : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          {copied === a.id ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              Copy Address
            </>
          )}
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-0 border-t border-border">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] text-muted-foreground">
          <InboxIcon className="w-3.5 h-3.5" />
          <span className="font-medium text-foreground/80">{a.emails_received}</span>
          <span className="hidden sm:inline">received</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] text-muted-foreground">
          <SendIcon className="w-3.5 h-3.5" />
          <span className="font-medium text-foreground/80">{a.emails_forwarded}</span>
          <span className="hidden sm:inline">forwarded</span>
        </div>
      </div>

      {/* Expiration bar */}
      {a.expires_at && (
        <div className="border-t border-border">
          <ExpirationBar expiresAt={a.expires_at} createdAt={a.created_at} />
        </div>
      )}
    </div>
  );
}

/* --- Main page --- */

export default function DashboardPage() {
  const [aliases, setAliases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadAliases = useCallback(async () => {
    try {
      const data = await api.getAliases();
      setAliases(data.aliases);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAliases(); }, [loadAliases]);

  // Summary stats
  const stats = useMemo(() => {
    const active = aliases.filter((a) => a.is_active).length;
    const totalReceived = aliases.reduce((s, a) => s + (a.emails_received || 0), 0);
    const totalForwarded = aliases.reduce((s, a) => s + (a.emails_forwarded || 0), 0);
    return { active, totalReceived, totalForwarded };
  }, [aliases]);

  async function handleToggle(alias) {
    await api.updateAlias(alias.id, { is_active: !alias.is_active });
    loadAliases();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this alias permanently?")) return;
    await api.deleteAlias(id);
    loadAliases();
  }

  function copyAddress(id, address) {
    navigator.clipboard.writeText(address);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="secondary" className="mb-2">Your Aliases</Badge>
          <h1 className="font-display font-bold text-2xl tracking-tight">Aliases</h1>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{aliases.length}</span> total
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-primary">{stats.active}</span> active
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{stats.totalReceived}</span> received
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{stats.totalForwarded}</span> forwarded
            </span>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)} className="glow-primary">
          <PlusIcon className="w-4 h-4" />
          New Alias
        </Button>
      </div>

      {/* Card grid */}
      {aliases.length === 0 ? (
        <div className="text-center py-24 border border-border rounded-2xl bg-card/50">
          <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
            <MailIcon className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">No aliases yet</p>
          <p className="text-muted-foreground/50 text-xs mt-1 mb-5">Create your first alias to get started</p>
          <Button onClick={() => setShowCreate(true)} variant="outline" size="sm">
            <PlusIcon className="w-4 h-4" />
            Create Alias
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aliases.map((a) => (
            <AliasCard
              key={a.id}
              alias={a}
              copied={copied}
              onCopy={copyAddress}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* FAB for mobile */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg glow-primary-strong flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* Create modal */}
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadAliases}
      />
    </>
  );
}
