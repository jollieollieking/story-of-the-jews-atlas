import { useEffect, type RefObject } from 'react'

/** Marks the story panel root (side panel or bottom sheet). */
export const PANEL_ATTR = 'data-story-panel'

/**
 * When a panel view mounts because the previous view's button disappeared (focus fell to <body>), focus
 * was inside the panel, on an element that is about to leave ([data-yield-focus], e.g. the entry prompt),
 * on the atlas section itself (arriving from the hero or nav), or on a map marker (the visitor chose to
 * open that story), move focus to the new heading so keyboard users keep their place. Focus on the
 * timeline or header controls is left alone, so stepping through periods or chapters keeps working.
 */
export function useHeadingFocus(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const active = document.activeElement
    const handOff =
      active instanceof HTMLElement &&
      (active.id === 'atlas' || !!active.closest(`[${PANEL_ATTR}], [data-yield-focus], .atlas-place`))
    if (!active || active === document.body || handOff) ref.current?.focus({ preventScroll: true })
  }, [ref])
}
