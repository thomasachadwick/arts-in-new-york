import ical from 'ical';
import { toISODate, toHM } from '../normalize';
import type { EventItem } from '../types';

export async function fetchICS(url: string, defaults: Partial<EventItem>): Promise<EventItem[]> {
  const res = await fetch(url, { headers: { 'user-agent': 'ArtsInNYC/0.3 (+https://example.com)' } });
  if (!res.ok) throw new Error(`ICS fetch failed ${res.status}`);
  const text = await res.text();
  const data = ical.parseICS(text);

  const out: EventItem[] = [];
  for (const k in data) {
    const ev: any = data[k];
    if (!ev || ev.type !== 'VEVENT') continue;
    const start: Date = ev.start instanceof Date ? ev.start : new Date(ev.start);
    const end: Date = ev.end instanceof Date ? ev.end : new Date(ev.end);
    const title = ev.summary || defaults.title || 'Untitled';
    const venue = ev.location || defaults.venue;
    const url = ev.url || defaults.url || '#';

    out.push({
      id: `${defaults.source||'ics'}-${k}`,
      title,
      url,
      date: toISODate(start),
      startTime: toHM(start),
      endTime: toHM(end),
      genre: (defaults.genre||'Other') as EventItem['genre'],
      venue,
      org: defaults.org,
      source: defaults.source || 'ics'
    });
  }
  return out;
}