"use client";

import { useEffect, useState } from "react";

const RUNS = [
  {
    tab: "Create an alias",
    command: `curl https://api.ghstmail.space/v1/aliases \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"label": "newsletter"}'`,
    output: `{
  "object": "alias",
  "address": "newsletter.k7f2q@ghstmail.space",
  "label": "newsletter",
  "active": true,
  "expires_at": null
}`,
  },
  {
    tab: "Pause it",
    command: `curl -X PATCH https://api.ghstmail.space/v1/aliases/$ALIAS_ID \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"active": false}'`,
    output: `{
  "object": "alias",
  "address": "newsletter.k7f2q@ghstmail.space",
  "label": "newsletter",
  "active": false,
  "expires_at": null
}`,
  },
  {
    tab: "From the CLI",
    command: "ghstmail new github",
    output: `github.k7f2q@ghstmail.space
  copied to clipboard  ·  label: github  ·  never expires`,
  },
];

const ADDRESS = /([\w.-]+@ghstmail\.space)/;

// A sample request that types itself out and prints the documented response.
// Nothing is sent anywhere.
export function TryIt() {
  const [index, setIndex] = useState(0);
  const [replay, setReplay] = useState(0);
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);
  const run = RUNS[index];
  const outputLines = run.output.split("\n");

  useEffect(() => {
    const current = RUNS[index];
    const total = current.output.split("\n").length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(current.command.length);
      setLines(total);
      return;
    }
    setTyped(0);
    setLines(0);
    let timer;
    let count = 0;
    let shown = 0;
    const reveal = () => {
      shown += 1;
      setLines(shown);
      if (shown < total) timer = setTimeout(reveal, 55);
    };
    const type = () => {
      count += 2;
      setTyped(count);
      timer = count < current.command.length ? setTimeout(type, 16) : setTimeout(reveal, 420);
    };
    timer = setTimeout(type, 350);
    return () => clearTimeout(timer);
  }, [index, replay]);

  const done = lines >= outputLines.length;

  return (
    <div className="rounded-2xl border border-border bg-[#080705] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div role="tablist" aria-label="Sample request" className="flex gap-0.5 p-2 border-b border-border">
        {RUNS.map((item, i) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => { setIndex(i); setReplay((n) => n + 1); }}
            className={`h-8 px-3 rounded-lg text-[13px] transition-colors ${
              i === index ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>
      <pre className="p-5 min-h-[310px] overflow-x-auto font-mono text-[12.5px] leading-[1.8] text-foreground/85">
        <span className="text-primary">$ </span>
        {run.command.slice(0, typed)}
        {typed < run.command.length && <span className="inline-block w-[7px] h-[14px] align-[-2px] bg-primary" />}
        {lines > 0 && "\n\n"}
        {outputLines.slice(0, lines).map((line, i) => (
          <span key={i} className="text-muted-foreground">
            {line.split(ADDRESS).map((part, j) =>
              ADDRESS.test(part) ? <span key={j} className="text-primary">{part}</span> : part
            )}
            {"\n"}
          </span>
        ))}
      </pre>
      <div className="flex items-center justify-between gap-3 px-5 h-11 border-t border-border text-[13px] text-muted-foreground">
        <span>Sample output. Nothing is sent.</span>
        <button
          type="button"
          onClick={() => setReplay((n) => n + 1)}
          disabled={!done}
          className="text-foreground disabled:text-muted-foreground hover:text-primary transition-colors"
        >
          Run again
        </button>
      </div>
    </div>
  );
}
