import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'Provide ?url=' });
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }});
    const html = await r.text();
    const $ = cheerio.load(html);
    const meta = (n:string)=> $(`meta[property='${n}']`).attr('content') || $(`meta[name='${n}']`).attr('content') || '';
    const title = meta('og:title') || $('title').text();
    const description = meta('og:description') || meta('description') || '';
    const site = meta('og:site_name') || new URL(url).hostname;
    const blurb = description.length ? description.slice(0, 240) : '';
    res.status(200).json({ title, description: blurb, site });
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch metadata' });
  }
}
