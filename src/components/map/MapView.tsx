/**
 * The atlas map. Reads everything from useAtlas(); takes no data props.
 *
 * The parent must give it a sized, positioned box (e.g. className="absolute inset-0"). The map
 * reads the --atlas-top-inset / --atlas-bottom-inset / --atlas-right-inset variables from that
 * box to keep camera targets, the legend and its controls inside the uncovered area.
 */
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { OVERVIEW_CAMERA, OVERVIEW_CAMERA_MOBILE, contextMarkers, overlays, places, placesById, routes } from '../../data'
import { useIsNarrow, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { hasWebGL, isSoftwareWebGL } from '../../lib/webgl'
import { useAtlas, type AtlasView } from '../../state/atlas'
import type { CameraView, LngLat, PlaceId } from '../../types'
import { AtlasMapController, type LegendContext } from './AtlasMapController'
import { MapControls } from './MapControls'
import { MapFallback } from './MapFallback'
import { MapLegend } from './MapLegend'
import { MapLoading } from './MapLoading'
import { AreaLabel, ContextPoint, PlaceMarker, RouteLabel } from './MapMarkers'
import './map.css'

export function MapView({ className }: { className?: string }) {
  const supported = useMemo(() => hasWebGL(), [])
  const [failed, setFailed] = useState(false)
  const fail = useCallback(() => setFailed(true), [])
  if (!supported || failed) return <MapFallback className={className} />
  return (
    <MapErrorBoundary fallback={<MapFallback className={className} />}>
      <InteractiveMap className={className} onFail={fail} />
    </MapErrorBoundary>
  )
}

class MapErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children
  }
}

const pickCamera = (target: AtlasView['cameraTarget'], narrow: boolean): CameraView =>
  narrow && target.mobileCamera ? target.mobileCamera : target.camera

const contextById = new Map(contextMarkers.map((m) => [m.id, m]))

/** What a camera move must keep in view: the chapter's or period's places and reference points, or the selected place. */
const allPlacePoints: LngLat[] = places.map((p) => p.coordinates)

function framePoints(view: AtlasView, focus: string): LngLat[] {
  /* The overview keeps every story location in frame when the screen is wide enough to hold them all. */
  if (focus === 'overview') return allPlacePoints
  if (focus === 'place') return view.selectedPlace ? [view.selectedPlace.coordinates] : []
  return [
    ...[...view.highlightedPlaceIds].map((id) => placesById[id]?.coordinates),
    ...[...view.visibleContextMarkerIds].map((id) => contextById.get(id)?.coordinates),
  ].filter((p): p is LngLat => !!p)
}

function InteractiveMap({ className, onFail }: { className?: string; onFail: () => void }) {
  const { state, view, dispatch } = useAtlas()
  const narrow = useIsNarrow()
  const prefersReducedMotion = usePrefersReducedMotion()
  /* On CPU-rendered WebGL every flight and route animation freezes the page for seconds: move instantly instead (?gl=full opts out). */
  const softwareGL = useMemo(() => isSoftwareWebGL(), [])
  const reducedMotion = prefersReducedMotion || softwareGL
  const frameRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const lastNonce = useRef(state.cameraNonce)
  const [controller, setController] = useState<AtlasMapController | null>(null)
  const [ready, setReady] = useState(false)
  const [detailNote, setDetailNote] = useState(false)
  const [legendContext, setLegendContext] = useState<LegendContext | null>(null)

  /* Create the map once. Values are read at mount; later changes flow through the effects below. */
  useEffect(() => {
    const frame = frameRef.current
    const container = mapRef.current
    if (!frame || !container) return
    const camera =
      state.cameraNonce === 0 ? (narrow ? OVERVIEW_CAMERA_MOBILE : OVERVIEW_CAMERA) : pickCamera(view.cameraTarget, narrow)
    let ctrl: AtlasMapController
    try {
      ctrl = new AtlasMapController({
        container,
        frame,
        camera,
        onReady: () => setReady(true),
        onFail,
        onDetailNote: setDetailNote,
        onLegendContext: setLegendContext,
      })
    } catch {
      onFail()
      return
    }
    ctrl.jumpTo(camera, state.cameraNonce === 0 ? allPlacePoints : framePoints(view, state.focus.kind))
    lastNonce.current = state.cameraNonce
    setController(ctrl)
    return () => {
      ctrl.destroy()
      setController(null)
      setReady(false)
      setDetailNote(false)
      setLegendContext(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Highlights, routes, overlays and labels follow the derived view. */
  useEffect(() => {
    controller?.setView(view, reducedMotion)
  }, [controller, view, reducedMotion])

  /* Once everything is drawn, re-apply the opening framing with the shell's final insets. */
  useEffect(() => {
    if (ready && controller && lastNonce.current === 0) controller.jumpTo(narrow ? OVERVIEW_CAMERA_MOBILE : OVERVIEW_CAMERA, allPlacePoints)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, controller])

  /* Every intended camera move bumps the nonce. */
  useEffect(() => {
    if (!controller || state.cameraNonce === 0 || state.cameraNonce === lastNonce.current) return
    lastNonce.current = state.cameraNonce
    controller.flyTo(
      pickCamera(view.cameraTarget, narrow),
      view.tone,
      state.focus.kind !== 'place',
      framePoints(view, state.focus.kind),
      state.focus.kind === 'overview',
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, state.cameraNonce])

  /* The legend can change height when its entries change; obstacles for label placement follow. */
  useEffect(() => {
    controller?.relayout()
  }, [controller, legendContext])

  const selectPlace = useCallback((id: PlaceId) => dispatch({ type: 'SELECT_PLACE', id }), [dispatch])
  const zoomIn = useCallback(() => controller?.zoomBy(1), [controller])
  const zoomOut = useCallback(() => controller?.zoomBy(-1), [controller])
  const reset = useCallback(() => dispatch({ type: 'RESET_VIEW' }), [dispatch])

  const solemn = view.tone === 'solemn'
  const selectedId = view.selectedPlace?.id

  return (
    <div ref={frameRef} className={`atlas-map ${className ?? 'relative h-full w-full'}`} data-tone={view.tone}>
      <div ref={mapRef} className="atlas-map__canvas" />
      <div className="atlas-map__vignette" aria-hidden="true" />
      <div className="grain atlas-map__grain" aria-hidden="true" />

      <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={reset} />
      <MapLegend view={view} context={legendContext} />
      {detailNote && <p className="atlas-map__detail-note" data-map-ui>Street detail needs an internet connection.</p>}
      <MapLoading visible={!ready} />

      {controller &&
        places.map((p) =>
          createPortal(
            <PlaceMarker
              place={p}
              highlighted={view.highlightedPlaceIds.has(p.id)}
              selected={p.id === selectedId}
              solemn={solemn}
              still={solemn || reducedMotion}
              onSelect={selectPlace}
            />,
            controller.placeEls.get(p.id)!,
            p.id,
          ),
        )}
      {controller &&
        contextMarkers.map((m) => createPortal(<ContextPoint marker={m} />, controller.contextEls.get(m.id)!, m.id))}
      {controller &&
        routes.map((r) => createPortal(<RouteLabel route={r} />, controller.routeLabelEls.get(r.id)!, r.id))}
      {controller &&
        overlays.map((o) => {
          const el = controller.overlayLabelEls.get(o.id)
          return el ? createPortal(<AreaLabel overlay={o} />, el, o.id) : null
        })}
    </div>
  )
}
