/**
 * Small, dependency-free geographic helpers shared by the interactive map and its SVG fallback.
 * Coordinates are always [longitude, latitude] in degrees (GeoJSON / MapLibre order).
 */
import type { LngLat } from '../types'

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

type Vec3 = [number, number, number]

function toVec(p: LngLat): Vec3 {
  const lng = p[0] * RAD
  const lat = p[1] * RAD
  const c = Math.cos(lat)
  return [c * Math.cos(lng), c * Math.sin(lng), Math.sin(lat)]
}

function toLngLat(v: Vec3): LngLat {
  return [Math.atan2(v[1], v[0]) * DEG, Math.atan2(v[2], Math.hypot(v[0], v[1])) * DEG]
}

/** Central angle between two points, in radians. */
export function angularDistance(a: LngLat, b: LngLat): number {
  const va = toVec(a)
  const vb = toVec(b)
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]))
  return Math.acos(dot)
}

/**
 * Points along the great circle from `a` to `b` (inclusive), by spherical linear interpolation.
 * The routes drawn here never cross the antimeridian, so longitudes are left unwrapped.
 */
export function greatCircle(a: LngLat, b: LngLat, steps = 64): LngLat[] {
  const omega = angularDistance(a, b)
  if (omega < 1e-9) return [a, b]
  const va = toVec(a)
  const vb = toVec(b)
  const sinOmega = Math.sin(omega)
  const out: LngLat[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const k1 = Math.sin((1 - t) * omega) / sinOmega
    const k2 = Math.sin(t * omega) / sinOmega
    out.push(toLngLat([k1 * va[0] + k2 * vb[0], k1 * va[1] + k2 * vb[1], k1 * va[2] + k2 * vb[2]]))
  }
  out[0] = a
  out[out.length - 1] = b
  return out
}

/** A smooth line through every waypoint, each leg following its great circle. */
export function greatCirclePath(path: LngLat[], stepsPerSegment = 64): LngLat[] {
  if (path.length < 2) return path.slice()
  const out: LngLat[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const leg = greatCircle(path[i], path[i + 1], stepsPerSegment)
    out.push(...(i === 0 ? leg : leg.slice(1)))
  }
  return out
}

/** Web Mercator in unit space: x and y in [0, 1] for the whole world. */
export function mercator(p: LngLat): [number, number] {
  const lat = Math.max(-85.05, Math.min(85.05, p[1])) * RAD
  return [p[0] / 360 + 0.5, 0.5 - Math.log(Math.tan(Math.PI / 4 + lat / 2)) / (2 * Math.PI)]
}

/** Inverse of `mercator`: unit Web Mercator back to [lng, lat]. */
export function unmercator([x, y]: [number, number]): LngLat {
  const lat = (2 * Math.atan(Math.exp((0.5 - y) * 2 * Math.PI)) - Math.PI / 2) / RAD
  return [(x - 0.5) * 360, lat]
}

/** A line with cumulative lengths measured in Mercator space, i.e. how it looks on the map. */
export interface MeasuredLine {
  coords: LngLat[]
  /** cumulative[i] = distance from the start to coords[i]. */
  cumulative: number[]
  total: number
}

export function measureLine(coords: LngLat[]): MeasuredLine {
  const cumulative = [0]
  let total = 0
  let prev = mercator(coords[0])
  for (let i = 1; i < coords.length; i++) {
    const cur = mercator(coords[i])
    total += Math.hypot(cur[0] - prev[0], cur[1] - prev[1])
    cumulative.push(total)
    prev = cur
  }
  return { coords, cumulative, total }
}

function locate(line: MeasuredLine, t: number): { index: number; f: number } {
  const target = Math.max(0, Math.min(1, t)) * line.total
  const { cumulative } = line
  let lo = 0
  let hi = cumulative.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (cumulative[mid] <= target) lo = mid
    else hi = mid
  }
  const span = cumulative[hi] - cumulative[lo]
  return { index: lo, f: span > 0 ? (target - cumulative[lo]) / span : 0 }
}

/** The point a fraction `t` (0–1) of the way along the line, by visible length. */
export function pointAlong(line: MeasuredLine, t: number): LngLat {
  if (line.coords.length === 1) return line.coords[0]
  const { index, f } = locate(line, t)
  const a = line.coords[index]
  const b = line.coords[Math.min(index + 1, line.coords.length - 1)]
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
}

/** The first fraction `t` (0–1) of the line, for "drawing" reveals. */
export function sliceLine(line: MeasuredLine, t: number): LngLat[] {
  if (t >= 1) return line.coords
  const { index } = locate(line, t)
  const head = pointAlong(line, t)
  return [...line.coords.slice(0, index + 1), head]
}

/** [west, south, east, north] of any set of positions. */
export function bounds(points: Iterable<LngLat | number[]>): [number, number, number, number] {
  let w = Infinity
  let s = Infinity
  let e = -Infinity
  let n = -Infinity
  for (const p of points) {
    if (p[0] < w) w = p[0]
    if (p[0] > e) e = p[0]
    if (p[1] < s) s = p[1]
    if (p[1] > n) n = p[1]
  }
  return [w, s, e, n]
}

