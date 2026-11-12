const TAIL_CHARS = "abcdefghijkmnpqrstuvwxyz23456789";
const DEFAULT_LABEL = "netflix";

export function slugLabel(value) {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || DEFAULT_LABEL;
}

export function randomTail(length) {
  return Array.from({ length }, () => TAIL_CHARS[Math.floor(Math.random() * TAIL_CHARS.length)]).join("");
}

export function aliasAddress(label, tail) {
  return `${label}.${tail}@ghstmail.space`;
}

export function formatTimeLeft(ms) {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${pad(minutes)}m ${pad(seconds % 60)}s left`;
}
