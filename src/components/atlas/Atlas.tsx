import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { AnimatePresence } from 'motion/react'
import { useAtlas } from '../../state/atlas'
import { chapters, comparison } from '../../data'
import { useIsNarrow } from '../../hooks/useMediaQuery'
import { scrollToSection } from '../../lib/scroll'
import { MapFallback } from '../map/MapFallback'
import { MapLoading } from '../map/MapLoading'
import { ChapterHeader } from './ChapterHeader'
import { ComparisonDialog } from './ComparisonDialog'
import { EntryPrompt } from './EntryPrompt'
import { FullscreenToggle } from './FullscreenToggle'
import { ModeSwitch } from './ModeSwitch'
import { StoryPanel } from './StoryPanel'
import { Timeline } from './Timeline'
import { hasComparisonContent } from './atlasUi'
import { useAtlasKeyboard } from './useAtlasKeyboard'
import { useFullscreen } from './useFullscreen'
import { useElementHeight, useViewportSize } from './useLayoutMetrics'
import { PANEL_ATTR } from './panelFocus'

/* MapLibre (the largest dependency) is split out of the entry bundle and fetched once the page is idle,
   or at once when the atlas scrolls into view, whichever comes first. */
const loadMapView = () => import('../map/MapView')
const MapView = lazy(() => loadMapView().then((m) => ({ default: m.MapView })))
/** Delay after load before the map is fetched and prepared in the background, so the hero gets the first seconds. */
const MAP_PREFETCH_DELAY = 3000

/** Renders the no-WebGL map if the map chunk itself cannot be loaded (e.g. the connection dropped). */
class MapChunkBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <MapFallback className="absolute inset-0" /> : this.props.children
  }
}

/** True once the atlas is on screen, or once the page has been idle a few seconds and the map chunk is in. Latched. */
function useMapWanted(section: RefObject<HTMLElement | null>) {
  const [wanted, setWanted] = useState(false)
  useEffect(() => {
    if (wanted) return
    let cancelled = false
    const want = () => {
      if (!cancelled) setWanted(true)
    }
    const root = section.current
    /* rootMargin stays 0: the atlas sits right below a 100dvh hero, so any margin would mount it at once. */
    const io =
      root && typeof IntersectionObserver === 'function'
        ? new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && want(), { rootMargin: '0px', threshold: 0.01 })
        : null
    if (root && io) io.observe(root)
    else want()
    let idleId = 0
    const timer = window.setTimeout(() => {
      const run = () => void loadMapView().then(want, () => {})
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(run, { timeout: 2000 })
      else run()
    }, MAP_PREFETCH_DELAY)
    return () => {
      cancelled = true
      io?.disconnect()
      window.clearTimeout(timer)
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId)
    }
  }, [section, wanted])
  return wanted
}

/** Height of the fixed site navigation that overlays the top of the section. */
const NAV_HEIGHT = 64
/** Gap between the header block and the visible map area. */
const HEADER_GAP = 12
/** Desktop story panel: width cap, share of the viewport, and margin from the right edge. */
const PANEL_MAX = 440
const PANEL_SHARE = 0.46
const PANEL_MARGIN = 16
/** Space kept above the expanded phone sheet for the header's kicker / mode-switch row. */
const SHEET_TOP_CLEARANCE = 64

/**
 * The interactive atlas stage: a full-viewport map with the chapter header, mode switch, story panel,
 * timeline rail and comparison dialog floating over it.
 *
 * Layout contract with MapView: this section publishes --atlas-top-inset, --atlas-bottom-inset and
 * --atlas-right-inset (px covered by UI), so the map can frame places in the visible area.
 */
