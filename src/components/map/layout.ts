/**
 * Screen-space layout for map markers and labels: spreading markers that sit on top of each other
 * (New York's three stories at world zoom, for instance) and placing labels so they do not collide.
 * Pure functions, shared by the WebGL map and the static SVG fallback.
 */

export interface Point {
  x: number
  y: number
}

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export type Side = 'right' | 'left' | 'top' | 'bottom'

export function overlaps(a: Box, b: Box, pad = 3): boolean {
  return a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad
}

/**
 * Offsets that fan out points closer than `minDistance` px around their shared centre, so every
 * marker stays visible and clickable. Returns one offset per input point ({0,0} when untouched).
 */
export function fanOut(points: Point[], minDistance = 16, spacing = 18): Point[] {
  const n = points.length
  const parent = points.map((_, i) => i)
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) < minDistance) parent[find(i)] = find(j)
    }
  }
  const groups = new Map<number, number[]>()
  for (let i = 0; i < n; i++) groups.set(find(i), [...(groups.get(find(i)) ?? []), i])

  const offsets: Point[] = points.map(() => ({ x: 0, y: 0 }))
  for (const members of groups.values()) {
    if (members.length < 2) continue
    const cx = members.reduce((s, i) => s + points[i].x, 0) / members.length
    const cy = members.reduce((s, i) => s + points[i].y, 0) / members.length
    const radius = spacing / 2 / Math.sin(Math.PI / members.length)
    /* Slots around a circle, starting on the left; members keep their left-to-right order. */
    const slots = members
      .map((_, k) => {
        const a = Math.PI + (2 * Math.PI * k) / members.length
        return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) }
      })
      .sort((a, b) => a.x - b.x || a.y - b.y)
    const ordered = [...members].sort((a, b) => points[a].x - points[b].x || points[a].y - points[b].y)
    ordered.forEach((i, k) => {
      offsets[i] = { x: slots[k].x - points[i].x, y: slots[k].y - points[i].y }
    })
  }
  return offsets
}

/** The label box for a marker of radius `r` at `p`, on the given side. Mirrors the CSS in map.css. */
export function labelBox(p: Point, r: number, side: Side, w: number, h: number): Box {
  const gap = 8
  switch (side) {
    case 'right':
      return { x: p.x + r + gap, y: p.y - h / 2, w, h }
    case 'left':
      return { x: p.x - r - gap - w, y: p.y - h / 2, w, h }
    case 'top':
      return { x: p.x - w / 2, y: p.y - r - gap - h, w, h }
    case 'bottom':
      return { x: p.x - w / 2, y: p.y + r + gap, w, h }
  }
}

/** Sides to try, preferring the direction a fanned-out marker was pushed, then the last side used. */
export function sideOrder(offset: Point, previous?: Side): Side[] {
  const order: Side[] = ['right', 'left', 'bottom', 'top']
  let preferred: Side | undefined
  if (Math.abs(offset.x) > 0.5 || Math.abs(offset.y) > 0.5) {
    preferred = Math.abs(offset.x) >= Math.abs(offset.y) ? (offset.x > 0 ? 'right' : 'left') : offset.y > 0 ? 'bottom' : 'top'
  }
  const first = [preferred, previous].filter((s): s is Side => !!s)
  return [...new Set([...first, ...order])]
}

/** Greedy collision checker: boxes are accepted in priority order. */
export class Placer {
  boxes: Box[] = []
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  fits(box: Box, edge = 4): boolean {
    if (box.x < edge || box.y < edge || box.x + box.w > this.width - edge || box.y + box.h > this.height - edge) return false
    return !this.boxes.some((b) => overlaps(b, box))
  }

  add(box: Box) {
    this.boxes.push(box)
  }
}

export interface TapTarget<K> {
  key: K
  /** Drawn centre of the marker's dot, in the same coordinate space as the tap. */
  x: number
  y: number
  /** Radius of the marker's hit area. */
  r: number
}

/**
 * Resolves a tap among markers whose hit areas overlap. The topmost button is not necessarily the
 * one the reader aimed at, so the dot nearest the tap wins. When two dots are almost equally close
 * (`ambiguity` px) the tap is reported as ambiguous so the caller can zoom in instead of guessing.
 */
export function resolveTap<K>(x: number, y: number, targets: TapTarget<K>[], ambiguity = 0): { key: K; ambiguous: boolean } | null {
  const hits = targets
    .map((t) => ({ key: t.key, d: Math.hypot(t.x - x, t.y - y), r: t.r }))
    .filter((h) => h.d <= h.r)
    .sort((a, b) => a.d - b.d)
  if (!hits.length) return null
  const [best, second] = hits
  return { key: best.key, ambiguous: !!second && second.d - best.d < ambiguity }
}
