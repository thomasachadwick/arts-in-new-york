import type { NextApiRequest, NextApiResponse } from 'next';
import { dedupeEvents } from '../../../lib/dedupe';
import type { EventItem } from '../../../lib/types';

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2/events.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = process.env.TM_API_KEY;
  if (!key) return res.status(200).json({ events: [], note: 'TM_API_KEY not set' });
  const city = 'New York';
  const classificationName = 'Arts & Theatre';
  const url = `${TM_BASE}?apikey=${key}&city=${encodeURIComponent(city)}&classificationName=${encodeURIComponent(classificationName)}&size=100`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    const events: EventItem[] = (data._embedded?.events||[]).map((ev:any) => {
      const name = ev.name || 'Event';
      const venue = ev._embedded?.venues?.[0]?.name || 'Venue';
      const localDate = ev.dates?.start?.localDate;
      const localTime = ev.dates?.start?.localTime || '';
      const url = ev.url;
      const genre = (ev.classifications?.[0]?.segment?.name === 'Arts & Theatre') ? 'Theater' : 'Classical';
      return {
        id: ev.id,
        title: name,
        org: ev.promoter?.name || 'Ticketmaster Listing',
        genre: genre as EventItem['genre'],
        venue,
        url,
        date: localDate,
        startTime: localTime,
        source: 'ticketmaster'
      };
    });
    res.status(200).json({ events: dedupeEvents(events) });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'Ticketmaster fetch failed' });
  }
}
