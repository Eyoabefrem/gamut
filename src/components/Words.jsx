import { motion, useReducedMotion } from 'framer-motion'

// Headline that rises word by word on load: the one orchestrated moment.
export default function Words({ text }) {
  const reduce = useReducedMotion()
  return text.split(' ').map((w, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom pr-[.2em] pb-[.08em]">
      <motion.span className="inline-block" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.08 * i, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>{w}</motion.span>
    </span>
  ))
}
