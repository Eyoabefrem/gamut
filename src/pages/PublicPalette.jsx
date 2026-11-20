import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import { getOne, HEX } from '../lib/cloud'
import { readableOn } from '../lib/color'

export default function PublicPalette() {
  const { id } = useParams()
  const [p, setP] = useState(undefined) // undefined = loading, null = not found
  const [copied, setCopied] = useState(null)
  useEffect(() => { getOne(id).then((r) => { const ok = r && r.colors.every((c) => HEX.test(c)); setP(ok ? r : null); if (ok) document.title = `${r.name} | Gamut` }).catch(() => setP(null)) }, [id])
  const copy = async (hex) => { try { await navigator.clipboard.writeText(hex.toUpperCase()); setCopied(hex); setTimeout(() => setCopied(null), 1200) } catch {} }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {p === undefined ? <p style={{ color: 'var(--muted)' }}>Loading</p> : p === null ? (
          <div className="border-2 border-[var(--ink)] p-8 sm:p-10 text-center">
            <p className="display text-2xl sm:text-3xl">Private or missing</p>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>This palette doesn't exist, or its owner hasn't made it public.</p>
            <Link to="/studio" className="btn mt-6">Make your own</Link>
          </div>
        ) : (
          <>
            <h1 className="display text-3xl sm:text-4xl md:text-6xl">{p.name}</h1>
            {p.like_count > 0 && <p className="mt-3 font-semibold" style={{ color: 'var(--muted)' }}>{p.like_count} {p.like_count === 1 ? 'like' : 'likes'}</p>}
            <div className="flex flex-col md:flex-row border-2 border-[var(--ink)] md:h-[26rem] mt-6 sm:mt-8">
              {p.colors.map((c) => (
                <button key={c} onClick={() => copy(c)} className="flex-1 min-h-16 sm:min-h-24 p-3 sm:p-4 flex items-end display text-lg sm:text-2xl" style={{ background: c, color: readableOn(c) }} aria-label={`Copy ${c}`}>{copied === c ? 'Copied' : c.slice(1).toUpperCase()}</button>
              ))}
            </div>
            <Link to={`/studio#${p.colors.map((c) => c.slice(1)).join('-')}`} className="btn mt-6">Open in the studio</Link>
          </>
        )}
      </main>
    </div>
  )
}
