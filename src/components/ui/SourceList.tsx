import type { Source, SourceKind } from '../../types'
import { ExternalLink } from './ExternalLink'

const KIND_LABEL: Record<SourceKind, string> = {
  documentary: 'Documentary',
  transcript: 'Transcript',
  institutional: 'Institution',
  encyclopedia: 'Encyclopedia',
  archive: 'Archive',
  dataset: 'Dataset',
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** A numbered list of sources. Numbers match the superscript citations on key facts. */
export function SourceList({ sources, className = '' }: { sources: Source[]; className?: string }) {
  if (sources.length === 0) return null
  return (
    <ol className={`space-y-4 ${className}`}>
      {sources.map((s, i) => (
        <li key={s.id} className="grid grid-cols-[2rem_1fr] gap-x-2">
          <span aria-hidden="true" className="label pt-1 text-[0.625rem] text-gold-dim">
            {pad2(i + 1)}
          </span>
          <div className="min-w-0">
            <ExternalLink href={s.url} className="font-serif text-[1.0625rem] leading-snug text-parchment">
              {s.title}
            </ExternalLink>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-mist">
              {s.publisher}
              <span className="text-ash"> · {KIND_LABEL[s.kind]}</span>
            </p>
            {s.usedFor && <p className="mt-0.5 text-[0.75rem] leading-relaxed text-ash">{s.usedFor}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
