import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { hasFastWebGL } from '../../lib/webgl'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { FallbackGlobe } from './FallbackGlobe'
import { loadLandMask } from './globeGeo'

/* three.js + React Three Fiber are only downloaded when the browser can actually use them. */
const Globe = lazy(() => import('./Globe'))

/**
 * The globe layer of the hero: a static SVG globe first, then the WebGL globe cross-fades in over
 * it once three.js and the land data are ready. Any WebGL failure leaves the SVG globe in place.
 */
export function GlobeStage({ visible, label }: { visible: boolean; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const size = useElementSize(ref)
  const still = usePrefersReducedMotion()
  const tabVisible = usePageVisible()
  const [webgl] = useState(() => hasFastWebGL())
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  // Start fetching the land outlines immediately; both globes share the same promise.
  useEffect(() => {
    loadLandMask().catch(() => {})
  }, [])

  const onReady = useCallback(() => setReady(true), [])
  const onFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  const glEnabled = webgl && !failed
  const showGl = glEnabled && ready

  // Once the WebGL globe has fully faded in, drop the SVG globe from the DOM.
  const [fallbackRetired, setFallbackRetired] = useState(false)
  useEffect(() => {
    if (!showGl) return
    const id = window.setTimeout(() => setFallbackRetired(true), 1600)
    return () => window.clearTimeout(id)
  }, [showGl])
  const hideFallback = showGl && fallbackRetired

  return (
    <div ref={ref} className="absolute inset-0" role="img" aria-label={label}>
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-cinema)]"
        style={{ opacity: showGl ? 0 : 1 }}
      >
        {size.width > 0 && !hideFallback && <FallbackGlobe width={size.width} height={size.height} />}
      </div>
      {glEnabled && (
        <div
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-cinema)]"
          style={{ opacity: showGl ? 1 : 0 }}
        >
          <GlobeErrorBoundary onError={onFail}>
            <Suspense fallback={null}>
              <Globe active={visible && tabVisible} still={still} onReady={onReady} onContextLost={onFail} />
            </Suspense>
          </GlobeErrorBoundary>
        </div>
      )}
    </div>
  )
}

class GlobeErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      // clientWidth/Height ignore CSS transforms, unlike getBoundingClientRect.
      const width = el.clientWidth
      const height = el.clientHeight
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || document.visibilityState !== 'hidden')
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return visible
}
