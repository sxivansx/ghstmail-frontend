export function filterAliases(aliases, query, status) {
  const needle = query.trim().toLowerCase();
  return aliases.filter((alias) => {
    if (status === "active" && !alias.is_active) return false;
    if (status === "paused" && alias.is_active) return false;
    if (!needle) return true;
    return alias.address.toLowerCase().includes(needle) || (alias.label || "").toLowerCase().includes(needle);
  });
}

export function expiryLabel(expiresAt, now) {
  if (!expiresAt) return "Never";
  const left = new Date(expiresAt).getTime() - now;
  if (left <= 0) return "Expired";
  const minutes = Math.floor(left / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days}d ${hours % 24}h left`;
  if (hours >= 1) return `${hours}h ${minutes % 60}m left`;
  return `${minutes}m left`;
}

export function forwardRate(alias) {
  const received = alias.emails_received || 0;
  if (!received) return null;
  return Math.min(1, (alias.emails_forwarded || 0) / received);
}

export function deliverySummary(aliases) {
  const received = aliases.reduce((sum, alias) => sum + (alias.emails_received || 0), 0);
  const forwarded = aliases.reduce((sum, alias) => sum + (alias.emails_forwarded || 0), 0);
  return {
    received,
    forwarded,
    stopped: Math.max(0, received - forwarded),
    rate: received ? Math.min(1, forwarded / received) : null,
  };
}

// One frame of the "decrypting" reveal: the first `revealed` characters are real, the
// rest are whatever `pick` returns. Dots and the @ stay put so it still reads as an email.
export function scrambleFrame(target, revealed, pick) {
  let frame = target.slice(0, revealed);
  for (let i = frame.length; i < target.length; i++) {
    frame += target[i] === "." || target[i] === "@" ? target[i] : pick();
  }
  return frame;
}

export function paginate(items, page, size) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * size;
  const slice = items.slice(start, start + size);
  return { items: slice, page: current, pages, from: slice.length ? start + 1 : 0, to: start + slice.length };
}

const SCOPE_AREAS = [
  ["aliases", "Aliases"],
  ["filters", "Filters"],
];

export function describeScopes(scopes) {
  const known = new Set(["messages:send"]);
  const parts = [];
  for (const [area, title] of SCOPE_AREAS) {
    const read = scopes.includes(`${area}:read`);
    const write = scopes.includes(`${area}:write`);
    known.add(`${area}:read`).add(`${area}:write`);
    if (read && write) parts.push(`${title}: read and write`);
    else if (read) parts.push(`${title}: read only`);
    else if (write) parts.push(`${title}: write only`);
  }
  if (scopes.includes("messages:send")) parts.push("Sends mail");
  return [...parts, ...scopes.filter((scope) => !known.has(scope))];
}
