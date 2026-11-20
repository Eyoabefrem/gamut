// The control strip printers put on the edge of a sheet. Gamut's signature divider.
const cells = ['var(--c)', 'var(--m)', 'var(--y)', 'var(--ink)', '#2e3192', '#ed1c24', '#00a651', '#7fd6f7', '#f580c5', '#fff27f', '#8a8a8a', '#cfcfcf']
export default function ColorBar({ className = '' }) {
  return <div aria-hidden="true" className={`flex ${className}`}>{cells.map((c, i) => <span key={i} className="flex-1 h-3" style={{ background: c }} />)}</div>
}
