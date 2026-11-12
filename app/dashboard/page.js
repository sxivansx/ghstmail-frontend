"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { api } from "../../lib/api";
import { expiryLabel, forwardRate, scrambleFrame, aliasQuery, resolveAliasPage } from "../../lib/dashboard-format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";

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

function ChromeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" /><path d="M12 17v4" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* --- Expiration bar --- */

/* --- Instant alias --- */

const GLYPHS = "abcdefghijkmnpqrstuvwxyz23456789#%&$*+=?/<>";
const SHAPE = "xxxxxxx.xxxxx@ghstmail.space";
const pickGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12L13 2z" />
    </svg>
  );
}

// The address of a row that is being generated. It scrambles until the real address
// is known, then resolves into it left to right and reports that it has settled.
function ScrambleText({ target, onSettled }) {
  const [text, setText] = useState(() => SHAPE.replace(/x/g, "\u2022"));
  const settled = useRef(onSettled);
  settled.current = onSettled;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (target) {
        setText(target);
        settled.current();
      }
      return;
    }
    let revealed = 0;
    const timer = setInterval(() => {
      if (!target) {
        setText(scrambleFrame(SHAPE, 0, pickGlyph));
        return;
      }
      revealed += 1;
      setText(scrambleFrame(target, revealed, pickGlyph));
      if (revealed >= target.length) {
        clearInterval(timer);
        settled.current();
      }
    }, target ? 28 : 45);
    return () => clearInterval(timer);
  }, [target]);

  return text;
}

/* --- Create modal --- */

