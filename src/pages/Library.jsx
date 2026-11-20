import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Globe, Lock, Link2 } from 'lucide-react'
import Header from '../components/Header'
import { useAuth } from '../lib/auth'
import { configured } from '../lib/supabase'
import { getLibrary, deletePalette, clearLibrary } from '../lib/library'
import { listMine, saveCloud, removeCloud, setPublic } from '../lib/cloud'

export default function Library() {
  const { user, loading } = useAuth()
  const [local, setLocal] = useState(getLibrary)
  const [cloud, setCloud] = useState([])
  const [err, setErr] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!user) { setCloud([]); return }
    listMine(user.id).then(setCloud).catch((e) => setErr(e.message))
  }, [user])

  const act = async (fn) => { setErr(''); try { await fn() } catch (e) { setErr(e.message) } }
  const items = user ? cloud : local.map((p) => ({ ...p, created_at: p.createdAt }))
  const remove = (id) => act(async () => { if (user) { await removeCloud(id); setCloud(cloud.filter((p) => p.id !== id)) } else setLocal(deletePalette(id)) })
  const toggle = (p) => act(async () => { const n = await setPublic(p.id, !p.is_public); setCloud(cloud.map((x) => (x.id === p.id ? n : x))) })
  const copyLink = async (p) => { try { await navigator.clipboard.writeText(`${location.origin}/p/${p.id}`); setNote('Public link copied') ; setTimeout(() => setNote(''), 1800) } catch {} }
  const importLocal = () => act(async () => {
    const added = []
    for (const p of [...local].reverse()) added.unshift(await saveCloud(p.name, p.colors))
    clearLibrary(); setLocal([]); setCloud([...added, ...cloud])
  })

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <h1 className="display text-4xl sm:text-5xl md:text-6xl">Library</h1>
        <p className="mt-3 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>{user ? `Palettes saved to ${user.email}.` : 'Palettes saved in this browser.'}</p>

        {!loading && !user && configured && <p className="border-2 border-[var(--ink)] p-3 sm:p-4 mt-6 font-semibold text-sm sm:text-base">Log in to keep your palettes on every device. <Link to="/login" className="underline underline-offset-4">Log in</Link></p>}
        {user && local.length > 0 && <p className="border-2 border-[var(--ink)] p-3 sm:p-4 mt-6 font-semibold text-sm sm:text-base">You have {local.length} {local.length === 1 ? 'palette' : 'palettes'} saved in this browser. <button onClick={importLocal} className="underline underline-offset-4">Import them to your account</button></p>}
        {err && <p role="alert" className="mt-4 font-semibold text-sm sm:text-base" style={{ color: 'var(--m)' }}>{err}</p>}
        <p className="h-6 mt-3 font-semibold text-sm sm:text-base" role="status">{note}</p>

        {!items.length ? (
          <div className="border-2 border-[var(--ink)] p-8 sm:p-10 mt-4 text-center">
            <p className="display text-2xl sm:text-3xl">Nothing saved yet</p>
            <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>Make a palette in the studio and press Save.</p>
            <Link to="/studio" className="btn mt-6">Open the studio</Link>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
            {items.map((p) => (
              <li key={p.id} className="border-2 border-[var(--ink)]">
                <Link to={`/studio#${p.colors.map((c) => c.slice(1)).join('-')}`} aria-label={`Open ${p.name}`} className="flex h-28 sm:h-32">
                  {p.colors.map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}
                </Link>
                <div className="p-3 sm:p-4 border-t-2 border-[var(--ink)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0"><b className="display text-lg sm:text-xl block truncate">{p.name}</b><span className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>{new Date(p.created_at).toLocaleDateString()}</span></span>
                    <button onClick={() => remove(p.id)} aria-label={`Delete ${p.name}`} className="p-1 shrink-0"><Trash2 size={18} /></button>
                  </div>
                  {user && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button onClick={() => toggle(p)} className="flex items-center gap-1.5 border-2 border-[var(--ink)] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold" style={p.is_public ? { background: 'var(--y)', color: '#111' } : {}}>
                        {p.is_public ? <Globe size={14} /> : <Lock size={14} />}{p.is_public ? 'Public' : 'Private'}
                      </button>
                      {p.is_public && <button onClick={() => copyLink(p)} className="flex items-center gap-1.5 border-2 border-[var(--ink)] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold"><Link2 size={14} />Copy link</button>}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
