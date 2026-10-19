/** Section anchors used by the navigation. */
export const SECTION_IDS = {
  top: 'top',
  atlas: 'atlas',
  reflection: 'reflection',
  sources: 'sources',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

/** Smoothly scrolls to a section (instantly under reduced motion) and moves focus to it for keyboard users. */
export function scrollToSection(id: SectionId) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
