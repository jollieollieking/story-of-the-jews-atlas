import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useAtlas } from '../../state/atlas'
import { chapters, periods, places, placesById } from '../../data'
import { accentText, pad2 } from './atlasUi'
import { ChapterFooter, PanelBar, PlaceList } from './panelParts'
import { useHeadingFocus } from './panelFocus'

/** Panel view 'chapter': the guided narration for a chapter, or a timeline period overview. */
export function ChapterPanel() {
  const { state } = useAtlas()
  return state.focus.kind === 'period' ? <PeriodBody /> : <ChapterBody />
}

function ChapterBody() {
  const { state, view } = useAtlas()
  const heading = useRef<HTMLHeadingElement>(null)
  useHeadingFocus(heading)
  const { chapter, tone } = view
  const solemn = chapter.tone === 'solemn'
  const chapterPlaces = chapter.placeIds.map((id) => placesById[id])

  return (
    <>
      <PanelBar label="Chapter guide" />
      <div className="px-5 pb-8 pt-6 md:px-7 md:pt-7">
        <p className={`label ${accentText(tone)}`}>
          Chapter {pad2(view.chapterNumber)} / {pad2(view.chapterCount)}
          {state.mode === 'guided' && <span className="text-ash"> · Guided journey</span>}
        </p>
        <h3
          ref={heading}
          tabIndex={-1}
          className="mt-3 text-balance font-serif text-[2rem] font-light leading-[1.05] text-parchment focus:outline-none md:text-[2.25rem]"
        >
          {chapter.title}
        </h3>
        {chapter.dateRange && <p className="label mt-3 text-[0.625rem] text-mist">{chapter.dateRange}</p>}

        {solemn && (
          <p className="mt-5 border-l border-memorial/60 pl-4 text-[0.875rem] leading-relaxed text-memorial">
            This chapter discusses the Holocaust.
          </p>
        )}

        {chapter.summary && (
          <p className="mt-6 text-pretty text-[0.9375rem] leading-[1.75] text-parchment/85">{chapter.summary}</p>
        )}

        {chapterPlaces.length > 0 && (
          <div className="mt-8">
            <p className="label mb-1 text-[0.625rem] text-ash">
              {chapterPlaces.length === 1 ? 'Place in this chapter' : `${chapterPlaces.length} places in this chapter`}
            </p>
            <PlaceList places={chapterPlaces} label={`Places in Chapter ${pad2(chapter.number)}`} />
          </div>
        )}

        <ChapterFooter />
      </div>
    </>
  )
}

function PeriodBody() {
  const { view, dispatch } = useAtlas()
  const heading = useRef<HTMLHeadingElement>(null)
  useHeadingFocus(heading)
  const { period, tone } = view
  const index = periods.findIndex((p) => p.id === period.id)

  /* Group the places lit for this period by chapter, in chapter order (matches the map's highlight). */
  const groups = chapters
    .map((chapter) => ({ chapter, places: places.filter((p) => p.chapterId === chapter.id && p.periodIds.includes(period.id)) }))
    .filter((g) => g.places.length > 0 || period.chapterIds.includes(g.chapter.id))

  return (
    <>
      <PanelBar label="Timeline period" />
      <div className="px-5 pb-8 pt-6 md:px-7 md:pt-7">
        <p className={`label ${accentText(tone)}`}>
          Timeline {pad2(index + 1)} / {pad2(periods.length)} · {period.years}
        </p>
        <h3
          ref={heading}
          tabIndex={-1}
          className="mt-3 text-balance font-serif text-[2rem] font-light leading-[1.05] text-parchment focus:outline-none md:text-[2.25rem]"
        >
          {period.label}
        </h3>
        {period.description && (
          <p className="mt-5 text-pretty text-[0.9375rem] leading-[1.75] text-parchment/85">{period.description}</p>
        )}
        {period.chapterIds.includes('destruction') && (
          <p className="mt-5 border-l border-memorial/60 pl-4 text-[0.875rem] leading-relaxed text-memorial">
            This period covers the Holocaust.
          </p>
        )}

        <div className="mt-8 space-y-8">
          {groups.map(({ chapter, places: groupPlaces }) => (
            <section key={chapter.id} aria-labelledby={`period-chapter-${chapter.id}`}>
              <div className="mb-2 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="label text-[0.625rem] text-ash">Chapter {pad2(chapter.number)}</p>
                  <p id={`period-chapter-${chapter.id}`} className="mt-1 font-serif text-[1.25rem] leading-tight text-parchment">
                    {chapter.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'GO_TO_CHAPTER', id: chapter.id })}
                  aria-label={`Open Chapter ${pad2(chapter.number)}: ${chapter.title}`}
                  className="label inline-flex shrink-0 items-center gap-1.5 py-1.5 text-[0.625rem] text-gold transition-colors hover:text-gold-soft"
                >
                  Open chapter <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-3" />
                </button>
              </div>
              <PlaceList places={groupPlaces} label={`Places from Chapter ${pad2(chapter.number)} in this period`} />
            </section>
          ))}
        </div>

        <ChapterFooter />
      </div>
    </>
  )
}
