import { useCallback, useEffect, useRef, useState } from 'react'

/** Height of an element in px, kept current with a ResizeObserver. Returns a callback ref. */
export function useElementHeight<T extends HTMLElement>(): [(el: T | null) => void, number] {
  const [height, setHeight] = useState(0)
  const observer = useRef<ResizeObserver | null>(null)
  const ref = useCallback((el: T | null) => {
    observer.current?.disconnect()
    observer.current = null
    if (!el) return
    const measure = () => setHeight(Math.round(el.getBoundingClientRect().height))
    measure()
    observer.current = new ResizeObserver(measure)
    observer.current.observe(el)
  }, [])
  useEffect(() => () => observer.current?.disconnect(), [])
  return [ref, height]
}

/** Inner window size in px, updated on resize and orientation change. */
export function useViewportSize() {
  const read = () => ({
    width: typeof window === 'undefined' ? 1440 : window.innerWidth,
    height: typeof window === 'undefined' ? 900 : window.innerHeight,
  })
  const [size, setSize] = useState(read)
  useEffect(() => {
    const onResize = () => setSize(read())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])
  return size
}
