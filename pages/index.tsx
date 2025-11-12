import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { CalendarDays, Filter, Star, Clock, MapPin, Music4, Theater, BookOpen, MapPinned, Building2 } from 'lucide-react';
import type { EventItem } from '../lib/types';
import venuesData from '../data/venues.json';

const GENRES = ['All','Opera','Classical','Theater','Dance','Jazz'] as const;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function getThisWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return { start: monday, end: sunday };
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{children}</span>; }

function EventCard({ e }: { e: EventItem }) {
  return (
    <a href={e.url} target="_blank" rel="noreferrer" className="block group">
      <div className="rounded-2xl p-4 shadow-sm border border-gray-200 bg-white hover:shadow-md transition">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold group-hover:underline">{e.title}</h3>
            <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-2 items-center">
              <Badge>{e.org}</Badge>
              <Badge><span className="inline-flex items-center gap-1"><Music4 className="w-3 h-3"/>{e.genre}</span></Badge>
              {e.date && <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4"/>{formatDate(e.date)} {e.startTime?`· ${e.startTime}`:''}</span>}
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4"/>{e.venue}</span>
              {e.price && <Badge>{e.price}</Badge>}
              {e.source && <Badge>src:{e.source}</Badge>}
            </div>
          </div>
          {e.reviews?.length ? (
            <div className="flex items-center gap-1 text-amber-600"><Star className="w-4 h-4"/><span className="text-sm font-medium">{e.reviews.length} review{e.reviews.length>1?'s':''}</span></div>
          ) : null}
        </div>
        {e.blurb && <p className="mt-2 text-sm text-gray-700">{e.blurb}</p>}
      </div>
    </a>
  );
}

function Filters({ selectedGenre, setSelectedGenre, query, setQuery }:{selectedGenre: string; setSelectedGenre: (s:string)=>void; query: string; setQuery: (s:string)=>void;}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
        <Filter className="w-4 h-4"/>
        <select className="outline-none" value={selectedGenre} onChange={(e)=>setSelectedGenre(e.target.value)}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search title, org, venue…" className="flex-1 min-w-[220px] border rounded-xl px-3 py-2 bg-white" />
    </div>
  );
}

