/** Tiny gold mark: a surveyed point inside a hairline ring, echoing the atlas markers. */
export function GoldMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-gold ${className}`}>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  )
}

/** Serif wordmark with a small-caps feel. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <GoldMark />
      <span className="whitespace-nowrap font-serif text-[0.8rem] font-medium uppercase leading-none tracking-[0.12em] text-parchment min-[400px]:text-[0.95rem] min-[400px]:tracking-[0.16em]">
        The Story <span className="italic lowercase tracking-[0.04em] text-gold-soft">of the</span> Jews
      </span>
    </span>
  )
}