/** Outer and inner rings of every polygon in a geometry (empty for non-polygons). */
export function polygonsOf(geometry: GeoJSON.Geometry | null): GeoJSON.Position[][][] {
  if (!geometry) return []
  if (geometry.type === 'Polygon') return [geometry.coordinates]
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  if (geometry.type === 'GeometryCollection') return geometry.geometries.flatMap(polygonsOf)
  return []
}

function inRing(x: number, y: number, ring: GeoJSON.Position[]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export function pointInPolygons(p: LngLat, polygons: GeoJSON.Position[][][]): boolean {
  return polygons.some((rings) => inRing(p[0], p[1], rings[0]) && !rings.slice(1).some((h) => inRing(p[0], p[1], h)))
}

function segmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax
  const dy = by - ay
  const len = dx * dx + dy * dy
  const t = len > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/**
 * Good places to put an area label: interior points sorted from the deepest inside the shape
 * (furthest from any edge) outward, spread apart from each other. Distances use a local
 * cos(latitude) correction so the result matches what the eye sees on the map.
 */
export function interiorPoints(geometries: (GeoJSON.Geometry | null)[], count = 4, grid = 28): LngLat[] {
  const polygons = geometries.flatMap(polygonsOf)
  if (!polygons.length) return []
  const [w, s, e, n] = bounds(polygons.flatMap((rings) => rings[0]))
  const k = Math.cos(((s + n) / 2) * RAD)
  const edges = polygons.flatMap((rings) => rings)
  const candidates: { p: LngLat; depth: number }[] = []
  for (let i = 0; i <= grid; i++) {
    for (let j = 0; j <= grid; j++) {
      const p: LngLat = [w + ((e - w) * i) / grid, s + ((n - s) * j) / grid]
      if (!pointInPolygons(p, polygons)) continue
      let depth = Infinity
      for (const ring of edges) {
        for (let r = 0, q = ring.length - 1; r < ring.length; q = r++) {
          const d = segmentDistance(p[0] * k, p[1], ring[q][0] * k, ring[q][1], ring[r][0] * k, ring[r][1])
          if (d < depth) depth = d
        }
      }
      candidates.push({ p, depth })
    }
  }
  candidates.sort((a, b) => b.depth - a.depth)
  const picked: LngLat[] = []
  const minGap = Math.max(e - w, n - s) / 6
  for (const c of candidates) {
    if (picked.every((q) => Math.hypot((q[0] - c.p[0]) * k, q[1] - c.p[1]) > minGap)) picked.push(c.p)
    if (picked.length >= count) break
  }
  return picked
}

/**
 * Equidistant cylindrical projection with a standard parallel, used by the static SVG fallback.
 * Returns a projector into a box of the given pixel width; height follows from the aspect ratio.
 */
export function equirectangular(
  extent: { west: number; east: number; south: number; north: number },
  width: number,
  standardParallel = 45,
) {
  const k = Math.cos(standardParallel * RAD)
  const scale = width / ((extent.east - extent.west) * k)
  const height = (extent.north - extent.south) * scale
  const project = (p: LngLat | GeoJSON.Position): [number, number] => [
    (p[0] - extent.west) * k * scale,
    (extent.north - p[1]) * scale,
  ]
  return { project, width, height }
}

/**
 * Natural Earth rings that cross the antimeridian (Chukotka, Wrangel Island, Fiji) jump from
 * +180° to −180° and back, which a flat renderer fills as a band around the whole world. Unwrap
 * those rings so they run continuously past ±180°; MapLibre wraps the overflow onto the other side.
 * Rings with a single jump (Antarctica, closed along the pole) are already drawable and kept.
 */
export function unwrapRing(ring: GeoJSON.Position[]): GeoJSON.Position[] {
  let jumps = 0
  for (let i = 1; i < ring.length; i++) if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) jumps++
  if (jumps === 0 || jumps % 2 === 1) return ring
  let offset = 0
  const out: GeoJSON.Position[] = [ring[0]]
  for (let i = 1; i < ring.length; i++) {
    const d = ring[i][0] - ring[i - 1][0]
    if (d > 180) offset -= 360
    else if (d < -180) offset += 360
    out.push([ring[i][0] + offset, ring[i][1]])
  }
  /* Keep the bulk of the ring on the primary world copy (a ring may have started east of 180°). */
  const mean = out.reduce((sum, p) => sum + p[0], 0) / out.length
  const shift = -360 * Math.round(mean / 360)
  return shift ? out.map((p) => [p[0] + shift, p[1]]) : out
}

export function repairPolygons<G extends GeoJSON.Geometry>(geometry: G): G {
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: geometry.coordinates.map(unwrapRing) }
  if (geometry.type === 'MultiPolygon')
    return { ...geometry, coordinates: geometry.coordinates.map((rings) => rings.map(unwrapRing)) }
  return geometry
}

/** Splits lines wherever they jump across the antimeridian, so no segment spans the world. */
export function splitAtAntimeridian(lines: GeoJSON.Position[][]): GeoJSON.Position[][] {
  const out: GeoJSON.Position[][] = []
  for (const line of lines) {
    let part: GeoJSON.Position[] = [line[0]]
    for (let i = 1; i < line.length; i++) {
      if (Math.abs(line[i][0] - line[i - 1][0]) > 180) {
        if (part.length > 1) out.push(part)
        part = []
      }
      part.push(line[i])
    }
    if (part.length > 1) out.push(part)
  }
  return out
}
