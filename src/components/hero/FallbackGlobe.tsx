import { useEffect, useMemo, useState } from 'react'
import {
  GLOBE_MARKERS,
  globeLayout,
  lngLatToVec,
  loadLandMask,
  makeProjector,
  migrationArc,
  sampleLandDots,
  viewLonAt,
  type LandDots,
} from './globeGeo'

/** Coarser than the WebGL globe (0.72°) to keep the SVG light. */
const FALLBACK_SPACING = 0.95

/**
 * A static SVG rendering of the hero globe, drawn with the same layout and orientation as the
 * WebGL version. Shown while three.js loads, and permanently when WebGL is unavailable.
 */
export function FallbackGlobe({ width, height }: { width: number; height: number }) {
  const [dots, setDots] = useState<LandDots | null>(null)
  useEffect(() => {
    let cancelled = false
    loadLandMask()
      .then((mask) => !cancelled && setDots(sampleLandDots(mask, FALLBACK_SPACING)))
      .catch(() => {
        /* The sphere, graticule, markers and arc still render without land. */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const { cx, cy, r } = globeLayout(width, height)
  const project = useMemo(
    () => makeProjector(globeLayout(width, height), height, viewLonAt(0, globeLayout(width, height))),
    [width, height],
  )

  const graticule = useMemo(() => {
    if (!width || !height) return ''
    const lines: [number, number][][] = []
    for (let lon = -180; lon < 180; lon += 15) {
      const line: [number, number][] = []
      for (let lat = -80; lat <= 80; lat += 2) line.push([lon, lat])
      lines.push(line)
    }
    for (let lat = -75; lat <= 75; lat += 15) {
      const line: [number, number][] = []
      for (let lon = -180; lon <= 180; lon += 2) line.push([lon, lat])
      lines.push(line)
    }
    let d = ''
    for (const line of lines) {
      let pen = false
      for (const ll of line) {
        const p = project(lngLatToVec(ll))
        if (!p.visible) {
          pen = false
          continue
        }
        d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
        pen = true
      }
    }
    return d
  }, [width, height, project])

  /* Land dots grouped into three brightness bands by how directly they face the viewer. */
  const landPaths = useMemo(() => {
    const bands = ['', '', '']
    const warm = ['', '']
    if (!dots || !width) return { bands, warm }
    const dotR = Math.max(0.65, r * FALLBACK_SPACING * (Math.PI / 180) * 0.21)
    const circle = (x: number, y: number, rr: number) =>
      `M${(x - rr).toFixed(1)} ${y.toFixed(1)}a${rr.toFixed(2)} ${rr.toFixed(2)} 0 1 0 ${(rr * 2).toFixed(2)} 0a${rr.toFixed(2)} ${rr.toFixed(2)} 0 1 0 ${(-rr * 2).toFixed(2)} 0`
    for (let i = 0; i < dots.count; i++) {
      const p = project([dots.positions[i * 3], dots.positions[i * 3 + 1], dots.positions[i * 3 + 2]])
      if (!p.visible || p.z < 0.12) continue
      const { x: px, y: py, z } = p
      if (px < -4 || py < -4 || px > width + 4 || py > height + 4) continue
      // Light from the upper left, matching the WebGL shader (view-space normal ≈ offset from centre).
      const nx = (px - cx) / r
      const ny = (cy - py) / r
      const light = -0.55 * nx + 0.6 * ny + 0.62 * z
      const rr = dotR * (0.6 + 0.4 * Math.min(1, z / 0.6))
      if (dots.warmth[i] > 0.45) warm[light > 0.2 ? 0 : 1] += circle(px, py, rr)
      else bands[z < 0.42 ? 2 : light > 0.25 ? 0 : 1] += circle(px, py, rr)
    }
    return { bands, warm }
  }, [dots, width, height, cx, cy, r, project])

  if (!width || !height) return null

  const arc = migrationArc(96)
    .map(project)
    .filter((p) => p.visible || p.z > 0)
    .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join('')

  const markers = GLOBE_MARKERS.map((m) => ({ id: m.id, ...project(lngLatToVec(m.coordinates, 1.006)) })).filter((p) => p.visible)
  const markerR = Math.max(8, r * 0.04)

  return (
    <svg className="absolute inset-0 h-full w-full" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <radialGradient id="hero-fb-sphere" cx={cx - r * 0.38} cy={cy - r * 0.42} r={r * 1.55} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#101722" />
          <stop offset="0.55" stopColor="#0a0f17" />
          <stop offset="1" stopColor="#04070b" />
        </radialGradient>
        <radialGradient id="hero-fb-rim" cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0.82" stopColor="#c7a46a" stopOpacity="0" />
          <stop offset="1" stopColor="#c7a46a" stopOpacity="0.16" />
        </radialGradient>
        <radialGradient id="hero-fb-atmo" cx={cx} cy={cy} r={r * 1.16} gradientUnits="userSpaceOnUse">
          <stop offset={1 / 1.16 - 0.005} stopColor="#e3cb9c" stopOpacity="0.32" />
          <stop offset={1 / 1.16 + 0.03} stopColor="#c7a46a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#c7a46a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-fb-marker">
          <stop offset="0" stopColor="#fff6e2" />
          <stop offset="0.14" stopColor="#f2deb3" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#c7a46a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#c7a46a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.16} fill="url(#hero-fb-atmo)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#hero-fb-sphere)" />
      <path d={graticule} fill="none" stroke="#c7a46a" strokeOpacity="0.09" strokeWidth="0.75" />
      <path d={landPaths.bands[0]} fill="#e2dccf" fillOpacity="0.52" />
      <path d={landPaths.bands[1]} fill="#b9b2a5" fillOpacity="0.42" />
      <path d={landPaths.bands[2]} fill="#9d978c" fillOpacity="0.22" />
      <path d={landPaths.warm[0]} fill="#e6c48a" fillOpacity="0.85" />
      <path d={landPaths.warm[1]} fill="#c7a46a" fillOpacity="0.6" />
      <circle cx={cx} cy={cy} r={r} fill="url(#hero-fb-rim)" />
      <path d={arc} fill="none" stroke="#c7a46a" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" />
      <path d={arc} fill="none" stroke="#e3cb9c" strokeOpacity="0.9" strokeWidth="1.1" strokeLinecap="round" />
      {markers.map((m) => (
        <circle key={m.id} cx={m.x} cy={m.y} r={markerR} fill="url(#hero-fb-marker)" />
      ))}
    </svg>
  )
}
