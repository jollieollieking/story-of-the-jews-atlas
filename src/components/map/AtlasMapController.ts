/**
 * Imperative owner of the MapLibre map. React creates it once and feeds it the derived atlas view;
 * everything per-frame (route drawing, travelling lights, label layout, camera flights) lives here,
 * outside React, so the component tree never re-renders during an animation.
 */
import { Map as MapLibreMap, Marker, setWorkerUrl, type ExpressionSpecification, type GeoJSONSource } from 'maplibre-gl'
/* The worker is a self-contained file; point MapLibre at it explicitly so it loads under Vite in dev and build. */
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { contextMarkers, overlays, places, routes } from '../../data'
import {
  angularDistance,
  bounds,
  interiorPoints,
  measureLine,
  mercator,
  pointAlong,
  polygonsOf,
  sliceLine,
  unmercator,
  type MeasuredLine,
} from '../../lib/geo'
import type { AtlasView } from '../../state/atlas'
import type { CameraView, LngLat, OverlayId, PlaceId, Route } from '../../types'
import { loadBaseGeography } from './basemap'
import { Placer, fanOut, labelBox, resolveTap, sideOrder, type Box, type Point, type Side } from './layout'
import { gold, goldSoft } from './palette'
import {
  ATTRIBUTION,
  HATCH_IMAGE,
  HIDDEN_GRADIENT,
  OFM_SOURCE,
  ROUTE_MAX_ZOOM,
  createAtlasStyle,
  detailDependentPaint,
  overlayLayerIds,
  routeLayerIds,
  routeLayerOpacity,
  routeLines,
  routeSourceId,
} from './style'

/** Radius in px used for label placement around each kind of marker (matches map.css). */
const PLACE_RADIUS = 9
const REGION_RADIUS = 13
const CONTEXT_RADIUS = 4
/** Half the size of the place buttons (map.css): the hit areas taps are resolved against. */
const PLACE_HIT = 16
const REGION_HIT = 18
/** Without street tiles there is nothing to see past this zoom but the coarse coastline. */
const OFFLINE_MAX_ZOOM = 9.5

const REVEAL_MS = 2500
const LIGHT_LOOP_MS = 6000
/** Overland legs draw first; the sea crossings follow on from the ports. */
const REVEAL_DELAY: Record<Route['kind'], number> = { overland: 0, internal: 200, sea: 1300, deportation: 0 }
/** Fractions along a route where its label may sit, best first. */
const ROUTE_LABEL_STOPS = [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.18, 0.82]

const TRANSPARENT = 'rgba(0, 0, 0, 0)'

setWorkerUrl(workerUrl)

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

export interface ControllerOptions {
  /** Element MapLibre renders into. */
  container: HTMLElement
  /** Element whose computed style carries the --atlas-*-inset variables. */
  frame: HTMLElement
  camera: CameraView
  onReady: () => void
  onFail: (error: unknown) => void
  /** Called with true when street detail failed to load and the user is zoomed in past z9. */
  onDetailNote: (show: boolean) => void
  /** What the legend can honestly list for the current viewport (reported when it changes). */
  onLegendContext?: (context: LegendContext) => void
}

export interface LegendContext {
  /** False when zoomed in past the point where generalized routes are drawn. */
  routesShown: boolean
  /** Overlays whose extent intersects the current viewport. */
  overlaysInView: OverlayId[]
}

interface PointMarker {
  el: HTMLDivElement
  marker: Marker
  lngLat: LngLat
  offset: Point
  side?: Side
  radius: number
}

interface RouteRuntime {
  route: Route
  line: MeasuredLine
  visible: boolean
  /** Reveal progress 0–1. */
  progress: number
  revealStart: number
  lightEpoch: number
  light?: { el: HTMLElement; marker: Marker; phase: number }
  label: { el: HTMLDivElement; marker: Marker; stops: LngLat[]; stopIndex: number; below?: boolean }
}

interface OverlayRuntime {
  id: OverlayId
  hasFeatures: boolean
  hasCongress: boolean
  /** [west, south, east, north] of the overlay's features. */
  extent: [number, number, number, number] | null
  label: { el: HTMLDivElement; marker: Marker; stops: LngLat[]; stopIndex: number } | null
}

function markerElement(className: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = `atlas-marker ${className}`
  return el
}

/** Small diagonal hatch for the Congress Poland overlay, drawn at runtime: no sprite file needed. */
function hatchImage(): ImageData | null {
  const size = 16
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.strokeStyle = gold(0.55)
  ctx.lineWidth = 1.2
  ctx.beginPath()
  for (let o = -size; o <= size; o += 8) {
    ctx.moveTo(o, size)
    ctx.lineTo(o + size, 0)
  }
  ctx.stroke()
  return ctx.getImageData(0, 0, size, size)
}

