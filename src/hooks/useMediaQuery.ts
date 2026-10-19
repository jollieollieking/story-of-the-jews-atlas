import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query. Returns false during SSR or if matchMedia is unavailable. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false),
    () => false,
  )
}

/** True below the `md` breakpoint (768px): phones and small tablets. */
export const useIsNarrow = () => useMediaQuery('(max-width: 767px)')

/** True when the user asked the OS to reduce motion. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
