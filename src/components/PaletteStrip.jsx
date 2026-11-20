import { useState, useEffect, useCallback } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { generate, readableOn } from '../lib/color'

// The heart of Gamut: five colors, lock the ones you like, press space for the rest.
export default function PaletteStrip({ count = 5, className = 'md:h-[28rem]' }) {
  const [colors, setColors] = useState(() => generate(count))
  const [locks, setLocks] = useState(() => Array(count).fill(false))
  const [copied, setCopied] = useState(null)

  const regen = useCallback(() => setColors((c) => generate(count, c, locks)), [count, locks])
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(e.target.tagName)) return
      e.preventDefault(); regen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [regen])

  const copy = async (hex, i) => {
    try { await navigator.clipboard.writeText(hex); setCopied(i); setTimeout(() => setCopied(null), 1200) } catch {}
  }

  return (
    <div>
      <div className={`flex flex-col md:flex-row border-2 border-[var(--ink)] ${className}`}>
        {colors.map((hex, i) => {
          const ink = readableOn(hex)
          return (
            <div key={i} className="flex-1 min-h-16 sm:min-h-28 flex flex-row md:flex-col justify-between items-center md:items-start p-3 sm:p-4 transition-colors duration-500" style={{ background: hex, color: ink }}>
              <button onClick={() => setLocks(locks.map((l, j) => (j === i ? !l : l)))} aria-pressed={locks[i]} aria-label={`${locks[i] ? 'Unlock' : 'Lock'} color ${i + 1}`} className="p-2 -m-2 opacity-80 hover:opacity-100">
                {locks[i] ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
              <button onClick={() => copy(hex, i)} className="display text-lg sm:text-2xl text-left" aria-label={`Copy ${hex}`}>{copied === i ? 'Copied' : hex.slice(1).toUpperCase()}</button>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-5">
        <button onClick={regen} className="btn">Generate</button>
        <span className="text-sm sm:text-base" style={{ color: 'var(--muted)' }}>or press the space bar. Lock a color to keep it.</span>
      </div>
    </div>
  )
}