function CreateModal({ open, onClose, onCreated }) {
  const [label, setLabel] = useState("");
  const [expiresHours, setExpiresHours] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      await api.createAlias({
        label: label || undefined,
        expires_in_hours: expiresHours ? Number(expiresHours) : undefined,
      });
      setLabel("");
      setExpiresHours("");
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
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
          {error && (
            <div role="alert" className="border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
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

const COLUMNS = "md:grid-cols-[minmax(0,1fr)_112px_210px_112px_36px]";
const PAGE_SIZE = 25;
const KBD = "hidden lg:inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground";

// The share of mail that got through, drawn as a ring around the mascot.
function DeliveryRing({ rate }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => setDrawn(true), []);
  const length = 2 * Math.PI * 54;

  return (
    <figure className="flex items-center gap-5 md:flex-col md:gap-3">
      <div className="relative w-[124px] h-[124px] shrink-0">
        <svg viewBox="0 0 124 124" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="62" cy="62" r="54" fill="none" strokeWidth="6" className="stroke-muted" />
          {rate !== null && (
            <circle
              cx="62" cy="62" r="54" fill="none" strokeWidth="6" strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={length}
              style={{ strokeDashoffset: drawn ? length * (1 - rate) : length, transition: "stroke-dashoffset 1.1s cubic-bezier(0.2, 0.7, 0.2, 1)" }}
            />
          )}
        </svg>
        <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto w-12 h-12 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <figcaption className="text-sm text-muted-foreground md:text-center">
        {rate === null ? (
          "No mail yet"
        ) : (
          <>
            <span className="text-foreground font-semibold tabular-nums">{Math.round(rate * 100)}%</span> delivered
          </>
        )}
      </figcaption>
    </figure>
  );
}

// A row in the list. A row that was just generated passes `fresh`: it slides open
// like a slip coming out of a printer, shows the address resolving, then glows green
// for a few seconds once it has been created and copied.
function AliasRow({ alias, fresh, now, copied, onCopy, onToggle, onDelete, onSettled }) {
  const a = alias;
  const making = fresh && fresh.status !== "done";
  const [open, setOpen] = useState(!fresh);
  const [glow, setGlow] = useState(false);
  const row = useRef(null);

  useEffect(() => {
    if (!fresh) return;
    const frame = requestAnimationFrame(() => setOpen(true));
    row.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return () => cancelAnimationFrame(frame);
    // Only on mount: this is the entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fresh?.status !== "done") return;
    setGlow(true);
    const timer = setTimeout(() => setGlow(false), 4200);
    return () => clearTimeout(timer);
  }, [fresh?.status]);

  const expiry = making ? "Never" : expiryLabel(a.expires_at, now);
  const rate = making ? null : forwardRate(a);
  const active = making ? true : a.is_active;

  return (
    <li
      ref={row}
      className="grid border-t border-border first:border-t-0 transition-[grid-template-rows] duration-300 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={`group grid ${COLUMNS} items-center gap-x-4 gap-y-3 px-5 py-3.5 transition-[background-color,box-shadow,opacity,transform] duration-700 ${
            open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          } ${
            glow
              ? "bg-emerald-500/[0.07] shadow-[inset_2px_0_0_rgb(16_185_129)]"
              : making
              ? "bg-muted/40 shadow-[inset_2px_0_0_transparent]"
              : "shadow-[inset_2px_0_0_transparent] hover:bg-muted/40"
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span
              aria-hidden="true"
              className={`shrink-0 grid place-items-center w-9 h-9 rounded-lg border font-display font-bold text-sm transition-colors duration-500 ${
                glow
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : `border-border bg-muted ${active ? "" : "text-muted-foreground"}`
              }`}
            >
              {making ? (
                <BoltIcon className="w-4 h-4 text-muted-foreground" />
              ) : glow ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                (a.label || a.address).charAt(0).toUpperCase()
              )}
            </span>
            <div className="min-w-0">
              <div className={`text-sm font-medium truncate ${!making && a.label ? "" : "text-muted-foreground"}`}>
                {making ? "New alias" : a.label || "No label"}
              </div>
              <div className="mt-0.5 flex items-center gap-2 min-w-0">
                <span
                  aria-live={fresh ? "polite" : undefined}
                  className={`font-mono text-[12.5px] truncate transition-colors duration-500 ${
                    glow ? "text-emerald-300" : making ? "text-foreground/60" : active ? "text-foreground/85" : "text-muted-foreground"
                  }`}
                >
                  {making ? <ScrambleText target={fresh.status === "resolving" ? a.address : null} onSettled={onSettled} /> : a.address}
                </span>
                {glow ? (
                  <span className="shrink-0 inline-flex items-center gap-1 h-5 px-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 text-[11px] text-emerald-400">
                    <CheckIcon className="w-3 h-3" />
                    {fresh.copied ? "Copied" : "Created"}
                  </span>
                ) : (
                  !making && (
                    <button
                      onClick={() => onCopy(a.id, a.address)}
                      aria-label={copied === a.id ? "Copied" : `Copy ${a.address}`}
                      className="shrink-0 p-1.5 -my-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {copied === a.id ? <CheckIcon className="w-3.5 h-3.5 text-primary" /> : <CopyIcon className="w-3.5 h-3.5" />}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 md:contents text-sm ${making ? "pointer-events-none" : ""}`}>
            <div className={`flex items-center gap-2.5 transition-opacity duration-500 ${making ? "opacity-40" : ""}`}>
              <button
                role="switch"
                aria-checked={active}
                aria-label={making ? "Being created" : `${a.address} is ${active ? "active" : "paused"}`}
                disabled={making}
                onClick={() => onToggle(a)}
                className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${active ? "bg-primary" : "bg-input"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${active ? "translate-x-4" : ""}`} />
              </button>
              <span className={active ? "" : "text-muted-foreground"}>{active ? "Active" : "Paused"}</span>
            </div>
            <div className={`min-w-[150px] flex-1 md:flex-none transition-opacity duration-500 ${making ? "opacity-40" : ""}`}>
              <div className="tabular-nums">
                {making ? 0 : a.emails_forwarded}
                <span className="text-muted-foreground"> of {making ? 0 : a.emails_received} forwarded</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-foreground/55" style={{ width: `${(rate ?? 0) * 100}%` }} />
              </div>
            </div>
            <div className={`tabular-nums transition-opacity duration-500 ${making ? "opacity-40" : ""} ${expiry === "Expired" ? "text-destructive" : expiry === "Never" ? "text-muted-foreground" : ""}`}>
              <span className="md:hidden text-muted-foreground">Expires: </span>
              {expiry}
            </div>
            {making ? (
              <span />
            ) : (
              <button
                onClick={() => onDelete(a)}
                aria-label={`Delete ${a.address}`}
                className="ml-auto md:ml-0 p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/* --- Main page --- */

export default function DashboardPage() {
  // The last response from the server: one page of aliases, or all of them.
  const [data, setData] = useState({ aliases: [] });
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showExtBanner, setShowExtBanner] = useState(false);
  const [query, setQuery] = useState("");
  // The search text that requests use, a beat behind what is typed.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [now, setNow] = useState(() => Date.now());
  // Rows made with "Instant alias" this visit, newest first. They stay pinned to the top.
  const [fresh, setFresh] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const freshKey = useRef(0);
  const generating = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("ghstmail_ext_dismissed")) {
      setShowExtBanner(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const ask = useMemo(() => ({ page, size: PAGE_SIZE, query: search, status }), [page, search, status]);
  const askRef = useRef(ask);
  askRef.current = ask;
  const latest = useRef(0);

  const loadAliases = useCallback(async () => {
    const mine = ++latest.current;
    setFetching(true);
    try {
      const response = await api.getAliases(aliasQuery(askRef.current));
      // A newer request has gone out since; its answer is the one to show.
      if (mine !== latest.current) return;
      setData(response);
      setLoadFailed(false);
      setError("");
    } catch (err) {
      if (mine !== latest.current) return;
      setLoadFailed(true);
      setError(err.message);
    } finally {
      if (mine === latest.current) setFetching(false);
      setLoading(false);
    }
  }, []);

  const view = useMemo(() => resolveAliasPage(data, ask), [data, ask]);
  const summary = view.summary;

  // Ask the server again when the page, the search or the filter changes. A server
  // that answered with every alias has nothing more to give, so that case is skipped.
  const loadedOnce = useRef(false);
  const paged = useRef(false);
  paged.current = view.paged;
  useEffect(() => {
    if (loadedOnce.current && !paged.current) return;
    loadedOnce.current = true;
    loadAliases();
  }, [ask, loadAliases]);

  // Deleting the last row of the last page leaves that page empty: step back to a real one.
  useEffect(() => {
    if (view.page !== page) setPage(view.page);
  }, [view.page, page]);

  // Makes an alias with no label. A row slides into the top of the list straight away
  // and scrambles while the request is out, so the click never feels like it waited.
  const generate = useCallback(async () => {
    if (generating.current) return;
    generating.current = true;
    const key = ++freshKey.current;
    setPage(1);
    setFresh((rows) => [{ key, status: "pending" }, ...rows]);
    try {
      const [data] = await Promise.all([api.createAlias({}), new Promise((resolve) => setTimeout(resolve, 520))]);
      let copiedOk = true;
      try {
        await navigator.clipboard.writeText(data.alias.address);
      } catch {
        copiedOk = false;
      }
      setFresh((rows) => rows.map((row) => (row.key === key ? { ...row, status: "resolving", alias: data.alias, copied: copiedOk } : row)));
    } catch (err) {
      setFresh((rows) => rows.filter((row) => row.key !== key));
      setError(err.message);
      generating.current = false;
    }
  }, []);

  const settle = useCallback(
    (key) => {
      setFresh((rows) => rows.map((row) => (row.key === key ? { ...row, status: "done" } : row)));
      generating.current = false;
      loadAliases();
    },
    [loadAliases]
  );

  // "/" jumps to search, "n" starts a new alias and "g" generates one, unless you are typing somewhere.
  useEffect(() => {
    function onKey(event) {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("alias-search")?.focus();
      } else if (event.key === "n") {
        event.preventDefault();
        setShowCreate(true);
      } else if (event.key === "g") {
        event.preventDefault();
        generate();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [generate]);

  const freshIds = useMemo(() => new Set(fresh.map((row) => row.alias?.id).filter(Boolean)), [fresh]);
  const rows = view.rows.filter((alias) => !freshIds.has(alias.id));
  const freshShown = page === 1 ? fresh : [];
  // Rows still being created are not in the server's count yet.
  const total = summary.count + fresh.filter((row) => !row.alias).length;

  async function handleToggle(alias) {
    try {
      const updated = await api.updateAlias(alias.id, { is_active: !alias.is_active });
      setFresh((list) => list.map((row) => (row.alias?.id === alias.id ? { ...row, alias: updated.alias } : row)));
      await loadAliases();
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmDelete() {
    const { id } = deleting;
    try {
      await api.deleteAlias(id);
      setFresh((rows) => rows.filter((row) => row.alias?.id !== id));
      await loadAliases();
    } catch (err) {
      setError(err.message);
    }
    setDeleting(null);
  }
  const cancelDelete = useCallback(() => setDeleting(null), []);

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
      {/* Chrome Extension Banner */}
      {showExtBanner && (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-4">
          <div className="hidden sm:flex shrink-0 w-9 h-9 rounded-xl bg-muted border border-border items-center justify-center">
            <ChromeIcon className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Try the Chrome extension</p>
            <p className="hidden sm:block text-xs text-muted-foreground">Generate aliases on any site without leaving the page.</p>
          </div>
          <a
            href="https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-xs font-medium hover:bg-muted transition-colors"
          >
            Add to Chrome
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => {
              setShowExtBanner(false);
              localStorage.setItem("ghstmail_ext_dismissed", "1");
            }}
            aria-label="Dismiss"
            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-6 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{error}</span>
          {loadFailed && (
            <Button variant="outline" size="sm" onClick={loadAliases}>
              Try again
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-[1.75rem] leading-tight tracking-tight">Aliases</h1>
          <p className="text-sm text-muted-foreground mt-1">Addresses you hand out instead of your real one.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            className="group/gen inline-flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-[0.7rem] border border-border bg-card text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-foreground/25 hover:bg-muted active:translate-y-px transition"
          >
            <BoltIcon className="w-4 h-4 text-primary transition-transform duration-200 group-hover/gen:-rotate-12 group-hover/gen:scale-110" />
            Instant alias
            <kbd className={KBD}>G</kbd>
          </button>
          <Button onClick={() => setShowCreate(true)} className="hidden sm:inline-flex">
            <PlusIcon className="w-4 h-4" />
            New alias
            <kbd className="hidden lg:inline-flex h-5 min-w-5 items-center justify-center rounded bg-primary-foreground/15 px-1 font-mono text-[10px]">N</kbd>
          </Button>
        </div>
      </div>

      <section aria-label="Overview" className="relative overflow-hidden rounded-2xl border border-border bg-card mb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div aria-hidden="true" className="pointer-events-none absolute -top-28 -right-10 w-[460px] h-[340px] bg-[radial-gradient(closest-side,hsl(var(--primary)/0.09),transparent)]" />
        <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-sm text-muted-foreground">Your aliases have forwarded</p>
            <p className="mt-2 font-display font-extrabold tracking-tight leading-none tabular-nums text-[clamp(2.75rem,5.5vw,4rem)]">
              {summary.forwarded}
              <span className="ml-3 font-body font-normal tracking-normal text-base text-muted-foreground">of {summary.received} emails</span>
            </p>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["Aliases", summary.count],
                ["Active", summary.active],
                ["Paused", summary.count - summary.active],
                ["Not forwarded", summary.stopped],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <DeliveryRing rate={summary.rate} />
        </div>
      </section>

      {loadFailed && total === 0 ? null : total === 0 ? (
        <div className="text-center px-6 py-20 border border-border rounded-xl bg-card">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
            <MailIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="font-display font-semibold text-lg">No aliases yet</h2>
          <p className="text-muted-foreground text-sm mt-1.5 mb-6 max-w-sm mx-auto">
            Create one, use it on any website, and its mail forwards to your real inbox. Your real address stays hidden.
          </p>
          <Button onClick={() => setShowCreate(true)}>
            <PlusIcon className="w-4 h-4" />
            Create your first alias
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="relative w-full sm:w-72">
              <Input
                id="alias-search"
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by address or label"
                aria-label="Search aliases"
                className="h-9 w-full pr-9"
              />
              <kbd className={`${KBD} absolute right-2 top-2`}>/</kbd>
            </div>
            <div role="group" aria-label="Show" className="inline-flex p-0.5 rounded-lg border border-border bg-card">
              {[["all", "All"], ["active", "Active"], ["paused", "Paused"]].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => { setStatus(value); setPage(1); }}
                  aria-pressed={status === value}
                  className={`h-8 px-3 rounded-md text-sm transition-colors ${
                    status === value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-muted-foreground tabular-nums">
              {view.matching} of {summary.count}
            </span>
          </div>

          <div aria-busy={fetching} className={`rounded-xl border border-border bg-card overflow-hidden transition-opacity duration-200 ${fetching && view.paged ? "opacity-60" : ""}`}>
            <div className={`hidden md:grid ${COLUMNS} items-center gap-x-4 px-5 h-10 border-b border-border text-xs text-muted-foreground`}>
              <span>Alias</span>
              <span>Status</span>
              <span>Delivery</span>
              <span>Expires</span>
              <span />
            </div>
            {rows.length + freshShown.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">No aliases match that search.</p>
            ) : (
              <ul>
                {freshShown.map((row) => (
                  <AliasRow
                    key={`fresh-${row.key}`}
                    alias={data.aliases.find((alias) => alias.id === row.alias?.id) || row.alias}
                    fresh={row}
                    now={now}
                    copied={copied}
                    onCopy={copyAddress}
                    onToggle={handleToggle}
                    onDelete={setDeleting}
                    onSettled={() => settle(row.key)}
                  />
                ))}
                {rows.map((a) => (
                  <AliasRow
                    key={a.id}
                    alias={a}
                    now={now}
                    copied={copied}
                    onCopy={copyAddress}
                    onToggle={handleToggle}
                    onDelete={setDeleting}
                  />
                ))}
              </ul>
            )}
            {view.pages > 1 && (
              <nav aria-label="Pages" className="flex items-center justify-between gap-4 px-5 h-12 border-t border-border text-sm">
                <span className="text-muted-foreground tabular-nums">
                  {view.from}–{view.to} of {view.matching}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(view.page - 1)}
                    disabled={view.page === 1}
                    className="h-8 px-3 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-1 text-muted-foreground tabular-nums">
                    Page {view.page} of {view.pages}
                  </span>
                  <button
                    onClick={() => setPage(view.page + 1)}
                    disabled={view.page === view.pages}
                    className="h-8 px-3 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </div>
        </>
      )}

      {/* FAB for mobile */}
      <button
        onClick={() => setShowCreate(true)}
        aria-label="New alias"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg glow-primary-strong flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this alias?"
        confirmLabel="Delete alias"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      >
        <span className="block font-mono text-[12.5px] text-foreground break-all">{deleting?.address}</span>
        <span className="block mt-2">
          Mail sent to it will stop reaching you, and replies to its past mail stop working. This cannot be undone.
        </span>
      </ConfirmDialog>

      {/* Create modal */}
      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadAliases}
      />
    </>
  );
}
