import type { ReactNode } from 'react'
import { Reveal } from '../reflection/Reveal'

interface SourceBlockProps {
  id: string
  index: string
  title: string
  intro?: ReactNode
  children: ReactNode
}

/** One numbered part of the Sources & Credits section: a sticky heading column beside its content. */
export function SourceBlock({ id, index, title, intro, children }: SourceBlockProps) {
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="grid scroll-mt-24 gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16 lg:pt-14"
    >
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <p className="label text-gold">{index}</p>
        <h3 id={headingId} className="mt-3 font-serif text-[2rem] font-light leading-[1.05] text-parchment">
          {title}
        </h3>
        {intro && <div className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{intro}</div>}
      </Reveal>
      <Reveal delay={0.08} className="min-w-0">
        {children}
      </Reveal>
    </section>
  )
}
