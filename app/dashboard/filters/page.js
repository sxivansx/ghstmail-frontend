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
    return <div className="text-gray-400 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Filter Rules</h1>
        <p className="text-gray-400 text-sm mt-1">
          Block or allow emails from specific domains.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. spam.com"
            required
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-ghst-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-ghst-500"
          >
            <option value="block">Block</option>
            <option value="allow">Allow</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-ghst-600 hover:bg-ghst-700 rounded-lg text-sm font-medium transition"
        >
          + Add Rule
        </button>
      </form>

      <div className="space-y-3">
        {filters.length === 0 && (
          <p className="text-gray-500 text-sm py-8 text-center">
            No filter rules configured.
          </p>
        )}
        {filters.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  f.action === "block"
                    ? "bg-red-900/50 text-red-400"
                    : "bg-green-900/50 text-green-400"
                }`}
              >
                {f.action.toUpperCase()}
              </span>
              <span className="font-mono text-sm">{f.domain}</span>
            </div>
            <button
              onClick={() => handleDelete(f.id)}
              className="text-xs px-3 py-1 rounded-full border border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-800 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
