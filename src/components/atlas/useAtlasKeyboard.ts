import { useEffect, useRef, type RefObject } from 'react'

interface Handlers {
  onPrev: () => void
  onNext: () => void
  /** Return true if Escape did something (so the event is consumed). */
  onEscape: () => boolean
}

const isEditable = (el: HTMLElement | null) =>
  !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

/**
 * Atlas-wide shortcuts: Left/Right step chapters, Escape closes the top-most layer.
 * Active while focus is inside the atlas, or while the atlas fills most of the viewport and nothing
 * else on the page has focus. Arrow keys are left alone on the map canvas (MapLibre pans with them)
 * and wherever a component already handled them (roving groups and the image gallery call
 * preventDefault), and inside a modal dialog.
 */
export function useAtlasKeyboard(sectionRef: RefObject<HTMLElement | null>, handlers: Handlers) {
  const latest = useRef(handlers)
  useEffect(() => {
    latest.current = handlers
  })
  const inView = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(([entry]) => (inView.current = entry.intersectionRatio >= 0.6), {
      threshold: [0, 0.6, 1],
    })
    io.observe(section)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      if (isEditable(target)) return
      const active = document.activeElement
      const within = !!active && section.contains(active)
      const idle = !active || active === document.body || active === document.documentElement
      if (!within && !(idle && inView.current)) return

      if (e.key === 'Escape') {
        if (latest.current.onEscape()) e.preventDefault()
        return
      }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (e.shiftKey || target?.closest('.maplibregl-canvas-container, .maplibregl-canvas')) return
      /* A modal dialog sits over the atlas: chapters must not change behind it. */
      if (target?.closest('[role="dialog"]')) return
      e.preventDefault()
      if (e.key === 'ArrowLeft') latest.current.onPrev()
      else latest.current.onNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [sectionRef])
}
