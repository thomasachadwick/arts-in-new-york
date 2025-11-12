import React, { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { CalendarDays, Filter, Star, Clock, MapPin, Music4, Theater, BookOpen } from 'lucide-react';

type EventItem = { id: string; title: string; org?: string; genre: 'Opera'|'Classical'|'Theater'|'Dance'|'Jazz'|'Other'; venue?: string; url: string; date: string; startTime?: string; };
type Grouped = { key: string; title: string; venue?: string; org?: string; genre: EventItem['genre']; events: EventItem[] };

const GENRES = ['All','Opera','Classical','Theater','Dance','Jazz'] as const;

function formatDate(iso: string) { const d = new Date(iso); return d.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' }); }
function getWeekRangeFromToday(){ const now=new Date(); const day=now.getDay(); const monday=new Date(now); const diff=(day===0?-6:1)-day; monday.setDate(now.getDate()+diff); monday.setHours(0,0,0,0); const start=new Date(now); start.setHours(0,0,0,0); const sunday=new Date(monday); sunday.setDate(monday.getDate()+6); sunday.setHours(23,59,59,999); return {start, end:sunday, labelStart:start, labelEnd:sunday}; }

function Badge({ children }:{children: React.ReactNode}){ return <span className='px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200'>{children}</span>; }

function ProductionCard({ g }:{ g: Grouped }){
  const upcoming = g.events.filter(e => new Date(e.date) >= new Date(new Date().toDateString()));
  return (<a href={g.events[0]?.url || '#'} target='_blank' rel='noreferrer' className='block group'>
    <div className='rounded-2xl p-4 shadow-sm border border-gray-200 bg-white hover:shadow-md transition'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-semibold group-hover:underline'>{g.title}</h3>
          <div className='mt-1 text-sm text-gray-600 flex flex-wrap gap-2 items-center'>
            {g.org && <Badge>{g.org}</Badge>}
            {g.genre && <Badge><span className='inline-flex items-center gap-1'><Music4 className='w-3 h-3'/>{g.genre}</span></Badge>}
            {g.venue && <span className='inline-flex items-center gap-1'><MapPin className='w-4 h-4'/>{g.venue}</span>}
          </div>
        </div>
      </div>
      <div className='mt-3 flex flex-wrap gap-2'>
        {upcoming.slice(0,6).map(e => (<span key={e.id} className='text-xs px-2 py-1 rounded-md bg-indigo-50 border border-indigo-200'>{formatDate(e.date)}{e.startTime?` · ${e.startTime}`:''}</span>))}
        {upcoming.length>6 && <span className='text-xs text-indigo-600'>+{upcoming.length-6} more</span>}
      </div>
    </div>
  </a>);
}

export default function Home(){
  const [tab, setTab] = useState<'week'|'calendar'|'reviews'>('week');
  const [genre, setGenre] = useState<string>('All');
  const [query, setQuery] = useState<string>('');
  const [groups, setGroups] = useState<Grouped[]>([]);

  const week = useMemo(()=>getWeekRangeFromToday(),[]);
  useEffect(()=>{ fetch('/api/events').then(r=>r.json()).then(j=>setGroups(j.groups||[])).catch(()=>setGroups([])); },[]);

  const filtered = useMemo(()=>{
    return groups.filter(g=>{
      const passGenre = genre==='All' || g.genre===genre;
      const q = query.toLowerCase();
      const passQuery = !q || [g.title,g.org,g.venue,g.genre].join(' ').toLowerCase().includes(q);
      const within = g.events.some(e=>{ const d=new Date(e.date); return d>=week.start && d<=week.end; });
      return passGenre && passQuery && (tab!=='week' || within);
    });
  },[groups, genre, query, tab, week]);

  const weekLabel = `${week.labelStart.toLocaleDateString(undefined,{month:'short',day:'numeric'})} – ${week.labelEnd.toLocaleDateString(undefined,{month:'short',day:'numeric'})}`;

  return (<div className='min-h-screen bg-gray-50'>
    <Head><title>Arts in New York</title></Head>
    <header className='sticky top-0 z-10 backdrop-blur bg-white/80 border-b'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-9 h-9 rounded-2xl bg-black text-white grid place-items-center'>NY</div>
          <div><h1 className='text-xl font-bold leading-tight'>Arts in New York</h1><p className='text-xs text-gray-500 -mt-1'>Concerts · Opera · Theater · Dance</p></div>
        </div>
        <nav className='flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-xl'>
          <button onClick={()=>setTab('week')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='week'?'bg-white shadow':''}`}><CalendarDays className='w-4 h-4'/>This Week</button>
          <button onClick={()=>setTab('calendar')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='calendar'?'bg-white shadow':''}`}>Calendar</button>
          <button onClick={()=>setTab('reviews')} className={`px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-2 ${tab==='reviews'?'bg-white shadow':''}`}><BookOpen className='w-4 h-4'/>Reviews</button>
        </nav>
      </div>
    </header>

    <main className='max-w-6xl mx-auto px-4 py-6 space-y-6'>
      {tab!=='reviews' && (<div className='flex flex-wrap items-center gap-3'>
        <div className='inline-flex items-center gap-2 border rounded-xl px-3 py-2 bg-white'>
          <Filter className='w-4 h-4'/>
          <select className='outline-none' value={genre} onChange={(e)=>setGenre(e.target.value)}>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='Search title, org, venue…' className='flex-1 min-w-[220px] border rounded-xl px-3 py-2 bg-white' />
      </div>)}

      {tab==='week' && (<section><h2 className='text-lg font-semibold mb-3'>This Week (from today): {weekLabel}</h2>
        <div className='grid md:grid-cols-2 gap-4'>{filtered.length ? filtered.map(g => <ProductionCard key={g.key} g={g} />) : (<div className='text-sm text-gray-600'>No events match your filters for the remainder of this week.</div>)}</div>
      </section>)}

      {tab==='calendar' && (<section><h2 className='text-lg font-semibold mb-3'>All Upcoming Productions</h2>
        <div className='grid md:grid-cols-2 gap-4'>{groups.length ? groups.map(g => <ProductionCard key={g.key} g={g} />) : (<div className='text-sm text-gray-600'>No events available yet. Ensure feeds are configured.</div>)}</div>
      </section>)}

      {tab==='reviews' && (<section><h2 className='text-lg font-semibold mb-3'>Reviews</h2><p className='text-sm text-gray-600'>Add review links per production to show brief metadata here.</p></section>)}
    </main>

    <footer className='border-t bg-white'><div className='max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500'>V3: Grouped productions, today-forward week, venue allowlist, RSS/ICS ingestion (env-configured).</div></footer>
  </div>);
}