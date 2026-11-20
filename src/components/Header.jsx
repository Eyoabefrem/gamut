import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../lib/auth'

const link = ({ isActive }) => `hover:underline underline-offset-4 ${isActive ? 'underline' : ''}`

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="max-w-6xl mx-auto px-5 sm:px-8 py-5 border-b-2 border-[var(--ink)]">
      <div className="flex items-center justify-between">
        <Link to="/" onClick={close}><Logo /></Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4 sm:gap-5 font-semibold">
          <NavLink to="/studio" className={link}>Studio</NavLink>
          <NavLink to="/explore" className={link}>Explore</NavLink>
          <NavLink to="/library" className={link}>Library</NavLink>
          {user ? <button onClick={logout} className="hover:underline underline-offset-4">Log out</button> : <NavLink to="/login" className={link}>Log in</NavLink>}
          <ThemeToggle />
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="sm:hidden p-1" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="sm:hidden flex flex-col gap-4 pt-5 pb-2 font-semibold border-t-2 border-[var(--line)] mt-5">
          <NavLink to="/studio" className={link} onClick={close}>Studio</NavLink>
          <NavLink to="/explore" className={link} onClick={close}>Explore</NavLink>
          <NavLink to="/library" className={link} onClick={close}>Library</NavLink>
          {user ? <button onClick={() => { logout(); close() }} className="hover:underline underline-offset-4 text-left">Log out</button> : <NavLink to="/login" className={link} onClick={close}>Log in</NavLink>}
          <ThemeToggle />
        </nav>
      )}
    </header>
  )
}
