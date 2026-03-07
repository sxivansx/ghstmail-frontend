"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const [aliases, setAliases] = useState([]);
  const [label, setLabel] = useState("");
  const [expiresHours, setExpiresHours] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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

  function copyAddress(address) {
    navigator.clipboard.writeText(address);
  }

  if (loading) {
    return <div className="text-gray-400 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Email Aliases</h1>
        <p className="text-gray-400 text-sm mt-1">
          Create aliases to protect your real email address.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Label (optional)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Newsletter"
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-ghst-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Expires in (hours)</label>
          <input
            type="number"
            value={expiresHours}
            onChange={(e) => setExpiresHours(e.target.value)}
            placeholder="Never"
            min="1"
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm w-28 focus:outline-none focus:border-ghst-500"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 bg-ghst-600 hover:bg-ghst-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {creating ? "Creating..." : "+ New Alias"}
        </button>
      </form>

      <div className="space-y-3">
        {aliases.length === 0 && (
          <p className="text-gray-500 text-sm py-8 text-center">
            No aliases yet. Create your first one above.
          </p>
        )}
        {aliases.map((a) => (
          <div
            key={a.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              a.is_active
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-900/50 border-gray-800 opacity-60"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyAddress(a.address)}
                  className="font-mono text-sm hover:text-ghst-500 transition"
                  title="Click to copy"
                >
                  {a.address}
                </button>
                {a.label && (
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">
                    {a.label}
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{a.emails_received} received</span>
                <span>{a.emails_forwarded} forwarded</span>
                {a.expires_at && (
                  <span>
                    Expires: {new Date(a.expires_at).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(a)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  a.is_active
                    ? "border-green-700 text-green-400"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                {a.is_active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-xs px-3 py-1 rounded-full border border-red-800 text-red-400 hover:bg-red-900/50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
