"use client";

import { useEffect, useState } from "react";

// The "On this page" sidebar for the docs and legal pages. It is a client component
// only so it can mark the section you are reading.
export function SectionNav({ items }) {
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const first = items.find((item) => visible.get(item.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-130px 0px -55% 0px" }
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="hidden lg:block w-48 shrink-0">
      <div className="sticky top-24">
        <div className="text-sm font-medium text-foreground mb-3">On this page</div>
        <ul className="border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className={`block -ml-px border-l py-1.5 pl-4 text-sm transition-colors ${
                  active === item.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
