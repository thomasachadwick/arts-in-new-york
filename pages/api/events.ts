import type { NextApiRequest, NextApiResponse } from 'next';
import { dedupeEvents } from '../../lib/dedupe';
import type { EventItem } from '../../lib/types';

async function fromMock(): Promise<EventItem[]> {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ingest/mock`);
  const j = await r.json();
  return j.events || [];
}

async function fromTicketmaster(): Promise<EventItem[]> {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ingest/ticketmaster`);
  const j = await r.json();
  return j.events || [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [a,b] = await Promise.allSettled([fromMock(), fromTicketmaster()]);
    const events = dedupeEvents([...(a.status==='fulfilled'?a.value:[]), ...(b.status==='fulfilled'?b.value:[])]);
    res.status(200).json({ events });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'Failed to aggregate events' });
  }
}