function CalendarMonth({ events }:{ events: EventItem[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const cells:(Date|null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  const byDay: Record<string, EventItem[]> = events.reduce((acc: Record<string, EventItem[]>, e) => {
    const key = e.date;
    acc[key] = acc[key] || [];
    acc[key].push(e); return acc;
  }, {});
  return (
    <div className="grid grid-cols-7 gap-2">
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-xs text-gray-500 font-medium px-1">{d}</div>)}
      {cells.map((d, i) => {
        const iso = d ? d.toISOString().slice(0,10) : '';
        const dayEvents = byDay[iso] || [];
        return (
          <div key={i} className={`min-h-[92px] rounded-xl border ${d?'bg-white':'bg-gray-50'} p-2` }>
            <div className="text-xs text-gray-500">{d ? d.getDate() : ''}</div>
            <div className="mt-1 flex flex-col gap-1">
              {dayEvents.slice(0,3).map((e) => (
                <a key={e.id} href={e.url} target="_blank" rel="noreferrer" className="block text-[11px] truncate px-2 py-1 rounded-md bg-indigo-50 border border-indigo-200 hover:bg-indigo-100">{e.title}</a>
              ))}
              {dayEvents.length > 3 && <div className="text-[11px] text-indigo-600">+ {dayEvents.length - 3} more</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VenueCard({ v }:{ v: any }) {
  return (
    <a href={v.url} target="_blank" rel="noreferrer" className="block group">
      <div className="rounded-2xl p-4 shadow-sm border border-gray-200 bg-white hover:shadow-md transition">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white grid place-items-center"><Building2 className="w-5 h-5"/></div>
          <div>
            <h3 className="text-base font-semibold group-hover:underline">{v.name}</h3>
            <div className="mt-1 text-xs text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center gap-1"><MapPinned className="w-3.5 h-3.5"/>{v.hood}</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{v.desc}</p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [tab, setTab] = useState<'week'|'calendar'|'reviews'|'venues'>('week');
  const [genre, setGenre] = useState<string>('All');
  const [query, setQuery] = useState<string>('');
  const [venueTab, setVenueTab] = useState<keyof typeof venuesData>('Classical & Opera');
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch('/api/events').then(r=>r.json()).then(j=>setEvents(j.events||[])).catch(()=>setEvents([]));
  }, []);

  const weekRange = useMemo(() => getThisWeekRange(), []);
  const filtered = useMemo(() => {
    return events.filter(e => {
      const passGenre = genre === 'All' || e.genre === genre;
      const q = query.toLowerCase();
      const passQuery = !q || [e.title, e.org, e.venue, e.neighborhood||'', e.genre].join(' ').toLowerCase().includes(q);
      if (tab === 'week') {
        const d = new Date(e.date);
        return passGenre && passQuery && d >= weekRange.start && d <= weekRange.end;
      }
      return passGenre && passQuery;
    }).sort((a,b) => (a.date + (a.startTime||'')).localeCompare(b.date + (b.startTime||'')));
  }, [genre, query, tab, weekRange, events]);

  const weekLabel = `${weekRange.start.toLocaleDateString(undefined,{month:'short',day:'numeric'})} – ${weekRange.end.toLocaleDateString(undefined,{month:'short',day:'numeric'})}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head><title>Arts in New York</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>

      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-black text-white grid place-items-center">NY</div>
            <div><h1 className="text-xl font-bold leading-tight">Arts in New York</h1><p className="text-xs text-gray-500 -mt-1">Concerts · Opera · Theater · Dance</p></div>
          </div>
          <nav className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button onClick={()=>setTab('week')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='week'?'bg-white shadow':''}`}><CalendarDays className="w-4 h-4"/>This Week</button>
            <button onClick={()=>setTab('calendar')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='calendar'?'bg-white shadow':''}`}>Calendar</button>
            <button onClick={()=>setTab('reviews')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='reviews'?'bg-white shadow':''}`}><BookOpen className="w-4 h-4"/>Reviews</button>
            <button onClick={()=>setTab('venues')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='venues'?'bg-white shadow':''}`}><Theater className="w-4 h-4"/>Venues</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {tab !== 'venues' && (<Filters selectedGenre={genre} setSelectedGenre={setGenre} query={query} setQuery={setQuery} />)}

        {tab === 'week' && (<section><h2 className="text-lg font-semibold mb-3">Week of {weekLabel}</h2>
          <div className="grid md:grid-cols-2 gap-4">{filtered.length ? filtered.map(e => <EventCard key={e.id} e={e} />) : (<div className="text-sm text-gray-600">No events match your filters this week.</div>)}</div>
        </section>)}

        {tab === 'calendar' && (<section className="space-y-4"><h2 className="text-lg font-semibold">Calendar</h2><CalendarMonth events={filtered} /></section>)}

        {tab === 'reviews' && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">This Week&apos;s Reviews</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.filter(e=>e.reviews?.length).map(e => (
                <div key={e.id} className="rounded-2xl p-4 shadow-sm border border-gray-200 bg-white">
                  <h3 className="text-base font-semibold">{e.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(e.date)} · {e.venue}</p>
                  <ul className="mt-3 space-y-2">
                    {e.reviews!.map((r, i) => (
                      <li key={i}>
                        <a href={`/api/reviews/og?url=${encodeURIComponent(r.url)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100">
                          <Star className="w-4 h-4"/> {r.outlet}: {r.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">Click a review to see headline/summary metadata (we only store links).</p>
                </div>
              ))}
              {filtered.filter(e=>e.reviews?.length).length === 0 && (<div className="text-sm text-gray-600">No linked reviews yet. They&apos;ll appear here automatically when we ingest press links.</div>)}
            </div>
          </section>
        )}

        {tab === 'venues' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Venues</h2>
              <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                {Object.keys(venuesData).map((k)=> (
                  <button key={k} onClick={()=>setVenueTab(k as keyof typeof venuesData)} className={`px-3 py-1.5 rounded-lg text-sm ${venueTab===k? 'bg-white shadow':''}`}>{k}</button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {venuesData[venueTab].map((v:any,i:number)=> <VenueCard key={i} v={v} />)}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t bg-white"><div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500">MVP prototype — events aggregated from mock + Ticketmaster (if API key provided). Reviews show safe metadata only.</div></footer>
    </div>
  );
}
