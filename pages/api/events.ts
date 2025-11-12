import type { NextApiRequest, NextApiResponse } from 'next';
import type { EventItem } from '../../lib/types';
import { fetchRSS } from '../../lib/sources/rss';
import { fetchICS } from '../../lib/sources/ics';
import { getFeeds } from '../../lib/sources/config';
import { allowed } from '../../lib/allowlist';
import { groupKey } from '../../lib/normalize';

type Grouped = { key: string; title: string; venue?: string; org?: string; genre: EventItem['genre']; events: EventItem[] };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const feeds = getFeeds();
    const results = await Promise.allSettled(feeds.map(f => f.type==='rss' ? fetchRSS(f.url, f) : fetchICS(f.url, f)));
    let events: EventItem[] = [];
    for (const r of results) if (r.status==='fulfilled') events = events.concat(r.value);

    events = events.filter(e => !e.venue || allowed(e.venue));

    const by: Record<string, Grouped> = {};
    for (const e of events) {
      const k = groupKey(e);
      if (!by[k]) by[k] = { key: k, title: e.title, venue: e.venue, org: e.org, genre: e.genre, events: [] };
      by[k].events.push(e);
    }

    const groups = Object.values(by).map(g => {
      g.events.sort((a,b) => (a.date + (a.startTime||'')).localeCompare(b.date + (b.startTime||'')));
      return g;
    }).sort((a,b) => (a.events[0].date + (a.events[0].startTime||'')).localeCompare(b.events[0].date + (b.events[0].startTime||'')));

    res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=3600');
    res.status(200).json({ ok: true, count: events.length, groups });
  } catch (e:any) {
    res.status(200).json({ ok: false, error: String(e), groups: [] });
  }
}