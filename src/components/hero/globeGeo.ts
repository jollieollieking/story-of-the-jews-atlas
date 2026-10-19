/**
 * Geometry shared by the WebGL globe and its static SVG fallback, so both draw the same
 * planet, in the same place, facing the same way. No three.js in here: this module is also
 * used by the fallback, which must stay out of the code-split three.js chunk.
 */
import { placesById } from '../../data'
import type { LngLat, PlaceId } from '../../types'
import land110Url from 'world-atlas/land-110m.json?url'

const DEG = Math.PI / 180

/* ----------------------------------------------------------------------------------------------
 * Screen layout, orientation and motion: where the globe sits inside the hero (CSS pixels)
 * and which way it faces
 * -------------------------------------------------------------------------------------------- */

/** Seconds for one full sway (east and back). The globe sways gently instead of spinning. */
export const SWAY_PERIOD = 70

export interface GlobeLayout {
  /** Centre of the globe, in px from the hero's top-left corner. */
  cx: number
  cy: number
  /** Radius of the globe, in px. */
  r: number
  /** Longitude at the centre of the view: mid-Atlantic, so Europe and New York share the near side. */
  lon: number
  /** Latitude tilted toward the camera. */
  lat: number
  /** Degrees the view sways east and west of `lon`. */
  sway: number
}

/** Longitude at the view centre after `t` seconds of animation. */
export function viewLonAt(t: number, layout: GlobeLayout): number {
  return layout.lon + layout.sway * Math.sin((2 * Math.PI * t) / SWAY_PERIOD)
}

/**
 * Desktop: large and offset to the right so the left column of text stays clear.
 * Narrow screens: centred and sunk below the text, like a horizon.
 */
export function globeLayout(width: number, height: number): GlobeLayout {
  if (width < 768) {
    // The arc spans about -0.42r..+0.59r horizontally, so shift left a little to centre it.
    // A lower tilt lifts the Pale-to-New-York arc toward the top of the visible cap.
    const r = Math.min(width * 0.7, height * 0.37)
    // On short phones, sink the globe further so it stays below the call-to-action buttons.
    const sink = Math.max(0, 760 - height) * 0.5
    return { cx: width / 2 - r * 0.09, cy: height - r * 0.12 + sink, r, lon: -38, lat: 27, sway: 7 }
  }
  if (width < 1100) {
    const r = Math.min(height * 0.47, width * 0.38)
    return { cx: width * 0.8, cy: height * 0.7, r, lon: -36, lat: 36, sway: 10 }
  }
  const r = Math.min(height * 0.53, width * 0.33)
  return { cx: width * 0.735, cy: height * 0.56, r, lon: -36, lat: 40, sway: 13 }
}

/** Vertical field of view of the WebGL camera. Narrow, so the globe reads almost orthographic. */
export const CAMERA_FOV = 20

/** Distance from the camera to the globe centre so the unit sphere appears with radius `layout.r` px. */
export function cameraDistance(layout: GlobeLayout, height: number): number {
  const angular = Math.atan((layout.r / (height / 2)) * Math.tan((CAMERA_FOV / 2) * DEG))
  return 1 / Math.sin(angular)
}

/**
 * Projects local-frame points to hero pixels exactly as the WebGL camera does (perspective, lens
 * shifted to the layout centre), so the SVG fallback lines up with the 3D globe when they cross-fade.
 * `visible` is false for points behind the horizon.
 */
export function makeProjector(layout: GlobeLayout, height: number, centerLon: number) {
  const d = cameraDistance(layout, height)
  const k = layout.r * Math.sqrt(d * d - 1) // r / tan(angular radius)
  return (v: Vec3) => {
    const [x, y, z] = toView(v, centerLon, layout.lat)
    const s = k / (d - z)
    return { x: layout.cx + x * s, y: layout.cy - y * s, z, visible: z > 1 / d }
  }
}

/* ----------------------------------------------------------------------------------------------
 * Coordinates
 * -------------------------------------------------------------------------------------------- */

export type Vec3 = [number, number, number]