function routeGradient(p: number, kind: Route['kind']): ExpressionSpecification {
  if (p <= 0) return HIDDEN_GRADIENT
  const col = kind === 'sea' ? gold : goldSoft
  const [tail, body] = kind === 'sea' ? [0.42, 0.85] : [0.3, 0.65]
  const head = kind === 'sea' ? goldSoft(1) : goldSoft(0.85)
  if (p >= 0.998) return ['interpolate', ['linear'], ['line-progress'], 0, col(tail), 0.6, col(body), 1, col(body + 0.1)]
  const stops: (number | string)[] = [0, col(tail)]
  if (p > 0.16) stops.push(p - 0.15, col(body))
  stops.push(p, head, p + 0.002, TRANSPARENT, 1, TRANSPARENT)
  return ['interpolate', ['linear'], ['line-progress'], ...stops] as ExpressionSpecification
}

export class AtlasMapController {
  readonly map: MapLibreMap
  readonly placeEls = new Map<PlaceId, HTMLDivElement>()
  readonly contextEls = new Map<string, HTMLDivElement>()
  readonly routeLabelEls = new Map<string, HTMLDivElement>()
  readonly overlayLabelEls = new Map<OverlayId, HTMLDivElement>()

  private opts: ControllerOptions
  private placeMarkers = new Map<PlaceId, PointMarker>()
  private contextMarkers = new Map<string, PointMarker>()
  private routes = new Map<string, RouteRuntime>()
  private overlays = new Map<OverlayId, OverlayRuntime>()
  private sizes = new Map<HTMLElement, { w: number; h: number }>()
  /** Screen areas covered by atlas UI (header, timeline, panel, legend, controls), refreshed off the hot path. */
  private uiBoxes: Box[] | null = null
  private insetCache: { top: number; bottom: number; right: number } | null = null
  private pendingBase: Awaited<ReturnType<typeof loadBaseGeography>> | null = null

  private view: AtlasView | null = null
  private reducedMotion = false
  private styleLoaded = false
  private baseLoaded = false
  private ready = false
  private destroyed = false
  private detailFailed = false
  private detailNote = false
  private onScreen = true
  private pointerType = ''
  private coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
  private legendKey = ''
  private raf = 0
  private flightRaf = 0
  private readyTimer = 0
  private settleTimer = 0
  private resizeObserver: ResizeObserver | null = null
  private intersection: IntersectionObserver | null = null

  constructor(opts: ControllerOptions) {
    this.opts = opts
    const map = new MapLibreMap({
      container: opts.container,
      style: createAtlasStyle(),
      center: opts.camera.center,
      zoom: opts.camera.zoom,
      minZoom: 1,
      maxZoom: 16,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      touchZoomRotate: true,
      keyboard: true,
      renderWorldCopies: false,
      attributionControl: { compact: true, customAttribution: ATTRIBUTION },
      fadeDuration: 200,
      cancelPendingTileRequestsWhileZooming: true,
    })
    this.map = map
    map.touchZoomRotate.disableRotation()
    map.keyboard.disableRotation()

    const canvas = map.getCanvas()
    canvas.setAttribute(
      'aria-label',
      'Historical map of the places in this story. Use the arrow keys to pan and the plus and minus keys to zoom.',
    )
    /* Focusing an off-screen marker must never scroll the map's clipped container. */
    opts.container.addEventListener('scroll', this.resetScroll)

    this.createMarkers()

    map.on('load', this.handleStyleLoad)
    map.on('error', this.handleError)
    map.setMissingStyleImageResolver(this.resolveImage)
    map.on('move', this.layout)
    map.on('zoomend', this.updateDetailNote)
    map.on('zoomend', () => this.ensureLoop())
    map.on('moveend', this.reportLegendContext)
    opts.container.addEventListener('pointerdown', this.rememberPointer, true)
    opts.container.addEventListener('click', this.resolvePlaceClick, true)
    /* The legend and controls glide when the atlas insets change (e.g. the bottom sheet closing): re-measure them. */
    opts.frame.addEventListener('transitionend', this.handleUiTransition)

    loadBaseGeography()
      .then((geo) => {
        if (this.destroyed) return
        this.pendingBase = geo
        this.applyBase()
      })
      .catch(() => {
        /* Without Natural Earth the online detail and every marker still work; do not block the atlas. */
        this.baseLoaded = true
        this.checkReady()
      })

    this.resizeObserver = new ResizeObserver(() => {
      map.resize()
      this.relayout()
    })
    this.resizeObserver.observe(opts.container)
    /* An edge-adjacent (zero-area) map still reports isIntersecting; only a visible sliver counts. */
    this.intersection = new IntersectionObserver(
      ([entry]) => {
        this.onScreen = entry.isIntersecting && entry.intersectionRatio > 0
        if (this.onScreen) this.ensureLoop()
      },
      { threshold: [0, 0.01] },
    )
    this.intersection.observe(opts.container)
    document.fonts?.ready.then(() => {
      this.sizes.clear()
      this.layout()
    })
    /* If the style never loads (a broken GPU driver, a blocked worker), fall back to the static map. */
    this.readyTimer = window.setTimeout(() => {
      if (!this.styleLoaded) this.opts.onFail(new Error('Map style did not load in time'))
    }, 20000)
    if (!navigator.onLine) this.markDetailFailed()
  }

  // ---------------------------------------------------------------- setup

