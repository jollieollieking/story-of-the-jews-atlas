import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab focus inside `ref` while mounted, calls `onEscape` on Escape, and restores focus to the
 * element that was focused before the trap opened.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, onEscape: () => void) {
  const escape = useRef(onEscape)
  useEffect(() => {
    escape.current = onEscape
  }, [onEscape])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const previous = document.activeElement as HTMLElement | null
    const first = root.querySelector<HTMLElement>('[data-autofocus]') ?? root.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        escape.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const head = items[0]
      const tail = items[items.length - 1]
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }
    root.addEventListener('keydown', onKeyDown)
    return () => {
      root.removeEventListener('keydown', onKeyDown)
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true })
    }
  }, [ref])
}
