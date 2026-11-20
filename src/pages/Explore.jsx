import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Header from '../components/Header'
import { useAuth } from '../lib/auth'
import { configured } from '../lib/supabase'
import { listPublic, myLikes, like, unlike } from '../lib/cloud'

export default function Explore() {
  const { user } = useAuth()
  const [sort, setSort] = useState('top')
  const [items, setItems] = useState(null)
  const [mine, setMine] = useState(new Set())
  const [err, setErr] = useState('')

  useEffect(() => { if (!configured) return setItems([]); setItems(null); listPublic(sort).then(setItems).catch((e) => { setErr(e.message); setItems([]) }) }, [sort])
  useEffect(() => { if (!user) return setMine(new Set()); myLikes(user.id).then((ids) => setMine(new Set(ids))).catch(() => {}) }, [user])

  const toggle = async (p) => {
    if (!user) return setErr('Log in to like palettes.')
    setErr('')
    const liked = mine.has(p.id), next = new Set(mine)
    liked ? next.delete(p.id) : next.add(p.id)
    setMine(next)
    setItems(items.map((x) => (x.id === p.id ? { ...x, like_count: Math.max(0, x.like_count + (liked ? -1 : 1)) } : x)))
    try { liked ? await unlike(p.id, user.id) : await like(p.id) }
    catch (e) { setErr(e.message); setMine(mine); listPublic(sort).then(setItems).catch(() => {}) }
  }
  const tab = (k) => `px-3 sm:px-4 py-2 font-bold border-2 border-[var(--ink)] text-sm sm:text-base ${sort === k ? 'bg-[var(--ink)] text-[var(--paper)]' : ''}`

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <h1 className="display text-4xl sm:text-5xl md:text-6xl">Explore</h1>
        <p className="mt-3 text-base sm:text-lg max-w-xl" style={{ color: 'var(--muted)' }}>Palettes people chose to share. Open one in the studio and make it yours.</p>
        <div className="flex gap-2 mt-5 sm:mt-6">
          <button onClick={() => setSort('top')} className={tab('top')}>Most liked</button>
          <button onClick={() => setSort('new')} className={tab('new')}>Newest</button>
        </div>
        {err && <p role="alert" className="mt-4 font-semibold text-sm sm:text-base" style={{ color: 'var(--m)' }}>{err}</p>}

        {items === null ? <p className="mt-8" style={{ color: 'var(--muted)' }}>Loading</p> : !items.length ? (
          <div className="border-2 border-[var(--ink)] p-8 sm:p-10 mt-8 text-center">
            <p className="display text-2xl sm:text-3xl">{configured ? 'No public palettes yet' : 'Explore needs accounts'}</p>
            <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>{configured ? 'Make one of yours public from your Library and it will appear here.' : 'Add your Supabase keys to see shared palettes.'}</p>
            <Link to="/library" className="btn mt-6">Go to your library</Link>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {items.map((p) => (
              <li key={p.id} className="border-2 border-[var(--ink)]">
                <Link to={`/studio#${p.colors.map((c) => c.slice(1)).join('-')}`} aria-label={`Open ${p.name} in the studio`} className="flex h-28 sm:h-32">
                  {p.colors.map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}
                </Link>
                <div className="flex items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 border-t-2 border-[var(--ink)]">
                  <Link to={`/p/${p.id}`} className="display text-lg sm:text-xl truncate hover:underline underline-offset-4">{p.name}</Link>
                  <button onClick={() => toggle(p)} aria-pressed={mine.has(p.id)} aria-label={`${mine.has(p.id) ? 'Unlike' : 'Like'} ${p.name}`} className="flex items-center gap-1.5 font-bold shrink-0">
                    <Heart size={18} fill={mine.has(p.id) ? 'var(--m)' : 'none'} style={{ color: mine.has(p.id) ? 'var(--m)' : 'inherit' }} />{p.like_count}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
