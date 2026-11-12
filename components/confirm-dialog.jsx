"use client";

import { useEffect, useRef, useState } from "react";

// A confirmation for actions that cannot be undone. Render it with `open` and it
// handles Escape, click outside, focus, and the busy state while `onConfirm` runs.
// Focus starts on Cancel, so pressing Enter by reflex never destroys anything.
export function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }) {
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const cancelButton = useRef(null);

  useEffect(() => {
    if (!open) {
      setShown(false);
      setBusy(false);
      return;
    }
    const frame = requestAnimationFrame(() => setShown(true));
    cancelButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  async function confirm() {
    setBusy(true);
    await onConfirm();
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
        onClick={busy ? undefined : onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className={`relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-200 ease-out ${
          shown ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.97] translate-y-1"
        }`}
      >
        <h2 id="confirm-title" className="font-display font-semibold text-lg tracking-tight">{title}</h2>
        <div id="confirm-body" className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelButton}
            onClick={onCancel}
            disabled={busy}
            className="h-9 px-4 rounded-[0.7rem] border border-border bg-card text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={busy}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[0.7rem] bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-70 transition-colors"
          >
            {busy && <span className="w-3.5 h-3.5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
