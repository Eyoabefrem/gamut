// Three overlapping inks, mixing like a print.
export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="cmy">
      <circle cx="12.5" cy="12.5" r="9" fill="var(--c)" />
      <circle cx="19.5" cy="12.5" r="9" fill="var(--m)" />
      <circle cx="16" cy="19.5" r="9" fill="var(--y)" />
    </svg>
  )
}
export default function Logo({ size = 28 }) {
  return <span className="inline-flex items-center gap-2.5"><Mark size={size} /><span className="display text-2xl">gamut</span></span>
}
