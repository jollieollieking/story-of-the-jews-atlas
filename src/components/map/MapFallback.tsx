/**
 * Static SVG map for browsers without WebGL (or if the interactive map fails). Same places, same
 * highlighting and the same story buttons, drawn with a simple equidistant cylindrical projection.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { overlays, places, routesById } from '../../data'
import { equirectangular, greatCirclePath, polygonsOf } from '../../lib/geo'
import { useIsNarrow, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useAtlas } from '../../state/atlas'
import type { PlaceId } from '../../types'
import { loadFallbackLand } from './basemap'
import { Placer, fanOut, labelBox, resolveTap, sideOrder, type Side } from './layout'
import { PlaceMarker } from './MapMarkers'
import { MAP_COLORS as C } from './palette'
import './map.css'

const EXTENT = { west: -128, east: 50, south: 22, north: 66 }
const WIDTH = 1000
const projection = equirectangular(EXTENT, WIDTH, 45)
const HEIGHT = projection.height
const { project } = projection

function ringsToPath(polygons: GeoJSON.Position[][][]): string {
  return polygons
    .flatMap((rings) => rings)
    .map((ring) => `M${ring.map((p) => project(p).map((v) => v.toFixed(1)).join(',')).join('L')}Z`)
    .join('')
}

function lineToPath(coords: GeoJSON.Position[]): string {
  return `M${coords.map((p) => project(p).map((v) => v.toFixed(1)).join(',')).join('L')}`
}

const GRATICULE = (() => {
  let d = ''
  for (let lng = -120; lng <= 50; lng += 10) d += lineToPath([[lng, EXTENT.south], [lng, EXTENT.north]])
  for (let lat = 30; lat <= 60; lat += 10) d += lineToPath([[EXTENT.west, lat], [EXTENT.east, lat]])
  return d
})()

/* Pre-computed marker positions in SVG units, spread where they would overlap. */
const BASE_POINTS = places.map((p) => {
  const [x, y] = project(p.coordinates)
  return { x, y }
})
/* Spread far enough that neighbouring dots stay distinguishable to a finger; taps resolve to the nearest dot. */
const OFFSETS = fanOut(BASE_POINTS, 18, 22)
const POINTS = BASE_POINTS.map((p, i) => ({ x: p.x + OFFSETS[i].x, y: p.y + OFFSETS[i].y }))

