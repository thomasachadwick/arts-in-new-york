import { parseStringPromise } from 'xml2js';
import { toISODate } from '../normalize';
import type { EventItem } from '../types';

export async function fetchRSS(url: string, defaults: Partial<EventItem>): Promise<EventItem[]> {
  const res = await fetch(url, { headers: { 'user-agent': 'ArtsInNYC/0.3 (+https://example.com)' } });
  if (!res.ok) throw new Error(`RSS fetch failed ${res.status}`);
  const xml = await res.text();
  const data = await parseStringPromise(xml, { explicitArray: false, trim: true });
  const items: any[] = data?.rss?.channel?.item || data?.feed?.entry || [];
  const arr = Array.isArray(items) ? items : [items].filter(Boolean);

  return arr.map((it: any, i: number) => {
    const title = it.title?._ || it.title || defaults.title || 'Untitled';
    const link = it.link?.href || it.link || it.guid || defaults.url || '#';
    const pub = it.pubDate || it.updated || it.published || new Date().toISOString();
    const date = toISODate(new Date(pub));
    const desc = (it.description || it.summary || '').replace(/<[^>]+>/g,'').slice(0, 240);
    return {
      id: `${defaults.source||'rss'}-${i}`,
      title,
      url: typeof link === 'object' ? (link._ || '#') : link,
      date,
      blurb: desc,
      genre: (defaults.genre||'Other') as EventItem['genre'],
      venue: defaults.venue,
      org: defaults.org,
      source: defaults.source || 'rss'
    } as EventItem;
  });
}