  private createMarkers() {
    for (const p of places) {
      const el = markerElement('atlas-marker--place')
      const marker = new Marker({ element: el, anchor: 'center', subpixelPositioning: true }).setLngLat(p.coordinates).addTo(this.map)
      this.placeEls.set(p.id, el)
      this.placeMarkers.set(p.id, {
        el,
        marker,
        lngLat: p.coordinates,
        offset: { x: 0, y: 0 },
        radius: p.approximate ? REGION_RADIUS : PLACE_RADIUS,
      })
    }
    for (const c of contextMarkers) {
      const el = markerElement('atlas-marker--context')
      el.dataset.visible = 'false'
      const marker = new Marker({ element: el, anchor: 'center', subpixelPositioning: true }).setLngLat(c.coordinates).addTo(this.map)
      this.contextEls.set(c.id, el)
      this.contextMarkers.set(c.id, { el, marker, lngLat: c.coordinates, offset: { x: 0, y: 0 }, radius: CONTEXT_RADIUS })
    }
    routes.forEach((r, index) => {
      const line = measureLine(routeLines[r.id] as LngLat[])
      const labelEl = markerElement('atlas-marker--route-label')
      labelEl.dataset.visible = 'false'
      labelEl.style.zIndex = '1'
      const stops = ROUTE_LABEL_STOPS.map((t) => pointAlong(line, t))
      const labelMarker = new Marker({ element: labelEl, anchor: 'center', subpixelPositioning: true }).setLngLat(stops[0]).addTo(this.map)
      this.routeLabelEls.set(r.id, labelEl)
      let light: RouteRuntime['light']
      if (r.kind === 'sea') {
        const wrapper = markerElement('atlas-route-light')
        wrapper.setAttribute('aria-hidden', 'true')
        wrapper.style.zIndex = '1'
        const el = wrapper.appendChild(document.createElement('span'))
        el.className = 'atlas-route-light__dot'
        const marker = new Marker({ element: wrapper, anchor: 'center', subpixelPositioning: true }).setLngLat(r.path[0]).addTo(this.map)
        light = { el, marker, phase: (index % 2) * 0.5 }
      }
      this.routes.set(r.id, {
        route: r,
        line,
        visible: false,
        progress: 0,
        revealStart: 0,
        lightEpoch: 0,
        light,
        label: { el: labelEl, marker: labelMarker, stops, stopIndex: 0 },
      })
    })
    for (const o of overlays) {
      const features = o.geojson.features
      const pale = features.filter((f) => f.properties?.kind !== 'congress-poland').map((f) => f.geometry)
      const stops = interiorPoints(pale, 5)
      let label: OverlayRuntime['label'] = null
      if (stops.length) {
        const el = markerElement('atlas-marker--area-label')
        el.dataset.visible = 'false'
        el.style.zIndex = '1'
        const marker = new Marker({ element: el, anchor: 'center', subpixelPositioning: true }).setLngLat(stops[0]).addTo(this.map)
        this.overlayLabelEls.set(o.id, el)
        label = { el, marker, stops, stopIndex: 0 }
      }
      this.overlays.set(o.id, {
        id: o.id,
        hasFeatures: features.length > 0,
        hasCongress: features.some((f) => f.properties?.kind === 'congress-poland'),
        extent: features.length ? bounds(features.flatMap((f) => polygonsOf(f.geometry).flat(2))) : null,
        label,
      })
    }
  }

  private handleStyleLoad = () => {
    this.styleLoaded = true
    window.clearTimeout(this.readyTimer)
    if (this.detailFailed) this.applyDetailFallback()
    const applied = this.applyBase()
    this.applyViewToStyle(true)
    /* Start with the attribution collapsed to its small (i) button. */
    this.opts.container.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
    if (!applied) this.checkReady()
  }

  /** Hands the loaded geography to the map. Returns true when it did (readiness then waits for a frame). */
  private applyBase(): boolean {
    if (!this.styleLoaded || !this.pendingBase) return false
    ;(this.map.getSource('land') as GeoJSONSource | undefined)?.setData(this.pendingBase.land)
    ;(this.map.getSource('borders') as GeoJSONSource | undefined)?.setData(this.pendingBase.borders)
    this.pendingBase = null
    this.baseLoaded = true
    /* Wait for the land to be drawn before lifting the loading veil (but never for slow tiles). */
    this.map.once('idle', () => this.checkReady())
    window.setTimeout(() => this.checkReady(), 2500)
    return true
  }

  private checkReady() {
    if (this.ready || this.destroyed || !this.styleLoaded || !this.baseLoaded) return
    if (this.pendingBase) return
    this.ready = true
    this.opts.onReady()
  }

  private handleError = (e: { error?: { message?: string }; sourceId?: string }) => {
    const message = e.error?.message ?? ''
    if (e.sourceId === OFM_SOURCE || message.includes('openfreemap')) {
      this.markDetailFailed()
      return
    }
    if (!this.styleLoaded && !e.sourceId) this.opts.onFail(e.error)
  }

  private resolveImage = (id: string) => {
    if (id !== HATCH_IMAGE || this.map.hasImage(HATCH_IMAGE)) return
    const image = hatchImage()
    if (image) this.map.addImage(HATCH_IMAGE, image, { pixelRatio: 2 })
  }