/**
 * Unit vector for a longitude/latitude, in the globe's local frame:
 * +y is the North Pole and lon 0 / lat 0 faces +z (the camera, before rotation).
 */
export function lngLatToVec([lon, lat]: LngLat, radius = 1): Vec3 {
  const cl = Math.cos(lat * DEG)
  return [radius * cl * Math.sin(lon * DEG), radius * Math.sin(lat * DEG), radius * cl * Math.cos(lon * DEG)]
}

/**
 * Rotates a local-frame vector into view space for a view centred on `centerLon`/`centerLat`.
 * Mirrors the three.js scene graph: inner group rotation.y = -centerLon, outer group rotation.x = centerLat.
 */
export function toView([x, y, z]: Vec3, centerLon: number, centerLat: number): Vec3 {
  const a = -centerLon * DEG
  const x1 = x * Math.cos(a) + z * Math.sin(a)
  const z1 = -x * Math.sin(a) + z * Math.cos(a)
  const b = centerLat * DEG
  const y2 = y * Math.cos(b) - z1 * Math.sin(b)
  const z2 = y * Math.sin(b) + z1 * Math.cos(b)
  return [x1, y2, z2]
}

/** Great-circle distance in degrees. */
export function angularDistance(a: LngLat, b: LngLat): number {
  const [ax, ay, az] = lngLatToVec(a)
  const [bx, by, bz] = lngLatToVec(b)
  return Math.acos(Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz))) / DEG
}

/* ----------------------------------------------------------------------------------------------
 * Places and the migration arc
 * -------------------------------------------------------------------------------------------- */

/** Places from the atlas that are marked on the globe. Coordinates come from src/data/places.ts. */
const MARKER_PLACE_IDS: PlaceId[] = ['lithuania', 'plunge', 'uman', 'odesa', 'kosice', 'new-york-harbor']

export const GLOBE_MARKERS: { id: PlaceId; name: string; coordinates: LngLat }[] = MARKER_PLACE_IDS.map((id) => ({
  id,
  name: placesById[id].name,
  coordinates: placesById[id].coordinates,
}))

/** Approximate centre of the Pale of Settlement (an approximate regional marker in the atlas data). */
export const ARC_FROM: LngLat = placesById['pale-of-settlement'].coordinates
export const ARC_TO: LngLat = placesById['new-york-harbor'].coordinates
/** Height of the arc at its midpoint, as a fraction of the globe radius. */
export const ARC_LIFT = 0.17

/**
 * Points along the great circle from the Pale to New York, lifted into a gentle arch.
 * Returns local-frame vectors (globe radius 1).
 */
export function migrationArc(segments = 160, lift = ARC_LIFT): Vec3[] {
  const a = lngLatToVec(ARC_FROM)
  const b = lngLatToVec(ARC_TO)
  const omega = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2])
  const out: Vec3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const s0 = Math.sin((1 - t) * omega) / Math.sin(omega)
    const s1 = Math.sin(t * omega) / Math.sin(omega)
    const h = 1 + lift * Math.sin(Math.PI * t)
    out.push([(a[0] * s0 + b[0] * s1) * h, (a[1] * s0 + b[1] * s1) * h, (a[2] * s0 + b[2] * s1) * h])
  }
  return out
}

/* ----------------------------------------------------------------------------------------------
 * Land mask: world-atlas land-110m rasterised onto an equirectangular canvas
 * -------------------------------------------------------------------------------------------- */

export interface LandMask {
  isLand(lon: number, lat: number): boolean
}

const MASK_W = 1440
const MASK_H = 720
let maskPromise: Promise<LandMask> | null = null

/** Loads and rasterises the land outlines once; later calls share the same promise. */
export function loadLandMask(): Promise<LandMask> {
  maskPromise ??= buildLandMask().catch((err: unknown) => {
    maskPromise = null
    throw err
  })
  return maskPromise
}

