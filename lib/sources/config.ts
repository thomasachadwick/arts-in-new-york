export type Feed = { type: 'rss'|'ics'; url: string; genre: any; org?: string; venue?: string; source?: string };
export function getFeeds(): Feed[] {
  if (!process.env.FEEDS_JSON) return [];
  try { return JSON.parse(process.env.FEEDS_JSON) as Feed[]; } catch { return []; }
}