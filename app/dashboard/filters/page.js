"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function FilterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

export default function FiltersPage() {
  const [filters, setFilters] = useState([]);
  const [domain, setDomain] = useState("");
  const [action, setAction] = useState("block");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFilters = useCallback(async () => {
    try {
      const data = await api.getFilters();
      setFilters(data.filters);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFilters(); }, [loadFilters]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!domain) return;
    try {
      await api.createFilter({ domain, action });
      setDomain("");
      await loadFilters();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteFilter(id);
      await loadFilters();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-[1.75rem] leading-tight tracking-tight">Filters</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Block or allow mail from a whole domain. A rule applies to every alias you have.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-6 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-6 rounded-xl border border-border bg-card p-5 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <Label htmlFor="filter-domain" className="text-sm text-muted-foreground">Domain</Label>
          <Input
            id="filter-domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. spam.com"
            required
          />
        </div>
        <div className="w-36 space-y-1.5">
          <Label className="text-sm text-muted-foreground">Action</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="allow">Allow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">
          <PlusIcon className="w-4 h-4" />
          Add rule
        </Button>
      </form>

      {filters.length === 0 ? (
        <div className="text-center px-6 py-16 border border-border rounded-xl bg-card">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
            <FilterIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="font-display font-semibold text-lg">No rules yet</h2>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-xs mx-auto">
            Getting spam from one sender? Add its domain above and it stops reaching every alias.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_96px_36px] items-center gap-x-4 px-5 h-10 border-b border-border text-xs text-muted-foreground">
            <span>Domain</span>
            <span>Action</span>
            <span />
          </div>
          <ul>
            {filters.map((f) => (
              <li key={f.id} className="group grid grid-cols-[minmax(0,1fr)_96px_36px] items-center gap-x-4 px-5 py-3 border-t border-border first:border-t-0 hover:bg-muted/40 transition-colors">
                <span className="font-mono text-[13px] truncate">{f.domain}</span>
                <span>
                  <span className={`inline-flex h-6 px-2 items-center rounded-md border text-xs ${
                    f.action === "block"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-border bg-muted text-foreground"
                  }`}>
                    {f.action === "block" ? "Block" : "Allow"}
                  </span>
                </span>
                <button
                  onClick={() => handleDelete(f.id)}
                  aria-label={`Delete the rule for ${f.domain}`}
                  className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
