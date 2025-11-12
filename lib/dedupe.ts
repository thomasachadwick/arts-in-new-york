import type { EventItem } from './types';
function norm(s: string | undefined) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
export function dedupeEvents(list: EventItem[]): EventItem[] {
  const seen = new Map<string, EventItem>();
  for (const e of list) {
    const key = `${norm(e.title)}|${norm(e.venue)}|${e.date}`;
    if (!seen.has(key)) {
      seen.set(key, e);
    } else {
      const prev = seen.get(key)!;
      const reviews = [...(prev.reviews||[]), ...(e.reviews||[])];
      seen.set(key, { ...prev, ...e, reviews });
    }
  }
  return Array.from(seen.values()).sort((a,b)=> (a.date + (a.startTime||'')).localeCompare(b.date + (b.startTime||'')));
}
