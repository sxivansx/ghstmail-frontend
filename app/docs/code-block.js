"use client";

import { useState } from "react";

/**
 * Only the copy button is a client component. The highlighted code itself is
 * rendered on the server and passed in as children, so the page still ships
 * almost no JavaScript.
 */
export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => setCopied(false)
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity
                 text-muted-foreground hover:text-foreground p-1 rounded-md
                 hover:bg-foreground/5 focus-visible:outline focus-visible:outline-1
                 focus-visible:outline-border"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}