  private rememberPointer = (e: PointerEvent) => {
    this.pointerType = e.pointerType
  }

  /**
   * Where place buttons overlap (a tight cluster at continental zoom), the topmost button would take
   * the tap whichever dot the reader aimed at. Resolve pointer clicks to the nearest dot instead, and
   * on touch screens zoom into a cluster when the tap falls between two dots. Keyboard activation
   * (detail 0) is never touched.
   */
  private resolvePlaceClick = (e: MouseEvent) => {
    if (e.detail === 0 || !(e.target instanceof Element)) return
    const button = e.target.closest<HTMLButtonElement>('button.atlas-place')
    if (!button) return
    const origin = this.opts.container.getBoundingClientRect()
    const x = e.clientX - origin.left
    const y = e.clientY - origin.top
    const targets = [...this.placeMarkers.values()].map((m) => {
      const p = this.map.project(m.lngLat)
      return { key: m, x: p.x + m.offset.x, y: p.y + m.offset.y, r: m.radius === REGION_RADIUS ? REGION_HIT : PLACE_HIT }
    })
    const touch = this.pointerType !== 'mouse'
    const hit = resolveTap(x, y, targets, touch ? 6 : 0)
    if (!hit) return
    const zoom = this.map.getZoom()
    if (hit.ambiguous && zoom < this.map.getMaxZoom() - 2) {
      e.preventDefault()
      e.stopPropagation()
      this.map.easeTo({ zoom: zoom + 2, around: this.map.unproject([x, y]), duration: this.reducedMotion ? 0 : 600 })
      return
    }
    const intended = hit.key.el.querySelector<HTMLButtonElement>('button.atlas-place')
    if (intended && intended !== button) {
      e.preventDefault()
      e.stopPropagation()
      intended.click()
    }
  }

  private handleUiTransition = (e: TransitionEvent) => {
    if (e.target instanceof Element && e.target.matches('[data-map-ui], .maplibregl-ctrl-bottom-right')) this.relayout()
  }

  private resetScroll = () => {
    const c = this.opts.container
    if (c.scrollTop || c.scrollLeft) {
      c.scrollTop = 0
      c.scrollLeft = 0
    }
  }

  // ---------------------------------------------------------------- street detail

  private markDetailFailed() {
    if (this.detailFailed) return
    this.detailFailed = true
    if (this.styleLoaded) this.applyDetailFallback()
    this.updateDetailNote()
  }

  /** Offline: keep the Natural Earth coastline and ocean at every zoom instead of handing over to the tiles. */
  private applyDetailFallback() {
    const p = detailDependentPaint(false)
    const m = this.map
    m.setPaintProperty('ocean', 'background-color', p.background)
    m.setPaintProperty('land', 'fill-opacity', p.landOpacity)
    m.setPaintProperty('coast', 'line-opacity', p.coastOpacity)
    m.setPaintProperty('coast-glow', 'line-opacity', p.coastOpacity)
    m.setPaintProperty('borders', 'line-opacity', p.borderOpacity)
    for (const layer of m.getStyle().layers) {
      if ('source' in layer && layer.source === OFM_SOURCE) m.setLayoutProperty(layer.id, 'visibility', 'none')
    }
    /* Past this the 1:50m coastline breaks into empty fields and stray wedges; stay where it reads. */
    m.setMaxZoom(OFFLINE_MAX_ZOOM)
  }

  private reportLegendContext = () => {
    const report = this.opts.onLegendContext
    if (!report) return
    const b = this.map.getBounds()
    const routesShown = this.map.getZoom() < ROUTE_MAX_ZOOM
    const overlaysInView = [...this.overlays.values()]
      .filter(({ extent: e }) => e && e[0] <= b.getEast() && e[2] >= b.getWest() && e[1] <= b.getNorth() && e[3] >= b.getSouth())
      .map((o) => o.id)
    const key = `${routesShown}|${overlaysInView.join(',')}`
    if (key === this.legendKey) return
    this.legendKey = key
    report({ routesShown, overlaysInView })
  }

  private updateDetailNote = () => {
    const show = this.detailFailed && this.map.getZoom() > OFFLINE_MAX_ZOOM - 1
    if (show !== this.detailNote) {
      this.detailNote = show
      this.opts.onDetailNote(show)
    }
  }

  // ---------------------------------------------------------------- view

  setView(view: AtlasView, reducedMotion: boolean) {
    const previous = this.view
    this.view = view
    this.reducedMotion = reducedMotion
    const selectedId = view.selectedPlace?.id

    for (const [id, m] of this.placeMarkers) {
      const z = id === selectedId ? '5' : view.highlightedPlaceIds.has(id) ? '3' : '2'
      if (m.el.style.zIndex !== z) m.el.style.zIndex = z
    }
    for (const [id, m] of this.contextMarkers) {
      m.el.dataset.visible = String(view.visibleContextMarkerIds.has(id))
      m.el.style.zIndex = '2'
    }
    for (const [id, rt] of this.routes) rt.label.el.dataset.visible = String(view.visibleRouteIds.has(id))
    for (const [id, o] of this.overlays) {
      if (o.label) o.label.el.dataset.visible = String(o.hasFeatures && view.visibleOverlayIds.has(id))
    }

    if (this.styleLoaded) this.applyViewToStyle(!previous)
    this.relayout()
    /* The legend and panel animate after a view change; measure the UI again once they settle. */
    window.clearTimeout(this.settleTimer)
    this.settleTimer = window.setTimeout(() => this.relayout(), 800)
  }

