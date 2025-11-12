# Arts in New York — MVP

A minimal Next.js + Tailwind app for NYC arts listings: This Week, Calendar, Reviews, and Venues (tabbed).

## Local Dev
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy on Vercel (Free)
1. Push this folder to a GitHub repo (or upload directly in Vercel).
2. In Vercel, **New Project** → import the repo.
3. Framework preset: **Next.js**. No extra env vars needed.
4. Deploy → you’ll get a free URL like `https://arts-in-new-york.vercel.app`.

## Next Steps
- Replace `MOCK_EVENTS` with real feeds (Ticketmaster/Eventbrite/org RSS).
- Add a `/api/ingest` route and a DB (Supabase) for persistence & dedupe.
- Reviews: store `source`, `headline`, `url` only; link out to read.