export function MapFallback({ className }: { className?: string }) {
  const { view, dispatch } = useAtlas()
  const narrow = useIsNarrow()
  const reducedMotion = usePrefersReducedMotion()
  const [land, setLand] = useState<string>('')
  const boxRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    let cancelled = false
    loadFallbackLand()
      .then((features) => {
        if (!cancelled) setLand(ringsToPath(features.flatMap((f) => polygonsOf(f.geometry))))
      })
      .catch(() => {
        /* Without coastlines the graticule and the story buttons still work. */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const ro = new ResizeObserver(() => setScale(box.clientWidth / WIDTH || 1))
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  /* On phones the map is wider than the screen; start with Europe and the Atlantic in view. */
  useEffect(() => {
    const el = scrollRef.current
    if (el && narrow) el.scrollLeft = (el.scrollWidth - el.clientWidth) * 0.72
  }, [narrow])

  const overlayPath = useMemo(() => {
    const visible = overlays.filter((o) => view.visibleOverlayIds.has(o.id))
    return ringsToPath(
      visible.flatMap((o) => o.geojson.features.filter((f) => f.properties?.kind !== 'congress-poland').flatMap((f) => polygonsOf(f.geometry))),
    )
  }, [view.visibleOverlayIds])

  const routePaths = useMemo(
    () =>
      [...view.visibleRouteIds]
        .map((id) => routesById[id])
        .filter(Boolean)
        .map((r) => ({ id: r.id, kind: r.kind, d: lineToPath(greatCirclePath(r.path, 32)) })),
    [view.visibleRouteIds],
  )

  /* Label placement with estimated text widths (12px serif ≈ 6.4px per character). */
  const labels = useMemo(() => {
    const placer = new Placer(WIDTH * scale, HEIGHT * scale)
    const result = new Map<PlaceId, { on: boolean; side: Side }>()
    POINTS.forEach((p) => placer.add({ x: p.x * scale - 6, y: p.y * scale - 6, w: 12, h: 12 }))
    const order = places
      .map((p, i) => ({ p, i }))
      .sort((a, b) => Number(b.p.id === view.selectedPlace?.id) - Number(a.p.id === view.selectedPlace?.id))
    for (const { p, i } of order) {
      const lit = view.highlightedPlaceIds.has(p.id) || p.id === view.selectedPlace?.id
      if (!lit) {
        result.set(p.id, { on: false, side: 'right' })
        continue
      }
      const w = p.name.length * 6.4 + 4
      const h = p.approximate ? 30 : 18
      const pt = { x: POINTS[i].x * scale, y: POINTS[i].y * scale }
      const r = p.approximate ? 13 : 9
      const side = sideOrder(OFFSETS[i]).find((s) => placer.fits(labelBox(pt, r, s, w, h), 0))
      if (side) placer.add(labelBox(pt, r, side, w, h))
      result.set(p.id, { on: !!side || p.id === view.selectedPlace?.id, side: side ?? 'right' })
    }
    return result
  }, [scale, view.highlightedPlaceIds, view.selectedPlace])

  const onSelect = useCallback((id: PlaceId) => dispatch({ type: 'SELECT_PLACE', id }), [dispatch])

  /* Place buttons (32–36px) overlap in dense clusters: a pointer tap opens the dot nearest to it, not the topmost button. */
  const resolveClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const box = boxRef.current
      if (!box || e.detail === 0 || !(e.target instanceof Element) || !e.target.closest('.atlas-place')) return
      const r = box.getBoundingClientRect()
      const hit = resolveTap(
        e.clientX - r.left,
        e.clientY - r.top,
        places.map((p, i) => ({ key: p.id, x: POINTS[i].x * scale, y: POINTS[i].y * scale, r: p.approximate ? 18 : 16 })),
      )
      if (!hit) return
      e.preventDefault()
      e.stopPropagation()
      onSelect(hit.key)
    },
    [scale, onSelect],
  )
  const solemn = view.tone === 'solemn'

  return (
    <div className={`atlas-map atlas-fallback ${className ?? 'relative h-full w-full'}`}>
      <div ref={scrollRef} className="atlas-fallback__scroll">
        <div
          ref={boxRef}
          onClickCapture={resolveClick}
          className="atlas-fallback__box"
          style={{
            aspectRatio: `${WIDTH} / ${HEIGHT}`,
            width: narrow ? '960px' : `min(calc(100cqw - 32px), calc((100cqh - 24px) * ${(WIDTH / HEIGHT).toFixed(3)}))`,
          }}
        >
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT.toFixed(1)}`}
            className="atlas-fallback__svg"
            role="img"
            aria-label="Simplified map of Europe, the Atlantic and the United States"
          >
            <rect width={WIDTH} height={HEIGHT} fill={C.ocean} />
            <path d={GRATICULE} fill="none" stroke={C.graticule} strokeWidth={0.6} />
            {land && <path d={land} fill={C.land} stroke={C.coast} strokeWidth={0.6} strokeLinejoin="round" />}
            {overlayPath && (
              <path d={overlayPath} fill="rgba(199,164,106,0.07)" stroke="rgba(199,164,106,0.75)" strokeWidth={1} strokeDasharray="4 3" />
            )}
            {routePaths.map((r) => (
              <path
                key={r.id}
                d={r.d}
                fill="none"
                stroke={r.kind === 'deportation' ? C.memorial : r.kind === 'overland' ? C.goldDim : C.gold}
                strokeWidth={r.kind === 'sea' ? 1.6 : 1.1}
                strokeDasharray={r.kind === 'overland' ? '5 4' : r.kind === 'deportation' ? '3 4' : undefined}
                strokeLinecap="round"
                opacity={0.9}
              />
            ))}
          </svg>
          {places.map((p, i) => {
            const label = labels.get(p.id)
            return (
              <div
                key={p.id}
                className="atlas-marker atlas-marker--place"
                data-label={label?.on ? 'on' : 'off'}
                data-side={label?.side ?? 'right'}
                style={{
                  left: `${(POINTS[i].x / WIDTH) * 100}%`,
                  top: `${(POINTS[i].y / HEIGHT) * 100}%`,
                  zIndex: p.id === view.selectedPlace?.id ? 5 : view.highlightedPlaceIds.has(p.id) ? 3 : 2,
                }}
              >
                <PlaceMarker
                  place={p}
                  highlighted={view.highlightedPlaceIds.has(p.id)}
                  selected={p.id === view.selectedPlace?.id}
                  solemn={solemn}
                  still={solemn || reducedMotion}
                  onSelect={onSelect}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="atlas-map__vignette" aria-hidden="true" />
      <div className="grain atlas-map__grain" aria-hidden="true" />
      <p className="atlas-fallback__note">Interactive map unavailable — showing a simplified map.</p>
    </div>
  )
}
