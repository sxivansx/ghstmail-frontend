"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../../lib/api";

export default function FiltersPage() {
  const [filters, setFilters] = useState([]);
  const [domain, setDomain] = useState("");
  const [action, setAction] = useState("block");
  const [loading, setLoading] = useState(true);

  const loadFilters = useCallback(async () => {
    try {
      const data = await api.getFilters();
      setFilters(data.filters);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFilters(); }, [loadFilters]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!domain) return;
    await api.createFilter({ domain, action });
    setDomain("");
    loadFilters();
  }

  async function handleDelete(id) {
    await api.deleteFilter(id);
    loadFilters();
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
      <div>
        <h1 className="font-display font-bold text-2xl tracking-tight">Filters</h1>
        <p className="text-void-400 text-sm mt-1">
          Block or allow emails from specific domains
        </p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="p-5 rounded-2xl border border-void-600/30 bg-void-800/20 backdrop-blur-sm">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-void-300 mb-1.5 ml-0.5">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. spam.com"
              required
              className="w-full px-3.5 py-2.5 bg-void-800/60 border border-void-600/40 rounded-xl text-sm text-void-50 placeholder:text-void-500 focus:outline-none focus:border-phantom-400/50 transition-all"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-void-300 mb-1.5 ml-0.5">Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-void-800/60 border border-void-600/40 rounded-xl text-sm text-void-50 focus:outline-none focus:border-phantom-400/50 transition-all appearance-none cursor-pointer"
            >
              <option value="block">Block</option>
              <option value="allow">Allow</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-phantom-400 text-void-950 rounded-xl text-sm font-semibold hover:bg-phantom-300 transition-all glow-green flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </form>

      {/* Filter list */}
      <div className="space-y-3">
        {filters.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-void-700/30 border border-void-600/30 flex items-center justify-center mx-auto mb-4">
              <FilterIcon className="w-6 h-6 text-void-400" />
            </div>
            <p className="text-void-400 text-sm">No filter rules</p>
            <p className="text-void-500 text-xs mt-1">Add rules above to block unwanted domains</p>
          </div>
        )}
        {filters.map((f) => (
          <div
            key={f.id}
            className="group flex items-center justify-between p-4 rounded-2xl border border-void-600/30 bg-void-800/20 border-glow"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider ${
                  f.action === "block"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-phantom-400/10 text-phantom-400 border border-phantom-400/20"
                }`}
              >
                {f.action}
              </span>
              <span className="font-mono text-sm text-void-100">{f.domain}</span>
            </div>
            <button
              onClick={() => handleDelete(f.id)}
              className="p-1.5 rounded-lg text-void-500 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
              title="Remove rule"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