export function Atlas() {
  const { state, view, dispatch } = useAtlas()
  const section = useRef<HTMLElement>(null)
  const narrow = useIsNarrow()
  const viewport = useViewportSize()
  const fullscreen = useFullscreen(section)
  const [headerRef, headerHeight] = useElementHeight<HTMLDivElement>()
  const [timelineRef, timelineHeight] = useElementHeight<HTMLDivElement>()
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [promptDismissed, setPromptDismissed] = useState(false)
  const mapWanted = useMapWanted(section)

  const panelOpen = state.panel !== null
  const comparisonOpen = state.panel === 'comparison' && state.selectedPlaceId !== null && hasComparisonContent(comparison)
  const overview = state.focus.kind === 'overview'

  /* ---- Layout insets ---------------------------------------------------------------------------- */
  const nav = fullscreen.active ? 0 : NAV_HEIGHT
  const panelWidth = Math.round(Math.min(PANEL_MAX, viewport.width * PANEL_SHARE))
  const sheet = {
    collapsed: Math.round(Math.min(300, viewport.height * 0.36)),
    /* Expanded, the sheet stops below the header's control row so the mode switch stays reachable. */
    expanded: Math.round(Math.min(viewport.height * 0.7, viewport.height - timelineHeight - nav - SHEET_TOP_CLEARANCE)),
  }
  const sheetHeight = narrow && panelOpen ? (sheetExpanded ? sheet.expanded : sheet.collapsed) : 0
  const topInset = nav + (narrow ? 16 : 24) + (headerHeight || (narrow ? 96 : 140)) + HEADER_GAP
  /* Never let the insets cross: with the phone sheet expanded the map is mostly covered, and keeping a thin
     band below the header stops map UI (legend, controls) from climbing into the header. */
  const bottomInset = Math.min((timelineHeight || (narrow ? 110 : 120)) + sheetHeight, viewport.height - topInset - 48)
  const rightInset = !narrow && panelOpen ? panelWidth + PANEL_MARGIN : 0

  const insets = {
    '--atlas-nav': `${nav}px`,
    '--atlas-top-inset': `${topInset}px`,
    '--atlas-bottom-inset': `${bottomInset}px`,
    '--atlas-right-inset': `${rightInset}px`,
    '--atlas-timeline-h': `${timelineHeight || 110}px`,
  } as CSSProperties

  /* Adjust state while rendering (no effect needed): the sheet always reopens collapsed, and once the
     visitor leaves the overview the entry prompt has done its job. */
  const [wasPanelOpen, setWasPanelOpen] = useState(panelOpen)
  if (wasPanelOpen !== panelOpen) {
    setWasPanelOpen(panelOpen)
    if (!panelOpen) setSheetExpanded(false)
  }
  if (!overview && !promptDismissed) setPromptDismissed(true)

  /* ---- Screen-reader announcement on chapter / period change ------------------------------------- */
  const focusKey = overview ? 'overview' : state.focus.kind === 'period' ? `period-${state.periodId}` : `chapter-${state.chapterId}`
  const [initialFocusKey] = useState(focusKey)
  const [hasMoved, setHasMoved] = useState(false)
  if (!hasMoved && focusKey !== initialFocusKey) setHasMoved(true)
  const announcement = !hasMoved
    ? ''
    : state.focus.kind === 'overview'
      ? 'Atlas overview: all places'
      : state.focus.kind === 'period'
        ? `Period ${view.period.years}: ${view.period.label}`
        : `Chapter ${view.chapterNumber} of ${view.chapterCount}: ${view.chapter.title}`

  /* ---- Journey completion hands off to the reflection section ------------------------------------ */
  const wasComplete = useRef(state.journeyComplete)
  const { exit: exitFullscreen } = fullscreen
  useEffect(() => {
    const becameComplete = state.journeyComplete && !wasComplete.current
    wasComplete.current = state.journeyComplete
    if (!becameComplete) return
    void exitFullscreen().then(() => requestAnimationFrame(() => scrollToSection('reflection')))
  }, [state.journeyComplete, exitFullscreen])

  /* ---- Keyboard ---------------------------------------------------------------------------------- */
  const onEscape = useCallback(() => {
    if (state.panel === 'comparison') {
      dispatch({ type: 'CLOSE_COMPARISON' })
      return true
    }
    if (state.panel !== null) {
      dispatch({ type: 'CLOSE_PANEL' })
      return true
    }
    if (fullscreen.pseudo) {
      void fullscreen.exit()
      return true
    }
    return false
  }, [state.panel, dispatch, fullscreen])

  useAtlasKeyboard(section, {
    onPrev: () => {
      if (!overview) dispatch({ type: 'PREV_CHAPTER' })
    },
    onNext: () => (overview ? dispatch({ type: 'GO_TO_CHAPTER', id: chapters[0].id }) : dispatch({ type: 'NEXT_CHAPTER' })),
    onEscape,
  })

  /* ---- Focus: return keyboard users to where they were when the story panel closes ---------------- */
  const returnFocus = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const root = section.current
    if (!root) return
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target
      if (t instanceof HTMLElement && t !== root && !t.closest(`[${PANEL_ATTR}], [role="dialog"]`)) returnFocus.current = t
    }
    root.addEventListener('focusin', onFocusIn)
    return () => root.removeEventListener('focusin', onFocusIn)
  }, [])

  const panelWasOpen = useRef(panelOpen)
  useEffect(() => {
    const closed = panelWasOpen.current && !panelOpen
    panelWasOpen.current = panelOpen
    if (!closed) return
    const raf = requestAnimationFrame(() => {
      const active = document.activeElement
      /* Focus is lost if it fell to <body> or is still on a control inside the exiting panel. */
      const lost = !active || active === document.body || (active instanceof HTMLElement && !!active.closest(`[${PANEL_ATTR}]`))
      if (!lost) return
      const root = section.current
      const last = returnFocus.current
      const target =
        (last && last.isConnected && last.getClientRects().length > 0 ? last : null) ??
        root?.querySelector<HTMLElement>('[data-panel-reopen]') ??
        root
      target?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(raf)
  }, [panelOpen])

  /* While the comparison dialog is open, everything else in the atlas is inert (aria-modal alone is not
     enforced by every browser / screen reader). The live region stays active. */
  useEffect(() => {
    const root = section.current
    if (!root || !comparisonOpen) return
    let others: HTMLElement[] = []
    /* Deferred a frame so the dialog's focus trap has recorded the element to return focus to (it cannot
       refocus an inert element). */
    const raf = requestAnimationFrame(() => {
      others = Array.from(root.children).filter(
        (el): el is HTMLElement => el instanceof HTMLElement && !el.querySelector('[role="dialog"]') && !el.matches('[aria-live]'),
      )
      /* The rest of the page too, including the fixed site nav: every sibling on the way up to <body>. */
      for (let node: HTMLElement | null = root; node && node !== document.body; node = node.parentElement) {
        for (const sib of Array.from(node.parentElement?.children ?? [])) {
          if (sib !== node && sib instanceof HTMLElement && !sib.inert && !(sib instanceof HTMLScriptElement)) others.push(sib)
        }
      }
      for (const el of others) el.inert = true
    })
    return () => {
      cancelAnimationFrame(raf)
      for (const el of others) el.inert = false
    }
  }, [comparisonOpen])

  const closeComparison = useCallback(() => dispatch({ type: 'CLOSE_COMPARISON' }), [dispatch])

  const showPrompt = overview && !panelOpen && !promptDismissed

  return (
    <section
      ref={section}
      id="atlas"
      aria-label="Interactive historical atlas"
      data-tone={view.tone}
      style={insets}
      tabIndex={-1}
      className={`isolate overflow-hidden bg-ink focus:outline-none ${
        fullscreen.pseudo ? 'fixed inset-0 z-[60] h-[100dvh]' : 'relative h-[100dvh] min-h-[600px]'
      }`}
    >
      {/* DOM order sets the Tab order: header, entry prompt, story panel, timeline, then the map and its
          markers/controls. Painting order comes from z-index (UI z-20+, scrim z-11, map UI z-10 and below),
          so rendering the map last does not lift it over the UI. */}
      <ChapterHeader
        ref={headerRef}
        compact={narrow && panelOpen}
        hideTitle={narrow && panelOpen && sheetExpanded}
        controls={
          <>
            <ModeSwitch />
            <FullscreenToggle fullscreen={fullscreen} />
          </>
        }
      />

      <AnimatePresence>{showPrompt && <EntryPrompt key="prompt" onExplore={() => setPromptDismissed(true)} />}</AnimatePresence>

      <StoryPanel
        narrow={narrow}
        width={panelWidth}
        sheetHeight={sheet}
        expanded={sheetExpanded}
        onExpandedChange={setSheetExpanded}
      />

      <Timeline ref={timelineRef} narrow={narrow} />

      {/* Top scrim so the header reads over any part of the map. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[11] h-[calc(var(--atlas-top-inset)+2rem)] bg-linear-to-b from-ink/90 via-ink/55 to-transparent"
      />

      {mapWanted ? (
        <MapChunkBoundary>
          <Suspense fallback={<MapLoading visible />}>
            <MapView className="absolute inset-0" />
          </Suspense>
        </MapChunkBoundary>
      ) : (
        <MapLoading visible />
      )}

      <AnimatePresence>{comparisonOpen && <ComparisonDialog key="comparison" onClose={closeComparison} />}</AnimatePresence>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  )
}
