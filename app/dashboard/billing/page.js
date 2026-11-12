"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "";

// Dodo can take a moment to mark a payment as done, so returning from
// checkout re-checks a few times before giving up.
async function confirmCheckout() {
  for (let attempt = 0; attempt < 6; attempt++) {
    const data = await api.syncBilling();
    if (!data.pending) return data;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return api.getBilling();
}

function UsageMeter({ used, limit }) {
  const share = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>Active aliases</span>
        <span className="tabular-nums text-muted-foreground">
          {used} of {limit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit} aria-label="Active aliases used">
        <div className={`h-full rounded-full ${share >= 100 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${share}%` }} />
      </div>
      {used >= limit && (
        <p className="text-xs text-muted-foreground mt-2">
          You&apos;re at the limit. Turn an alias off to make room, or upgrade.
        </p>
      )}
    </div>
  );
}

export default function BillingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    try {
      const returning = new URLSearchParams(window.location.search).get("checkout") === "done";
      if (returning) {
        setNotice("Confirming your payment...");
        const data = await confirmCheckout();
        setBilling(data);
        setNotice(data.plan === "plus" ? "You're on Plus. Thank you!" : "We haven't received the payment yet. If you were charged, refresh in a minute.");
        router.replace("/dashboard/billing");
      } else {
        setBilling(await api.getBilling());
      }
      setError("");
    } catch (err) {
      setNotice("");
      setError(err.message);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function upgrade(interval) {
    setBusy(interval);
    setError("");
    try {
      window.location.assign(await api.startCheckout(interval));
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  }

  async function manage() {
    setBusy("portal");
    setError("");
    try {
      window.location.assign(await api.openBillingPortal());
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl mb-1">Billing</h1>
        <p className="text-sm text-muted-foreground">Your plan, and what it includes.</p>
      </div>

      {notice && (
        <div role="status" className="mb-6 border border-primary/40 bg-primary/5 rounded-xl px-4 py-3 text-sm">
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="mb-6 border border-destructive/40 bg-destructive/10 rounded-xl px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!billing && !error && (
        <div className="flex justify-center py-20" role="status" aria-label="Loading">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {billing && !billing.enabled && billing.plan !== "plus" && (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Paid plans aren&apos;t available yet. Everything you use today stays free.</p>
        </Card>
      )}

      {billing && billing.founding_member && billing.plan !== "plus" && (
        <Card className="p-6">
          <div className="font-display font-bold text-lg mb-1">Founding member</div>
          <p className="text-sm text-muted-foreground">
            You signed up before paid plans existed, so you keep unlimited aliases for free, as
            promised. There&apos;s nothing to pay.
          </p>
          <p className="text-sm text-muted-foreground mt-3 tabular-nums">{billing.active_aliases} active aliases</p>
        </Card>
      )}

      {billing && billing.plan === "plus" && (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display font-bold text-lg mb-1">Plus, {billing.interval === "year" ? "yearly" : "monthly"}</div>
              <p className="text-sm text-muted-foreground">
                {billing.cancel_at_period_end
                  ? `Cancelled. You keep Plus until ${formatDate(billing.renews_at)}.`
                  : `Renews on ${formatDate(billing.renews_at)}.`}
              </p>
              {billing.status === "past_due" && (
                <p className="text-sm text-destructive mt-2">
                  Your last payment didn&apos;t go through. Update your payment method to keep Plus.
                </p>
              )}
            </div>
            {billing.can_manage && (
              <Button variant="outline" size="sm" onClick={manage} disabled={busy !== null} className="shrink-0">
                {busy === "portal" ? "Opening..." : "Manage subscription"}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4 tabular-nums">{billing.active_aliases} active aliases, no limit</p>
        </Card>
      )}

      {billing && billing.enabled && billing.plan === "free" && !billing.founding_member && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="font-display font-bold text-lg mb-4">Free</div>
            <UsageMeter used={billing.active_aliases} limit={billing.alias_limit} />
          </Card>

          <Card className="p-6 border-primary/40">
            <div className="font-display font-bold text-lg mb-1">Plus</div>
            <p className="text-sm text-muted-foreground mb-5">
              Unlimited active aliases. Cancel any time, and get a full refund within 14 days if it
              isn&apos;t for you. The price in your currency is shown at checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => upgrade("year")} disabled={busy !== null} className="glow-primary">
                {busy === "year" ? "Opening checkout..." : "Upgrade, billed yearly"}
              </Button>
              <Button variant="outline" onClick={() => upgrade("month")} disabled={busy !== null}>
                {busy === "month" ? "Opening checkout..." : "Upgrade, billed monthly"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Payments are handled by Dodo Payments. We never see your card details.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
