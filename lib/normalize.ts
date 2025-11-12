import type { EventItem } from './types';
export function toISODate(d: Date) { return d.toISOString().slice(0,10); }
export function pad2(n:number){ return String(n).padStart(2,'0'); }
export function toHM(d: Date){ return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }
export function normTitle(s?: string){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim(); }
export function normVenue(s?: string){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
export function groupKey(e: EventItem){ return `${normTitle(e.title)}|${normVenue(e.venue)}`; }