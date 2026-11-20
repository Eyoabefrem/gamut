import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-24 text-center">
        <p className="display text-[clamp(6rem,22vw,12rem)]">404</p>
        <h1 className="display text-3xl">Out of gamut</h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--muted)' }}>This page doesn’t exist.</p>
        <Link to="/" className="btn mt-8">Back home</Link>
      </main>
    </div>
  )
}
