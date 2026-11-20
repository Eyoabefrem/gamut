import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../lib/auth'

const link = ({ isActive }) => `hover:underline underline-offset-4 ${isActive ? 'underline' : ''}`

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between border-b-2 border-[var(--ink)]">
      <Link to="/"><Logo /></Link>
      <nav className="flex items-center gap-4 sm:gap-5 font-semibold">
        <NavLink to="/studio" className={link}>Studio</NavLink>
        <NavLink to="/explore" className={link}>Explore</NavLink>
        <NavLink to="/library" className={link}>Library</NavLink>
        {user ? <button onClick={logout} className="hover:underline underline-offset-4">Log out</button> : <NavLink to="/login" className={link}>Log in</NavLink>}
        <ThemeToggle />
      </nav>
    </header>
  )
}
