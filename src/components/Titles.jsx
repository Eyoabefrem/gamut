import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles = { '/studio': 'Studio', '/library': 'Library', '/explore': 'Explore', '/login': 'Log in' }

// Keeps the browser tab title in step with the page.
export default function Titles() {
  const { pathname } = useLocation()
  useEffect(() => {
    const p = pathname.replace(/\/$/, '') || '/'
    document.title = p === '/' ? 'Gamut - palettes that hold together' : `${titles[p] || (p.startsWith('/p/') ? 'Palette' : 'Not found')} | Gamut`
  }, [pathname])
  return null
}