async function buildLandMask(): Promise<LandMask> {
  // Fetched as a JSON asset (shared with the map fallback's `?url` import) rather than a JS module.
  const [{ feature }, atlas] = await Promise.all([
    import('topojson-client'),
    fetch(land110Url).then((r) => {
      if (!r.ok) throw new Error(`land-110m: HTTP ${r.status}`)
      return r.json() as Promise<unknown>
    }),
  ])
  const topology = atlas as import('topojson-specification').Topology<{
    land: import('topojson-specification').GeometryCollection
  }>
  const land = feature(topology, topology.objects.land)

  const canvas = document.createElement('canvas')
  canvas.width = MASK_W
  canvas.height = MASK_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2D canvas unavailable')
  ctx.fillStyle = '#fff'

  const px = (lon: number) => ((lon + 180) / 360) * MASK_W
  const py = (lat: number) => ((90 - lat) / 180) * MASK_H

  const drawPolygon = (rings: number[][][]) => {
    ctx.beginPath()
    for (const ring of rings) {
      ring.forEach(([lon, lat], i) => {
        const prev = ring[i - 1]
        // Natural Earth rings are already split at the antimeridian; never draw a line across the map.
        if (i === 0 || (prev && Math.abs(prev[0] - lon) > 180)) ctx.moveTo(px(lon), py(lat))
        else ctx.lineTo(px(lon), py(lat))
      })
      ctx.closePath()
    }
    ctx.fill('evenodd')
  }

  for (const f of land.features) {
    const g = f.geometry
    if (g.type === 'Polygon') drawPolygon(g.coordinates)
    else if (g.type === 'MultiPolygon') g.coordinates.forEach(drawPolygon)
  }

  const data = ctx.getImageData(0, 0, MASK_W, MASK_H).data
  return {
    isLand(lon, lat) {
      const x = Math.min(MASK_W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * MASK_W)))
      const y = Math.min(MASK_H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * MASK_H)))
      return data[(y * MASK_W + x) * 4] > 127
    },
  }
}

/* ----------------------------------------------------------------------------------------------
 * Dot sampling
 * -------------------------------------------------------------------------------------------- */

export interface LandDots {
  /** Flat local-frame positions, xyz per dot, on the unit sphere. */
  positions: Float32Array
  /** 0..1 warmth per dot: how close it is to the Pale of Settlement or New York. */
  warmth: Float32Array
  /** 0.82..1 brightness variation per dot, so the land reads as engraved rather than printed. */
  shade: Float32Array
  count: number
}

/**
 * Samples land on rows of equal latitude spacing, with the number of samples per row scaled by
 * cos(latitude) so dots stay evenly spaced instead of bunching at the poles.
 */
export function sampleLandDots(mask: LandMask, spacingDegrees: number): LandDots {
  const pos: number[] = []
  const warmth: number[] = []
  const shade: number[] = []
  let row = 0
  for (let lat = -90 + spacingDegrees / 2; lat < 90; lat += spacingDegrees, row++) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * DEG)) / spacingDegrees))
    const offset = row % 2 ? 0.5 : 0
    for (let i = 0; i < n; i++) {
      const lon = -180 + ((i + offset) / n) * 360
      if (!mask.isLand(lon, lat)) continue
      const v = lngLatToVec([lon, lat])
      pos.push(v[0], v[1], v[2])
      const dPale = angularDistance([lon, lat], ARC_FROM)
      const dNy = angularDistance([lon, lat], ARC_TO)
      warmth.push(Math.max(smoothFall(dPale, 5, 11), smoothFall(dNy, 1.5, 5)))
      // Deterministic pseudo-random shade so the pattern is identical on every load.
      const h = Math.sin(lon * 12.9898 + lat * 78.233) * 43758.5453
      shade.push(0.82 + 0.18 * (h - Math.floor(h)))
    }
  }
  return {
    positions: new Float32Array(pos),
    warmth: new Float32Array(warmth),
    shade: new Float32Array(shade),
    count: pos.length / 3,
  }
}

/** 1 inside `inner`, easing to 0 at `outer`. */
function smoothFall(d: number, inner: number, outer: number): number {
  const t = Math.min(1, Math.max(0, (d - inner) / (outer - inner)))
  return 1 - t * t * (3 - 2 * t)
}
