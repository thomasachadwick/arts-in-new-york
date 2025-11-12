# Arts in New York — v3
**What’s new**
- Grouped “Production” cards (one per title+venue) with next showtimes
- Week view starts from today (no past days in the current week)
- Venue allowlist (filters to your curated NYC venues)
- Authoritative ingestion via RSS/ICS (configured via env var)

## Configure CMS & NY Phil
Vercel → Project → **Settings → Environment Variables**

**Key:** `FEEDS_JSON`  
**Value (JSON):**
```
[
  { "type":"ics", "url":"<PASTE NY PHIL ICS URL>", "genre":"Classical", "org":"New York Philharmonic", "venue":"David Geffen Hall", "source":"NY Phil (ICS)" },
  { "type":"rss", "url":"<PASTE CMS RSS URL>", "genre":"Classical", "org":"Chamber Music Society of Lincoln Center", "venue":"Alice Tully Hall", "source":"CMS (RSS)" }
]
```
Then **Redeploy**. Add more feeds as needed.

## Endpoint
- `GET /api/events` → `{ groups: [...] }`

## Local Dev
```bash
npm install
npm run dev
```
