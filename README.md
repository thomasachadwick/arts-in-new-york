# Arts in New York — Next Steps Kit

This version adds serverless APIs for event ingestion and review metadata extraction.

## What’s New
- `/api/events` — aggregates events from multiple sources and returns a de-duplicated list.
- `/api/ingest/mock` — local mock events.
- `/api/ingest/ticketmaster` — optional Ticketmaster Discovery integration (`TM_API_KEY`).
- `/api/reviews/og?url=` — fetches Open Graph metadata for reviews.
- `/lib/dedupe.ts` — merges overlapping listings.
- `/data/venues.json` — your venue directory.

## Local Dev
```bash
npm install
cp .env.example .env.local  # optional: set TM_API_KEY
npm run dev
```

## Deploy on Vercel
- Push to GitHub → Import on Vercel.
- Add env var `TM_API_KEY` in **Settings → Environment Variables** (optional).
- Redeploy. `/api/events` includes Ticketmaster events if the key exists.
