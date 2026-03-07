"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Badge */}
      <div>
        <Badge variant="secondary" className="mb-2">Filter Rules</Badge>
        <h1 className="font-display font-bold text-2xl tracking-tight">Filters</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Block or allow emails from specific domains
        </p>
      </div>

      {/* Create form — border-y wrapper */}
      <div className="border-y border-border/50 py-5">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="flex gap-3 items-end flex-wrap">
              <div className="flex-1 min-w-[180px] space-y-2">
                <Label>Domain</Label>
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. spam.com"
                  required
                />
              </div>
              <div className="w-36 space-y-2">
                <Label>Action</Label>
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
              <Button type="submit" className="glow-primary">
                <PlusIcon className="w-4 h-4" />
                Add Rule
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Filter list */}
      <div className="space-y-3">
        {filters.length === 0 && (
          <div className="text-center py-16 border border-border rounded-2xl bg-card/50">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FilterIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No filter rules</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Add rules above to block unwanted domains</p>
          </div>
        )}
        {filters.map((f) => (
          <Card key={f.id} className="group border-glow">
            <CardContent className="py-4 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={f.action === "block" ? "destructive" : "default"}>
                    {f.action.toUpperCase()}
                  </Badge>
                  <span className="font-mono text-sm">{f.domain}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(f.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
