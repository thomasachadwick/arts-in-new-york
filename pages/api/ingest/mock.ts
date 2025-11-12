import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import type { EventItem } from '../../../lib/types';
import { dedupeEvents } from '../../../lib/dedupe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const file = path.join(process.cwd(), 'data', 'mock-events.json');
  const raw = fs.readFileSync(file, 'utf8');
  const events: EventItem[] = JSON.parse(raw);
  res.status(200).json({ events: dedupeEvents(events) });
}
