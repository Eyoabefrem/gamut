import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { sendCode, verifyCode } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const send = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Enter a valid email address.')
    setBusy(true); setErr('')
    const m = await sendCode(email.trim())
    setBusy(false); m ? setErr(m) : setSent(true)
  }
  const verify = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const m = await verifyCode(email.trim(), code.trim())
    setBusy(false); m ? setErr(m) : nav('/library')
  }
  const field = 'w-full border-2 border-[var(--ink)] bg-transparent px-4 py-3 text-base sm:text-lg font-semibold mt-1 outline-none focus:border-[var(--m)]'

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto px-5 py-10 sm:py-16">
        <h1 className="display text-3xl sm:text-4xl md:text-5xl">{sent ? 'Check your email' : 'Keep your palettes everywhere'}</h1>
        <p className="mt-4 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>{sent ? `We sent a code to ${email.trim()}. Enter it below.` : "Enter your email and we\u2019ll send you a code. New here? That creates your account."}</p>
        {!sent ? (
          <form onSubmit={send} className="mt-6 sm:mt-8 space-y-4">
            <label className="block font-semibold">Email<input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus /></label>
            {err && <p role="alert" className="font-semibold text-sm sm:text-base" style={{ color: 'var(--m)' }}>{err}</p>}
            <button disabled={busy} className="btn w-full disabled:opacity-60">{busy ? 'Sending' : 'Send code'}</button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-6 sm:mt-8 space-y-4">
            <label className="block font-semibold">Code<input className={`${field} text-center text-xl sm:text-2xl tracking-[.3em]`} inputMode="numeric" maxLength={10} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} autoFocus /></label>
            {err && <p role="alert" className="font-semibold text-sm sm:text-base" style={{ color: 'var(--m)' }}>{err}</p>}
            <button disabled={busy || code.length < 6} className="btn w-full disabled:opacity-60">{busy ? 'Checking' : 'Verify and continue'}</button>
            <button type="button" onClick={() => { setSent(false); setCode(''); setErr('') }} className="w-full font-semibold underline underline-offset-4 py-2">Use a different email</button>
          </form>
        )}
      </main>
    </div>
  )
}