  private applyViewToStyle(initial: boolean) {
    const view = this.view
    if (!view) return
    const m = this.map
    for (const [id, o] of this.overlays) {
      const on = o.hasFeatures && view.visibleOverlayIds.has(id)
      const [fill, hatch, edge, hatchEdge] = overlayLayerIds(id)
      m.setPaintProperty(fill, 'fill-opacity', on ? 0.07 : 0)
      m.setPaintProperty(hatch, 'fill-opacity', on && o.hasCongress ? 0.5 : 0)
      m.setPaintProperty(edge, 'line-opacity', on ? 1 : 0)
      m.setPaintProperty(hatchEdge, 'line-opacity', on && o.hasCongress ? 1 : 0)
    }
    const now = performance.now()
    for (const [id, rt] of this.routes) {
      const visible = view.visibleRouteIds.has(id)
      if (visible && !rt.visible) this.showRoute(rt, now, initial)
      else if (!visible && rt.visible) this.hideRoute(rt)
      else if (visible && this.reducedMotion && rt.progress < 1) this.setProgress(rt, 1)
    }
    this.ensureLoop()
  }

  private showRoute(rt: RouteRuntime, now: number, initial: boolean) {
    rt.visible = true
    for (const layer of routeLayerIds(rt.route)) {
      this.map.setPaintProperty(layer, 'line-opacity', routeLayerOpacity(rt.route, layer))
    }
    const instant = this.reducedMotion || this.view?.tone === 'solemn' || rt.route.kind === 'deportation'
    if (instant) {
      this.setProgress(rt, 1)
      return
    }
    rt.revealStart = now + (initial ? 400 : 0) + REVEAL_DELAY[rt.route.kind]
    this.setProgress(rt, 0)
  }

  private hideRoute(rt: RouteRuntime) {
    rt.visible = false
    for (const layer of routeLayerIds(rt.route)) this.map.setPaintProperty(layer, 'line-opacity', 0)
    if (rt.light) rt.light.el.style.opacity = '0'
  }

  private setProgress(rt: RouteRuntime, p: number) {
    rt.progress = p
    if (p >= 1) rt.lightEpoch = performance.now()
    switch (rt.route.kind) {
      case 'sea':
      case 'internal':
        for (const layer of routeLayerIds(rt.route)) this.map.setPaintProperty(layer, 'line-gradient', routeGradient(p, rt.route.kind))
        break
      case 'overland': {
        const coords = p <= 0 ? [] : sliceLine(rt.line, p)
        const source = this.map.getSource(routeSourceId(rt.route.id)) as GeoJSONSource | undefined
        source?.setData({
          type: 'Feature',
          properties: { id: rt.route.id },
          geometry: { type: 'LineString', coordinates: coords.length > 1 ? coords : [] },
        })
        break
      }
      case 'deportation':
        break
    }
  }

  // ---------------------------------------------------------------- animation loop

  private ensureLoop() {
    if (!this.raf && this.onScreen && !this.destroyed) this.raf = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    this.raf = 0
    if (!this.styleLoaded || !this.view) return
    const lightsOn = !this.reducedMotion && this.view.tone !== 'solemn' && this.map.getZoom() < ROUTE_MAX_ZOOM
    let active = false
    for (const rt of this.routes.values()) {
      if (!rt.visible) continue
      if (rt.progress < 1) {
        active = true
        const t = (now - rt.revealStart) / REVEAL_MS
        if (t > 0) this.setProgress(rt, t >= 1 ? 1 : easeOutCubic(t))
      }
      const light = rt.light
      if (!light) continue
      if (lightsOn && rt.progress >= 1) {
        active = true
        const phase = (((now - rt.lightEpoch) / LIGHT_LOOP_MS + light.phase) % 1 + 1) % 1
        light.marker.setLngLat(pointAlong(rt.line, phase))
        light.el.style.opacity = String(Math.sin(Math.PI * phase) ** 0.6)
      } else if (light.el.style.opacity !== '0') {
        light.el.style.opacity = '0'
      }
    }
    if (active) this.ensureLoop()
  }

  // ---------------------------------------------------------------- camera

  private insets() {
    const cs = getComputedStyle(this.opts.frame)
    const read = (name: string, fallback: number) => {
      const n = parseFloat(cs.getPropertyValue(name))
      return Number.isFinite(n) ? n : fallback
    }
    return { top: read('--atlas-top-inset', 64), bottom: read('--atlas-bottom-inset', 0), right: read('--atlas-right-inset', 0) }
  }

