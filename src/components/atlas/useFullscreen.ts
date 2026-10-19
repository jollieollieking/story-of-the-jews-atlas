import { useCallback, useEffect, useState, type RefObject } from 'react'

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitFullscreenEnabled?: boolean
  webkitExitFullscreen?: () => Promise<void> | void
}
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void }

const doc = () => document as FsDocument
const fullscreenElement = () => doc().fullscreenElement ?? doc().webkitFullscreenElement ?? null
const nativeSupported = () =>
  typeof document !== 'undefined' && Boolean(doc().fullscreenEnabled || doc().webkitFullscreenEnabled)

export interface FullscreenControls {
  /** True in native or pseudo fullscreen. */
  active: boolean
  /** True when using the CSS fallback (fixed, full viewport) because the Fullscreen API is unavailable. */
  pseudo: boolean
  toggle: () => void
  exit: () => Promise<void>
}

/**
 * Fullscreen for one element via the Fullscreen API (with the webkit prefix), falling back to a CSS
 * "pseudo-fullscreen" where the API is missing (iPhone Safari) or refuses the request.
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>): FullscreenControls {
  const [native, setNative] = useState(false)
  const [pseudo, setPseudo] = useState(false)

  useEffect(() => {
    const sync = () => setNative(fullscreenElement() !== null && fullscreenElement() === ref.current)
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [ref])

  /* Pseudo-fullscreen: stop the page behind from scrolling. */
  useEffect(() => {
    if (!pseudo) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [pseudo])

  const exit = useCallback(async () => {
    if (pseudo) setPseudo(false)
    if (fullscreenElement()) {
      try {
        await (document.exitFullscreen ? document.exitFullscreen() : doc().webkitExitFullscreen?.())
      } catch {
        /* Already left fullscreen. */
      }
    }
  }, [pseudo])

  const enter = useCallback(async () => {
    const el = ref.current as FsElement | null
    if (!el) return
    if (nativeSupported()) {
      try {
        await (el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen?.())
        return
      } catch {
        /* Refused (e.g. inside a restricted iframe): fall through to the CSS fallback. */
      }
    }
    setPseudo(true)
  }, [ref])

  const active = native || pseudo
  const toggle = useCallback(() => {
    if (active) void exit()
    else void enter()
  }, [active, enter, exit])

  return { active, pseudo, toggle, exit }
}
