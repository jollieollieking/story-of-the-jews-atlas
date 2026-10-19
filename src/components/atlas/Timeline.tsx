import { forwardRef, useEffect, useRef, type KeyboardEvent } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAtlas } from '../../state/atlas'
import { chapters, periods } from '../../data'
import type { Chapter } from '../../types'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { EASE_CINEMA, mediumPeriodLabel, pad2, shortPeriodLabel } from './atlasUi'
import { GuidedProgress } from './GuidedProgress'

/**
 * Bottom rail: previous/next chapter controls flanking the six historical periods. In guided mode a
 * seven-segment progress bar sits above. The active period carries a gold indicator that glides along
 * the rail. Periods form a radio group with arrow-key roving focus.
 */
export const Timeline = forwardRef<HTMLDivElement, { narrow: boolean }>(function Timeline({ narrow }, ref) {
  const { state, view, dispatch } = useAtlas()
  const overview = state.focus.kind === 'overview'
  const index = chapters.findIndex((c) => c.id === view.chapter.id)
  const prev: Chapter | undefined = overview ? undefined : chapters[index - 1]
  const next: Chapter | undefined = overview ? chapters[0] : chapters[index + 1]

  const goPrev = () => dispatch({ type: 'PREV_CHAPTER' })
  const goNext = () => (overview ? dispatch({ type: 'GO_TO_CHAPTER', id: chapters[0].id }) : dispatch({ type: 'NEXT_CHAPTER' }))

  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
      {/* Scrim that fades the map into the rail; decorative and outside the measured height. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-full h-16 bg-linear-to-t from-ink/85 to-transparent" />
      <div className="pointer-events-auto bg-ink/85 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-[2px] md:px-6 md:pb-5 xl:px-10">
        {state.mode === 'guided' && <GuidedProgress />}
        <div className="flex items-stretch gap-1 md:gap-4">
          <ChapterStep direction="prev" chapter={prev} onClick={goPrev} narrow={narrow} />
          <PeriodRail narrow={narrow} />
          <ChapterStep direction="next" chapter={next} onClick={goNext} narrow={narrow} />
        </div>
      </div>
    </div>
  )
})

function ChapterStep({
  direction,
  chapter,
  onClick,
  narrow,
}: {
  direction: 'prev' | 'next'
  chapter?: Chapter
  onClick: () => void
  narrow: boolean
}) {
  const isPrev = direction === 'prev'
  const Icon = isPrev ? ChevronLeft : ChevronRight
  const verb = isPrev ? 'Previous chapter' : 'Next chapter'
  const tooltip = chapter ? `${verb}: Chapter ${pad2(chapter.number)}, ${chapter.title}` : undefined

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!chapter}
      title={narrow ? undefined : tooltip}
      className={`group flex shrink-0 items-center gap-3 text-mist transition-colors duration-300 enabled:hover:text-parchment disabled:opacity-30 ${
        narrow ? 'w-10 justify-center' : 'w-10 justify-center xl:w-44 xl:justify-start'
      } ${isPrev ? '' : 'flex-row-reverse xl:justify-start xl:text-right'}`}
    >
      <span className="grid size-9 shrink-0 place-items-center border border-line-strong transition-colors duration-300 group-enabled:group-hover:border-gold-dim">
        <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
      </span>
      {/* The button's name is its text: visible from xl, screen-reader only below (and on phones). */}
      <span className={narrow ? 'sr-only' : 'sr-only min-w-0 xl:not-sr-only xl:block'}>
        <span className="label block text-[0.625rem] text-ash">
          {isPrev ? 'Previous' : 'Next'}
          <span className="sr-only"> chapter</span>
          {chapter ? ` · ${pad2(chapter.number)}` : <span className="sr-only"> (none)</span>}
        </span>
        {chapter && (
          <span className="mt-1 line-clamp-2 font-serif text-[0.95rem] leading-[1.15] text-parchment/80 group-enabled:group-hover:text-parchment">
            {' '}
            {chapter.title}
          </span>
        )}
      </span>
    </button>
  )
}

