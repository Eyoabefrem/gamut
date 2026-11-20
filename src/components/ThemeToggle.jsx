import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
    setDark(next)
  }
  return (
    <button onClick={toggle} className="flex items-center gap-2 border-2 border-[var(--ink)] px-3 py-1.5 text-sm font-semibold hover:bg-[var(--y)] hover:text-[#111] transition">
      {dark ? <Sun size={15} /> : <Moon size={15} />}{dark ? 'Light' : 'Dark'}
    </button>
  )
}
