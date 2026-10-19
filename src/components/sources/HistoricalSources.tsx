import { useMemo, useState, type ReactNode } from 'react'
import { chaptersById } from '../../data'
import type { ChapterId, Source } from '../../types'
import { ExternalLink } from './ExternalLink'
import { HISTORICAL_GROUPS, chaptersBySource, hostOf, pad2 } from './citations'

type Filter = ChapterId | 'all'

/** Historical references grouped by kind, each with the chapters that cite it, filterable by chapter. */
export function HistoricalSources({ sources }: { sources: Source[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const citedChapters = useMemo(() => {
    const set = new Set<ChapterId>()
    for (const s of sources) for (const c of chaptersBySource.get(s.id) ?? []) set.add(c)
    return Array.from(set).sort((a, b) => chaptersById[a].number - chaptersById[b].number)
  }, [sources])

  const visible = filter === 'all' ? sources : sources.filter((s) => chaptersBySource.get(s.id)?.includes(filter))
  const groups = HISTORICAL_GROUPS.map((g) => ({ ...g, items: visible.filter((s) => s.kind === g.kind) })).filter(
    (g) => g.items.length > 0,
  )
  const showFilter = sources.length >= 6 && citedChapters.length >= 2

  return (
    <div>
      {showFilter && (
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p id="source-filter-label" className="label text-mist">
              Filter by chapter
            </p>
            <div
              role="group"
              aria-labelledby="source-filter-label"
              className="-mx-1 flex flex-wrap gap-1.5 px-1"
            >
              <FilterButton pressed={filter === 'all'} onClick={() => setFilter('all')}>
                All
              </FilterButton>
              {citedChapters.map((id) => {
                const chapter = chaptersById[id]
                return (
                  <FilterButton
                    key={id}
                    pressed={filter === id}
                    onClick={() => setFilter(id)}
                    title={chapter.title}
                  >
                    <span className="sr-only">Chapter </span>
                    {pad2(chapter.number)}
                    <span className="sr-only">: {chapter.title}</span>
                  </FilterButton>
                )
              })}
            </div>
          </div>
          <p aria-live="polite" className="mt-4 text-sm text-mist">
            {filter === 'all' ? (
              <>
                {sources.length} historical sources
              </>
            ) : (
              <>
                {visible.length} of {sources.length} sources cited in{' '}
                <span className="text-parchment/90">
                  Chapter {pad2(chaptersById[filter].number)}: {chaptersById[filter].title}
                </span>
              </>
            )}
          </p>
        </div>
      )}

      <div className="space-y-14">
        {groups.map((group) => (
          <div key={group.kind}>
            <h4 className="label flex items-center gap-3 text-parchment/80">
              {group.label}
              <span aria-hidden="true" className="text-ash">{pad2(group.items.length)}</span>
              <span className="sr-only">({group.items.length} sources)</span>
            </h4>
            <ul className="mt-5 grid gap-x-10 md:grid-cols-2">
              {group.items.map((source) => (
                <SourceItem key={source.id} source={source} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterButton({
  pressed,
  onClick,
  title,
  children,
}: {
  pressed: boolean
  onClick: () => void
  title?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      title={title}
      className={`label min-w-11 border px-3 py-2 !tracking-[0.16em] transition-colors duration-500 ${
        pressed
          ? 'border-gold bg-gold/10 text-gold-soft'
          : 'border-line text-mist hover:border-line-strong hover:text-parchment'
      }`}
    >
      {children}
    </button>
  )
}

function SourceItem({ source }: { source: Source }) {
  const cited = chaptersBySource.get(source.id) ?? []
  return (
    <li className="flex flex-col border-t border-line py-6">
      <ExternalLink
        href={source.url}
        className="font-serif text-[1.3rem] font-normal leading-snug text-parchment hover:text-gold-soft"
      >
        {source.title}
      </ExternalLink>
      <p className="mt-1.5 text-sm text-mist">
        {source.publisher}
        <span aria-hidden="true" className="mx-2 text-line-strong">
          /
        </span>
        <span className="text-ash">{hostOf(source.url)}</span>
      </p>
      {source.usedFor && <p className="mt-3 text-sm leading-relaxed text-parchment/65">{source.usedFor}</p>}
      {cited.length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="label mr-1.5 !tracking-[0.2em] text-ash">Cited in</span>
          {cited.map((id, i) => {
            const chapter = chaptersById[id]
            return (
              <span
                key={id}
                title={chapter.title}
                className={`label border px-1.5 py-0.5 !tracking-[0.12em] ${
                  chapter.tone === 'solemn' ? 'border-memorial/30 text-memorial' : 'border-gold/30 text-gold'
                }`}
              >
                <span className="sr-only">
                  {i > 0 ? ', ' : ''}Chapter {chapter.number}, {chapter.title}
                </span>
                <span aria-hidden="true">Ch {pad2(chapter.number)}</span>
              </span>
            )
          })}
        </p>
      )}
    </li>
  )
}
