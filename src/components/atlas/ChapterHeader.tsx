import { forwardRef, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Globe } from 'lucide-react'
import { useAtlas } from '../../state/atlas'
import { periods } from '../../data'
import { accentText, fadeRise, pad2 } from './atlasUi'

interface ChapterHeaderProps {
  /** Mode switch + fullscreen, placed on the kicker row. */
  controls: ReactNode
  /** Smaller title and no subtitle (phones while the story sheet is open). */
  compact: boolean
  /** Fade the title out (phones while the expanded sheet covers it), keeping only the kicker row. */
  hideTitle?: boolean
}

interface HeaderText {
  key: string
  kicker: string
  /** Compact kicker for phones, where the mode switch shares the row. */
  shortKicker: string
  /** Second half of the kicker (dates); drops to its own line on phones. */
  detail?: string
  title: string
  subtitle?: string
}

/**
 * Top-left title block over the map: kicker, oversized serif title, subtitle. Shows an introduction in
 * the overview, the period on timeline focus, and the chapter otherwise.
 */
export const ChapterHeader = forwardRef<HTMLDivElement, ChapterHeaderProps>(function ChapterHeader(
  { controls, compact, hideTitle = false },
  ref,
) {
  const { state, view, dispatch } = useAtlas()
  const { focus } = state
  const tone = view.tone

  let text: HeaderText
  if (focus.kind === 'overview') {
    text = {
      key: 'overview',
      kicker: 'Episode IV',
      shortKicker: 'Episode IV',
      detail: 'Over the Rainbow',
      title: 'The Atlas',
      subtitle:
        'Places and themes connected to Episode IV. Select a location, follow the timeline, or take the guided journey.',
    }
  } else if (focus.kind === 'period') {
    const index = periods.findIndex((p) => p.id === view.period.id)
    text = {
      key: `period-${view.period.id}`,
      kicker: `Timeline ${pad2(index + 1)} / ${pad2(periods.length)}`,
      shortKicker: `Era ${pad2(index + 1)} / ${pad2(periods.length)}`,
      detail: view.period.years,
      title: view.period.label,
    }
  } else {
    const { chapter } = view
    text = {
      key: `chapter-${chapter.id}`,
      kicker: `Chapter ${pad2(view.chapterNumber)} / ${pad2(view.chapterCount)}`,
      shortKicker: `Ch. ${pad2(view.chapterNumber)} / ${pad2(view.chapterCount)}`,
      detail: chapter.dateRange || undefined,
      title: chapter.title,
      subtitle: chapter.subtitle || undefined,
    }
  }

  const motionProps = fadeRise(tone, 14, 0.8)
  const showActions = focus.kind !== 'overview' && !compact

  /* The header is a size container: the long kicker and the full mode-switch labels appear only when the
     header itself is wide enough (not just the viewport), so a tablet with the story panel open gets the
     compact phone row instead of overlapping controls. Title swaps fade in without waiting on an exit. */
  return (
    <div
      ref={ref}
      className="@container pointer-events-none absolute left-4 right-[calc(var(--atlas-right-inset)+1rem)] top-[calc(var(--atlas-nav)+1rem)] z-20 transition-[right] duration-700 ease-cinema md:left-10 md:right-[calc(var(--atlas-right-inset)+1.5rem)] md:top-[calc(var(--atlas-nav)+1.5rem)] xl:left-14"
    >
      <div className="flex items-start justify-between gap-3">
        <motion.p key={text.key} {...motionProps} className={`label min-w-0 flex-1 pt-2.5 leading-relaxed tracking-[0.22em] @min-[40rem]:tracking-[var(--tracking-label)] ${accentText(tone)}`}>
          <span className="whitespace-nowrap @min-[40rem]:hidden">{text.shortKicker}</span>
          {/* The separator stays glued to the kicker, so a wrapped date never starts its line with a bullet. */}
          <span className="hidden whitespace-nowrap @min-[40rem]:inline">
            {text.kicker}
            {text.detail && ' ·'}
          </span>
          {text.detail && (
            <>
              {' '}
              <span className="block @min-[40rem]:inline @min-[40rem]:whitespace-nowrap">{text.detail}</span>
            </>
          )}
        </motion.p>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2">{controls}</div>
      </div>

      <div className={`transition-opacity duration-500 ease-cinema ${hideTitle ? 'opacity-0' : 'opacity-100'}`}>
        <motion.div key={text.key} {...motionProps} className="mt-2 max-w-[44rem] md:mt-3">
          <h2
            className={`text-balance font-serif font-light leading-[0.98] tracking-[-0.01em] text-parchment ${
              compact ? 'text-[1.75rem]' : 'text-[clamp(2rem,1.1rem+2.7vw,3.75rem)]'
            }`}
          >
            {text.title}
          </h2>
          {text.subtitle && !compact && (
            <p className="mt-3 max-w-[38rem] text-pretty font-serif text-lg italic leading-snug text-parchment/75 md:text-xl">
              {text.subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {showActions && (
        <div className="pointer-events-auto mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {state.panel === null && (
            <HeaderAction
              reopen
              onClick={() => dispatch({ type: 'SHOW_CHAPTER_PANEL' })}
              icon={<BookOpen className="size-3.5" />}
            >
              Chapter guide
            </HeaderAction>
          )}
          <HeaderAction onClick={() => dispatch({ type: 'RESET_VIEW' })} icon={<Globe className="size-3.5" />}>
            All places
          </HeaderAction>
        </div>
      )}
    </div>
  )
})

function HeaderAction({
  onClick,
  icon,
  children,
  reopen = false,
}: {
  onClick: () => void
  icon: ReactNode
  children: ReactNode
  /** Marks the button that reopens the story panel (focus returns here when the panel closes). */
  reopen?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-panel-reopen={reopen ? '' : undefined}
      className="label inline-flex items-center gap-2 py-1.5 text-[0.625rem] text-mist transition-colors duration-300 hover:text-parchment [&_svg]:stroke-[1.5]"
    >
      <span aria-hidden="true">{icon}</span>
      {children}
    </button>
  )
}
