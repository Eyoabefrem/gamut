import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Logo from '../components/Logo'
import ColorBar from '../components/ColorBar'
import Reveal from '../components/Reveal'
import Words from '../components/Words'
import PaletteStrip from '../components/PaletteStrip'

// Circles with crop marks and registration targets, the way a press proof is marked.
function PressProof() {
  return (
    <svg viewBox="0 0 460 460" className="w-full max-w-md mx-auto" role="img" aria-label="Cyan, magenta and yellow circles overlapping inside print crop marks">
      <g stroke="var(--ink)" strokeWidth="2" fill="none">
        <path d="M20 64V20h44M396 20h44v44M440 396v44h-44M64 440H20v-44" />
        <circle cx="230" cy="34" r="10" /><path d="M230 14v40M210 34h40" />
        <circle cx="230" cy="426" r="10" /><path d="M230 406v40M210 426h40" />
      </g>
      <g className="cmy drift">
        <circle cx="188" cy="188" r="92" fill="var(--c)" />
        <circle cx="272" cy="188" r="92" fill="var(--m)" />
        <circle cx="230" cy="262" r="92" fill="var(--y)" />
      </g>
    </svg>
  )
}

const Plate = ({ children }) => <div className="h-36 border-2 border-[var(--ink)] mb-5 overflow-hidden flex">{children}</div>
const features = [
  ['Pull colors from a photo', 'Drop in an image and Gamut finds the colors that carry it, ready to refine like any other palette.',
    <Plate>{['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'].map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}</Plate>],
  ['Check every pairing', 'See the contrast ratio between any two colors against accessibility guidelines, and preview the palette with color-blind vision.',
    <Plate><span className="flex-1 grid place-items-center" style={{ background: '#264653', color: '#e9c46a' }}><b className="display text-4xl">Aa</b></span><span className="flex-1 grid place-items-center display text-3xl">7.2:1</span></Plate>],
  ['Export anywhere', 'Copy CSS variables, a Tailwind theme or JSON, or save the palette as an image to share.',
    <Plate><code className="p-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>:root {'{'}<br />&nbsp;&nbsp;--color-1: #264653;<br />&nbsp;&nbsp;--color-2: #2a9d8f;<br />{'}'}</code></Plate>],
]

export default function Landing() {
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-5 sm:px-8">
        <section className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center pt-14 pb-14 sm:pt-20">
          <div>
            <p className="font-semibold" style={{ color: 'var(--muted)' }}>A palette studio for people who care how color behaves</p>
            <h1 className="display text-[clamp(2.5rem,5.6vw,4.9rem)] mt-5"><Words text="Palettes that hold together" /></h1>
            <p className="text-xl max-w-lg mt-7" style={{ color: 'var(--muted)' }}>Generate, lock and refine colors in your browser. Check contrast, preview color-blind vision, and export to CSS, Tailwind or an image.</p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link to="/studio" className="btn">Open the studio</Link>
              <a href="#try" className="btn btn-ghost">Try it below</a>
            </div>
          </div>
          <PressProof />
        </section>
        <ColorBar />

        <section id="try" className="py-16 scroll-mt-4">
          <Reveal>
            <p className="mb-4 font-semibold" style={{ color: 'var(--muted)' }}>Press the space bar. Lock the colors you want to keep.</p>
            <PaletteStrip className="md:h-[30rem]" />
          </Reveal>
        </section>

        <section className="py-20 border-t-2 border-[var(--ink)]">
          <Reveal>
            <p className="display text-3xl sm:text-5xl max-w-4xl">A good palette isn’t five nice colors. It’s five colors that agree.</p>
            <p className="text-lg max-w-xl mt-8" style={{ color: 'var(--muted)' }}>Gamut gives every color a job. Lighter ones carry the page, darker ones carry the text, and one or two do the shouting. You see how they work together before you commit.</p>
          </Reveal>
        </section>

        <section className="grid md:grid-cols-3 gap-10 py-16 border-t-2 border-[var(--ink)]">
          {features.map(([t, d, plate], i) => (
            <Reveal key={t} delay={i * 0.1}>
              <article>{plate}<h2 className="display text-2xl">{t}</h2><p className="mt-3 text-lg" style={{ color: 'var(--muted)' }}>{d}</p></article>
            </Reveal>
          ))}
        </section>
      </main>

      <section style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 flex flex-wrap items-center justify-between gap-8">
          <h2 className="display text-4xl sm:text-6xl max-w-2xl">Keep the ones you love</h2>
          <Link to="/studio" className="btn !bg-[var(--m)] !text-[#111] !border-[var(--paper)]">Open the studio</Link>
        </div>
      </section>
      <footer className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <ColorBar />
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm mt-6" style={{ color: 'var(--muted)' }}>
          <Logo size={22} /><span>Gamut is a color tool. Set in Syne and Hanken Grotesk.</span>
        </div>
      </footer>
    </div>
  )
}