  /** Camera padding that keeps the focus clear of the header, timeline and story panel. */
  padding() {
    const { top, bottom, right } = this.insets()
    const w = this.opts.container.clientWidth || 1
    const h = this.opts.container.clientHeight || 1
    const legend = this.opts.frame.querySelector<HTMLElement>('.atlas-legend')
    const legendSpace = legend ? legend.offsetHeight + 16 : 0
    const pad = { top: top + 24, bottom: bottom + 24 + legendSpace, left: 24, right: right + 24 }
    const maxV = h * 0.7
    if (pad.top + pad.bottom > maxV) {
      const k = maxV / (pad.top + pad.bottom)
      pad.top *= k
      pad.bottom *= k
    }
    const maxH = w * 0.7
    if (pad.left + pad.right > maxH) {
      const k = maxH / (pad.left + pad.right)
      pad.left *= k
      pad.right *= k
    }
    return pad
  }

  /**
   * Chapter framings are composed for the full stage. When the story panel covers part of it,
   * zoom out by the covered fraction so the whole chapter still fits beside the panel.
   */
  private coveredWidthZoomOffset(): number {
    const width = this.opts.container.clientWidth
    const { right } = this.insets()
    if (!width || right <= 0 || right >= width * 0.8) return 0
    return Math.log2((width - right) / width)
  }

  /** Jump without animation, e.g. for the very first frame. */
  jumpTo(target: CameraView, frame: LngLat[] = []) {
    const padding = this.padding()
    const framed = this.frameWithin(frame, target.center, target.zoom, padding, true)
    this.map.jumpTo({ center: framed.center, zoom: framed.zoom, bearing: 0, pitch: 0, padding })
  }

  /**
   * Move the camera to `target`. Deferred two frames so the atlas shell's inset variables
   * (which change with the same action, e.g. the story panel opening) are already applied.
   */
  flyTo(target: CameraView, tone: AtlasView['tone'], fitToUncoveredWidth: boolean, frame: LngLat[] = [], frameOptional = false) {
    cancelAnimationFrame(this.flightRaf)
    this.flightRaf = requestAnimationFrame(() => {
      this.flightRaf = requestAnimationFrame(() => {
        this.flightRaf = 0
        if (this.destroyed) return
        let zoom = fitToUncoveredWidth ? target.zoom + this.coveredWidthZoomOffset() : target.zoom
        if (this.detailFailed) zoom = Math.min(zoom, OFFLINE_MAX_ZOOM - 0.5)
        const padding = this.padding()
        const framed = this.frameWithin(frame, target.center, zoom, padding, frameOptional)
        zoom = framed.zoom
        const camera = { center: framed.center, zoom, bearing: 0, pitch: 0, padding }
        if (this.reducedMotion) {
          this.map.jumpTo(camera)
        } else if (tone === 'solemn') {
          this.map.easeTo({ ...camera, duration: 3600, easing: easeInOutSine, essential: true })
        } else {
          const c = this.map.getCenter()
          const degrees = (angularDistance([c.lng, c.lat], framed.center) * 180) / Math.PI
          const dz = Math.abs(this.map.getZoom() - zoom)
          const duration = Math.min(3200, 2600 + Math.log2(1 + degrees / 8) * 110 + dz * 25)
          this.map.flyTo({ ...camera, duration, curve: 1.3, easing: easeInOutCubic, essential: true })
        }
      })
    })
  }

  /**
   * The area a reader can actually see: below the header, above the timeline / bottom sheet and
   * legend, beside the story panel, with room for marker halos and labels.
   */
  private visibleBand() {
    const w = this.opts.container.clientWidth
    const h = this.opts.container.clientHeight
    const { top, bottom, right } = this.insets()
    const legend = this.opts.frame.querySelector<HTMLElement>('.atlas-legend')
    const legendSpace = legend ? legend.offsetHeight + 12 : 0
    const narrow = w < 640
    const mx = narrow ? 40 : 72
    /* On phones the zoom controls take a column down the right edge of the band (wider screens have room in mx). */
    const controls = narrow ? (this.opts.frame.querySelector<HTMLElement>('.atlas-controls')?.offsetWidth ?? 0) + 30 : 0
    const my = 26
    return { left: mx, right: w - right - Math.max(mx, controls), top: top + my, bottom: h - bottom - legendSpace - my }
  }