function PeriodRail({ narrow }: { narrow: boolean }) {
  const { state, view, dispatch } = useAtlas()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const scroller = useRef<HTMLDivElement>(null)
  const overview = state.focus.kind === 'overview'
  const activeIndex = overview ? -1 : periods.findIndex((p) => p.id === state.periodId)
  const solemn = view.tone === 'solemn'
  const reduceMotion = usePrefersReducedMotion()

  /* Keep the active period in view on the scrolling phone rail (without scrolling the page). */
  useEffect(() => {
    const el = refs.current[activeIndex]
    const box = scroller.current
    if (!narrow || !el || !box) return
    const left = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2
    box.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [activeIndex, narrow, reduceMotion])

  const select = (i: number) => {
    dispatch({ type: 'SELECT_PERIOD', id: periods[i].id })
    refs.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = Math.max(0, activeIndex)
    const last = periods.length - 1
    const target =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? Math.min(last, activeIndex < 0 ? 0 : from + 1)
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? Math.max(0, from - 1)
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (target === null) return
    e.preventDefault()
    select(target)
  }

  return (
    <LayoutGroup id="atlas-timeline">
      <div
        ref={scroller}
        role="radiogroup"
        aria-label="Timeline of historical periods"
        onKeyDown={onKeyDown}
        className={`relative flex min-w-0 flex-1 ${
          narrow ? 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : ''
        }`}
      >
        {periods.map((p, i) => {
          const checked = i === activeIndex
          const focusable = checked || (activeIndex < 0 && i === 0)
          return (
            <button
              key={p.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${p.years}: ${p.label}`}
              tabIndex={focusable ? 0 : -1}
              onClick={() => select(i)}
              className={`group relative flex flex-col justify-start border-t text-left transition-colors duration-500 ${
                narrow ? 'min-w-[8.25rem] shrink-0 snap-center px-3 pb-1 pt-3 focus-visible:outline-offset-[-3px]' : 'min-w-0 flex-1 px-3 pb-1 pt-3.5 xl:px-4'
              } ${checked ? 'border-transparent' : 'border-line-strong hover:border-parchment/40'}`}
            >
              {/* Tick mark rising from the rail. */}
              <span
                aria-hidden="true"
                className={`absolute -top-[5px] left-3 h-[9px] w-px xl:left-4 ${checked ? 'bg-transparent' : 'bg-parchment/35'}`}
              />
              {checked && (
                <motion.span
                  layoutId="period-indicator"
                  aria-hidden="true"
                  transition={{ duration: solemn ? 1.1 : 0.7, ease: EASE_CINEMA }}
                  className={`absolute -top-px left-0 right-0 h-[2px] ${solemn ? 'bg-memorial' : 'bg-gold'}`}
                >
                  <span
                    className={`absolute -top-[4px] left-3 size-[10px] rotate-45 border xl:left-4 ${
                      solemn ? 'border-memorial bg-ink' : 'border-gold bg-ink'
                    }`}
                  />
                </motion.span>
              )}
              <span
                className={`label block text-[0.625rem] transition-colors duration-500 ${narrow ? 'whitespace-nowrap' : 'xl:whitespace-nowrap'} ${
                  checked ? (solemn ? 'text-memorial' : 'text-gold') : 'text-mist group-hover:text-parchment/80'
                }`}
              >
                {p.years}
              </span>
              <span
                className={`mt-1 font-serif leading-[1.15] transition-colors duration-500 ${
                  narrow ? 'block truncate text-[0.95rem]' : 'line-clamp-2 text-balance text-[0.95rem] xl:text-[1.05rem]'
                } ${checked ? 'text-parchment' : 'text-parchment/60 group-hover:text-parchment/85'}`}
              >
                {narrow ? (
                  shortPeriodLabel(p.id, p.label)
                ) : (
                  <>
                    {/* Full labels only where they fit (very wide screens); shorter descriptive forms below. */}
                    <span className="xl:hidden">{shortPeriodLabel(p.id, p.label)}</span>
                    <span className="hidden xl:inline min-[106.25rem]:hidden">{mediumPeriodLabel(p.id, p.label)}</span>
                    <span className="hidden min-[106.25rem]:inline">{p.label}</span>
                  </>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
