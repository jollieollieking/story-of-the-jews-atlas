import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAtlas } from '../../state/atlas'
import { ChapterPanel } from './ChapterPanel'
import { PlacePanel } from './PlacePanel'
import { EASE_CINEMA } from './atlasUi'
import { PANEL_ATTR } from './panelFocus'
import { GuidedFooter } from './panelParts'

interface StoryPanelProps {
  narrow: boolean
  /** Desktop panel width in px. */
  width: number
  /** Phone bottom-sheet heights in px. */
  sheetHeight: { collapsed: number; expanded: number }
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

/**
 * The story panel: a right-hand side panel from `md` up, a bottom sheet with collapsed/expanded states
 * on phones. Shows the chapter (or period) view, or a place's story card.
 */
export function StoryPanel({ narrow, width, sheetHeight, expanded, onExpandedChange }: StoryPanelProps) {
  const { state, view } = useAtlas()
  const scroller = useRef<HTMLDivElement>(null)
  const place = view.selectedPlace
  const showPlace = (state.panel === 'place' || state.panel === 'comparison') && place !== null

  const contentKey = showPlace
    ? `place-${place.id}`
    : state.focus.kind === 'period'
      ? `period-${state.periodId}`
      : `chapter-${state.chapterId}`
  const solemn = view.tone === 'solemn'

  /* A new view resets the scroll position before it paints. */
  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [contentKey])

  /* Enter-only fade: the outgoing view is swapped out at once, so new content never waits on an exit
     animation (on a busy main thread an exit can stall and leave the panel blank). */
  const body = (
    <>
      <div ref={scroller} className="scroll-elegant min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <motion.div
          key={contentKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: solemn ? 0.9 : 0.5, ease: EASE_CINEMA } }}
        >
          {showPlace ? <PlacePanel place={place} /> : <ChapterPanel />}
        </motion.div>
      </div>
      {/* Guided journey: Continue / Complete stays pinned below the scroll area, always in view. */}
      {state.mode === 'guided' && !showPlace && <GuidedFooter />}
    </>
  )

  return (
    <AnimatePresence>
      {state.panel !== null &&
        (narrow ? (
          <MobileSheet key="sheet" heights={sheetHeight} expanded={expanded} onExpandedChange={onExpandedChange}>
            {body}
          </MobileSheet>
        ) : (
          <motion.aside
            key="side"
            {...{ [PANEL_ATTR]: '' }}
            aria-label="Story panel"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.35 } }}
            transition={{ duration: solemn ? 1 : 0.7, ease: EASE_CINEMA }}
            style={{ width }}
            className="absolute bottom-[calc(var(--atlas-timeline-h)+0.5rem)] right-4 top-[calc(var(--atlas-nav)+1rem)] z-[21] flex flex-col border border-line-strong bg-ink-2/95 backdrop-blur-sm"
          >
            <div aria-hidden="true" className={`h-px w-16 shrink-0 ${solemn ? 'bg-memorial/60' : 'bg-gold'}`} />
            {body}
          </motion.aside>
        ))}
    </AnimatePresence>
  )
}

function MobileSheet({
  heights,
  expanded,
  onExpandedChange,
  children,
}: {
  heights: { collapsed: number; expanded: number }
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: ReactNode
}) {
  const { dispatch } = useAtlas()
  const drag = useRef<{ y: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [dragDy, setDragDy] = useState(0)

  const base = expanded ? heights.expanded : heights.collapsed
  const height = Math.max(96, Math.min(heights.expanded + 24, base - dragDy))

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = { y: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return
    const dy = e.clientY - drag.current.y
    if (Math.abs(dy) > 6) drag.current.moved = true
    if (drag.current.moved) setDragDy(dy)
  }
  const onPointerEnd = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    drag.current = null
    setDragDy(0)
    if (!d?.moved) return
    suppressClick.current = true
    const dy = e.clientY - d.y
    if (dy < -40) onExpandedChange(true)
    else if (dy > 40) {
      if (expanded) onExpandedChange(false)
      else dispatch({ type: 'CLOSE_PANEL' })
    }
  }

  return (
    <motion.aside
      {...{ [PANEL_ATTR]: '' }}
      aria-label="Story panel"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, ease: EASE_CINEMA }}
      style={{ height }}
      className={`absolute inset-x-0 bottom-[var(--atlas-timeline-h)] z-30 flex flex-col border-t border-line-strong bg-ink-2/95 shadow-[0_-24px_48px_rgba(0,0,0,0.45)] backdrop-blur-sm ${
        dragDy === 0 ? 'transition-[height] duration-500 ease-cinema' : ''
      }`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse story panel' : 'Expand story panel'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false
            return
          }
          onExpandedChange(!expanded)
        }}
        className="flex h-6 w-full shrink-0 touch-none items-center justify-center"
      >
        <span aria-hidden="true" className="h-[3px] w-10 rounded-full bg-parchment/30" />
      </button>
      {children}
    </motion.aside>
  )
}
