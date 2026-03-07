"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const [aliases, setAliases] = useState([]);
  const [label, setLabel] = useState("");
  const [expiresHours, setExpiresHours] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(null);

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

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createAlias({
        label: label || undefined,
        expires_in_hours: expiresHours ? Number(expiresHours) : undefined,
      });
      setLabel("");
      setExpiresHours("");
      loadAliases();
    } catch {
    } finally {
      setCreating(false);
    }
  }

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
        <div className="w-6 h-6 border-2 border-phantom-400/30 border-t-phantom-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">Aliases</h1>
          <p className="text-void-400 text-sm mt-1">
            {aliases.length} alias{aliases.length !== 1 ? "es" : ""} created
          </p>
        </div>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="p-5 rounded-2xl border border-void-600/30 bg-void-800/20 backdrop-blur-sm">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-void-300 mb-1.5 ml-0.5">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Newsletter, Shopping"
              className="w-full px-3.5 py-2.5 bg-void-800/60 border border-void-600/40 rounded-xl text-sm text-void-50 placeholder:text-void-500 focus:outline-none focus:border-phantom-400/50 transition-all"
            />
          </div>
          <div className="w-36">
            <label className="block text-xs font-medium text-void-300 mb-1.5 ml-0.5">Expires in</label>
            <input
              type="number"
              value={expiresHours}
              onChange={(e) => setExpiresHours(e.target.value)}
              placeholder="Hours"
              min="1"
              className="w-full px-3.5 py-2.5 bg-void-800/60 border border-void-600/40 rounded-xl text-sm text-void-50 placeholder:text-void-500 focus:outline-none focus:border-phantom-400/50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-5 py-2.5 bg-phantom-400 text-void-950 rounded-xl text-sm font-semibold hover:bg-phantom-300 transition-all disabled:opacity-50 glow-green flex items-center gap-2"
          >
            {creating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4" />
                New Alias
              </>
            )}
          </button>
        </div>
      </form>

      {/* Alias list */}
      <div className="space-y-3">
        {aliases.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-void-700/30 border border-void-600/30 flex items-center justify-center mx-auto mb-4">
              <MailIcon className="w-6 h-6 text-void-400" />
            </div>
            <p className="text-void-400 text-sm">No aliases yet</p>
            <p className="text-void-500 text-xs mt-1">Create your first one above</p>
          </div>
        )}
        {aliases.map((a) => (
          <div
            key={a.id}
            className={`group p-4 rounded-2xl border transition-all ${
              a.is_active
                ? "bg-void-800/20 border-void-600/30 border-glow"
                : "bg-void-900/30 border-void-700/20 opacity-50"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => copyAddress(a.id, a.address)}
                    className="font-mono text-sm hover:text-phantom-400 transition-colors flex items-center gap-1.5"
                    title="Click to copy"
                  >
                    {a.address}
                    {copied === a.id ? (
                      <CheckIcon className="w-3.5 h-3.5 text-phantom-400" />
                    ) : (
                      <CopyIcon className="w-3.5 h-3.5 text-void-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                  {a.label && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-phantom-400/10 text-phantom-400 font-medium">
                      {a.label}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-void-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <InboxIcon className="w-3 h-3" />
                    {a.emails_received} received
                  </span>
                  <span className="flex items-center gap-1">
                    <SendIcon className="w-3 h-3" />
                    {a.emails_forwarded} forwarded
                  </span>
                  {a.expires_at && (
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {new Date(a.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(a)}
                  className={`relative w-10 h-5.5 rounded-full transition-all ${
                    a.is_active ? "bg-phantom-400" : "bg-void-600"
                  }`}
                  title={a.is_active ? "Deactivate" : "Activate"}
                  style={{ height: "22px" }}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-void-950 transition-all ${
                      a.is_active ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 rounded-lg text-void-500 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
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

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function InboxIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
