import { useCallback } from 'react'
import { useAtlas } from '../../state/atlas'
import { scrollToSection, type SectionId } from '../../lib/scroll'

/**
 * Scrolls to a page section and records it in the address bar without the browser's own jump,
 * so the link can be shared or bookmarked. `top` clears the hash.
 */
export function navigateToSection(id: SectionId) {
  if (document.getElementById(id)) {
    scrollToSection(id)
  } else if (id === 'top') {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  } else {
    return
  }
  const hash = id === 'top' ? '' : `#${id}`
  try {
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`)
  } catch {
    /* Some embedded browsers forbid history writes; scrolling already happened. */
  }
}

/** Starts the guided journey from Chapter 01 and brings the atlas into view. */
export function useStartGuidedJourney() {
  const { dispatch } = useAtlas()
  return useCallback(() => {
    dispatch({ type: 'START_GUIDED' })
    navigateToSection('atlas')
  }, [dispatch])
}

/** Primary site links shared by the top bar, the mobile sheet and the footer. */
export const SITE_LINKS = [
  { id: 'atlas', label: 'Atlas' },
  { id: 'reflection', label: 'Reflection' },
  { id: 'sources', label: 'Sources & Credits' },
] as const satisfies readonly { id: SectionId; label: string }[]