  /**
   * Chapter cameras are composed by hand, but on short or narrow screens (or when the camera padding
   * had to be squeezed) some of the chapter's places can end up under the header, the bottom sheet or
   * the legend. If any of `points` would fall outside the visible band at the intended camera,
   * re-centre them in the band and zoom out as far as needed (never in). With `optional`, keep the
   * hand-composed camera when the points cannot all fit even at the minimum zoom (e.g. the overview on phones).
   */
  private frameWithin(points: LngLat[], center: LngLat, zoom: number, pad: { top: number; bottom: number; left: number; right: number }, optional = false) {
    const w = this.opts.container.clientWidth
    const h = this.opts.container.clientHeight
    const band = this.visibleBand()
    const bandW = band.right - band.left
    const bandH = band.bottom - band.top
    if (!points.length || !w || !h || bandW < 48 || bandH < 48) return { center, zoom }
    /* MapLibre puts `center` at the middle of the padded viewport; world size is 512·2^zoom px. */
    const pcx = pad.left + (w - pad.left - pad.right) / 2
    const pcy = pad.top + (h - pad.top - pad.bottom) / 2
    const units = points.map(mercator)
    const [cx, cy] = mercator(center)
    const size = 512 * 2 ** zoom
    const inside = units.every(([x, y]) => {
      const sx = pcx + (x - cx) * size
      const sy = pcy + (y - cy) * size
      return sx >= band.left && sx <= band.right && sy >= band.top && sy <= band.bottom
    })
    if (inside) return { center, zoom }
    const xs = units.map((u) => u[0])
    const ys = units.map((u) => u[1])
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    const fit = Math.log2(Math.min(bandW / Math.max((maxX - minX) * 512, 1e-9), bandH / Math.max((maxY - minY) * 512, 1e-9)))
    if (optional && fit < this.map.getMinZoom()) return { center, zoom }
    const z = Math.max(this.map.getMinZoom(), Math.min(zoom, fit))
    const s = 512 * 2 ** z
    const mid: [number, number] = [
      (minX + maxX) / 2 - ((band.left + band.right) / 2 - pcx) / s,
      (minY + maxY) / 2 - ((band.top + band.bottom) / 2 - pcy) / s,
    ]
    return { center: unmercator(mid), zoom: z }
  }

  zoomBy(delta: number) {
    const options = { duration: this.reducedMotion ? 0 : 450 }
    if (delta > 0) this.map.zoomIn(options)
    else this.map.zoomOut(options)
  }

  // ---------------------------------------------------------------- labels

  private size(el: HTMLElement | null): { w: number; h: number } {
    if (!el) return { w: 0, h: 0 }
    let s = this.sizes.get(el)
    if (!s || !s.w) {
      s = { w: el.offsetWidth, h: el.offsetHeight }
      this.sizes.set(el, s)
    }
    return s
  }

  private setFlag(el: HTMLElement, key: 'label' | 'side', value: string) {
    if (el.dataset[key] !== value) el.dataset[key] = value
  }

  /**
   * Declutters markers and places labels greedily by priority: selected place, highlighted places,
   * reference points, route labels (which can slide along their line), area labels. Runs synchronously on every camera move; label
   * sizes are cached so it never forces a browser layout mid-animation.
   */
  private layout = () => {
    const view = this.view
    const container = this.opts.container
    const width = container.clientWidth
    const height = container.clientHeight
    if (!view || !width || !height || this.destroyed) return
    const map = this.map
    const selectedId = view.selectedPlace?.id

    /* 1. Spread markers that overlap on screen. */
    const dots: PointMarker[] = [
      ...this.placeMarkers.values(),
      ...[...this.contextMarkers].filter(([id]) => view.visibleContextMarkerIds.has(id)).map(([, m]) => m),
    ]
    const projected = dots.map((d) => map.project(d.lngLat))
    /* Fingers need the fanned-out dots further apart than a mouse does. */
    const offsets = this.coarse ? fanOut(projected.map((p) => ({ x: p.x, y: p.y })), 20, 24) : fanOut(projected.map((p) => ({ x: p.x, y: p.y })))
    const positions = new Map<PointMarker, Point>()
    dots.forEach((d, i) => {
      const o = offsets[i]
      if (Math.abs(o.x - d.offset.x) > 0.25 || Math.abs(o.y - d.offset.y) > 0.25) {
        d.offset = o
        d.marker.setOffset([o.x, o.y])
      }
      positions.set(d, { x: projected[i].x + o.x, y: projected[i].y + o.y })
    })

    const placer = new Placer(width, height)
    this.uiBoxes ??= this.measureUi(width, height)
    for (const box of this.uiBoxes) placer.add(box)
    const onScreen = (p: Point) => p.x > -40 && p.y > -40 && p.x < width + 40 && p.y < height + 40

    /* Keyboard users only tab to markers they can see: not ones under the header, timeline or story panel, or off the map. */
    this.insetCache ??= this.insets()
    const uncovered = this.insetCache
    for (const m of this.placeMarkers.values()) {
      const p = positions.get(m)!
      const visible = p.x >= 0 && p.x <= width - uncovered.right && p.y >= uncovered.top && p.y <= height - uncovered.bottom
      const button = m.el.firstElementChild
      if (button instanceof HTMLElement) {
        const tab = visible ? 0 : -1
        if (button.tabIndex !== tab) button.tabIndex = tab
      }
    }
    for (const [d, p] of positions) {
      if (onScreen(p)) placer.add({ x: p.x - d.radius, y: p.y - d.radius, w: d.radius * 2, h: d.radius * 2 })
    }

    const placePoint = (m: PointMarker, force: boolean) => {
      const p = positions.get(m)!
      const label = m.el.querySelector<HTMLElement>('[data-map-label]')
      const { w, h } = this.size(label)
      if (!label || !w || !onScreen(p)) {
        this.setFlag(m.el, 'label', 'off')
        return
      }
      let chosen: { side: Side; box: Box } | null = null
      for (const side of sideOrder(m.offset, m.side)) {
        const box = labelBox(p, m.radius, side, w, h)
        if (placer.fits(box)) {
          chosen = { side, box }
          break
        }
      }
      if (!chosen && force) {
        const side = m.side ?? 'right'
        chosen = { side, box: labelBox(p, m.radius, side, w, h) }
      }
      if (!chosen) {
        this.setFlag(m.el, 'label', 'off')
        return
      }
      placer.add(chosen.box)
      m.side = chosen.side
      this.setFlag(m.el, 'side', chosen.side)
      this.setFlag(m.el, 'label', 'on')
    }

    /* 2. Place labels, most important first. */
    const order = [...this.placeMarkers].sort(([a], [b]) => Number(b === selectedId) - Number(a === selectedId))
    for (const [id, m] of order) {
      if (id === selectedId) placePoint(m, true)
      else if (view.highlightedPlaceIds.has(id)) placePoint(m, false)
      else this.setFlag(m.el, 'label', 'off')
    }

    type AlongItem = { el: HTMLDivElement; marker: Marker; stops: LngLat[]; stopIndex: number; below?: boolean }
    const placeAlong = (item: AlongItem, boxesAt: (p: Point, w: number, h: number) => { box: Box; below: boolean }[], margin = 0) => {
      const label = item.el.querySelector<HTMLElement>('[data-map-label]')
      const { w, h } = this.size(label)
      if (!w) return this.setFlag(item.el, 'label', 'off')
      const order = [item.stopIndex, ...item.stops.keys()].filter((v, i, a) => a.indexOf(v) === i)
      /* Prefer a spot with clear space around the label; settle for a tight one rather than none. */
      for (const pad of margin ? [margin, 0] : [0]) {
        for (const index of order) {
          const p = map.project(item.stops[index])
          const options = boxesAt(p, w, h).sort((a, b) => Number(b.below === !!item.below) - Number(a.below === !!item.below))
          for (const { box, below } of options) {
            if (!placer.fits({ x: box.x - pad, y: box.y - pad, w: box.w + 2 * pad, h: box.h + 2 * pad })) continue
            placer.add(box)
            if (index !== item.stopIndex) {
              item.stopIndex = index
              item.marker.setLngLat(item.stops[index])
            }
            item.below = below
            this.setFlag(item.el, 'side', below ? 'bottom' : 'top')
            return this.setFlag(item.el, 'label', 'on')
          }
        }
      }
      this.setFlag(item.el, 'label', 'off')
    }

    for (const [id, m] of this.contextMarkers) {
      if (view.visibleContextMarkerIds.has(id)) placePoint(m, false)
      else this.setFlag(m.el, 'label', 'off')
    }
    const routesShown = map.getZoom() < ROUTE_MAX_ZOOM
    for (const [id, rt] of this.routes) {
      if (routesShown && view.visibleRouteIds.has(id))
        placeAlong(rt.label, (p, w, h) => [
          { box: { x: p.x - w / 2, y: p.y - h - 7, w, h }, below: false },
          { box: { x: p.x - w / 2, y: p.y + 7, w, h }, below: true },
        ])
      else this.setFlag(rt.label.el, 'label', 'off')
    }
    for (const [id, o] of this.overlays) {
      if (!o.label) continue
      if (o.hasFeatures && view.visibleOverlayIds.has(id))
        /* Area labels go last and keep a clear margin, so they never crowd the place names they surround. */
        placeAlong(o.label, (p, w, h) => [{ box: { x: p.x - w / 2, y: p.y - h / 2, w, h }, below: false }], 10)
      else this.setFlag(o.label.el, 'label', 'off')
    }
  }

  /** Re-measure labels (e.g. after their text changed) and the surrounding UI, then lay out again. */
  relayout() {
    this.sizes.clear()
    this.uiBoxes = null
    this.insetCache = null
    this.layout()
  }

  private measureUi(width: number, height: number): Box[] {
    const { top, bottom, right } = this.insets()
    const boxes: Box[] = [
      { x: 0, y: 0, w: width, h: top },
      { x: 0, y: height - bottom, w: width, h: bottom },
    ]
    if (right > 0) boxes.push({ x: width - right, y: 0, w: right, h: height })
    const origin = this.opts.container.getBoundingClientRect()
    /* The map's own controls, plus floating atlas UI over the map such as the entry prompt card. */
    const root = this.opts.frame.closest('section') ?? this.opts.frame
    for (const el of root.querySelectorAll<HTMLElement>('[data-map-ui], [data-yield-focus], .maplibregl-ctrl-attrib')) {
      const r = el.getBoundingClientRect()
      if (r.width && r.height) boxes.push({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height })
    }
    return boxes
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.raf)
    cancelAnimationFrame(this.flightRaf)
    window.clearTimeout(this.readyTimer)
    window.clearTimeout(this.settleTimer)
    this.resizeObserver?.disconnect()
    this.intersection?.disconnect()
    this.opts.container.removeEventListener('scroll', this.resetScroll)
    this.opts.container.removeEventListener('pointerdown', this.rememberPointer, true)
    this.opts.container.removeEventListener('click', this.resolvePlaceClick, true)
    this.opts.frame.removeEventListener('transitionend', this.handleUiTransition)
    this.map.remove()
  }
}
