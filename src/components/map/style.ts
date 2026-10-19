/**
 * The atlas map style, built in code: no remote style, no glyphs, no sprite, no text layers.
 *
 * Layer stack (bottom to top):
 *   ocean background -> Natural Earth land (offline) -> OpenFreeMap street detail (online, z5+)
 *   -> graticule -> modern borders -> coast glow -> historical overlay -> routes.
 * Place names, route labels and area labels are HTML markers, so the map needs no font files.
 */
import type {
  ExpressionSpecification,
  LayerSpecification,
  SourceSpecification,
  StyleSpecification,
} from 'maplibre-gl'
import { overlays, routes } from '../../data'
import { greatCirclePath } from '../../lib/geo'
import type { Route } from '../../types'
import { graticule } from './basemap'
import { MAP_COLORS as C, gold, memorial } from './palette'

export const OFM_SOURCE = 'ofm'
export const OFM_TILEJSON = 'https://tiles.openfreemap.org/planet'
/** Street detail starts to appear at this zoom and is fully in by DETAIL_FULL_ZOOM. */
export const DETAIL_MIN_ZOOM = 5
const DETAIL_FULL_ZOOM = 6.5

export const HATCH_IMAGE = 'atlas-hatch'

/**
 * Routes are generalized corridors drawn for the continental view. Closer in they would read as a
 * real road or street, so their lines (and HTML labels and lights) stop at this zoom.
 */
export const ROUTE_MAX_ZOOM = 8.5

export const ATTRIBUTION = [
  '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>',
  '<a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a>',
  '<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a>',
  '<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>',
].join(' · ')

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

const FADE = { duration: 900, delay: 0 }

/** Every route as a smooth great-circle line, computed once. */
export const routeLines: Record<string, GeoJSON.Position[]> = Object.fromEntries(
  routes.map((r) => [r.id, greatCirclePath(r.path, 64)]),
)

export const routeSourceId = (id: string) => `route-${id}`
export const routeLayerIds = (route: Route): string[] =>
  route.kind === 'sea' || route.kind === 'internal'
    ? [`route-${route.id}-glow`, `route-${route.id}-line`]
    : [`route-${route.id}-line`]

export const overlaySourceId = (id: string) => `overlay-${id}`
export const overlayLayerIds = (id: string) => [
  `overlay-${id}-fill`,
  `overlay-${id}-hatch`,
  `overlay-${id}-edge`,
  `overlay-${id}-hatch-edge`,
]

/** Fades a layer in between two zooms. */
const zoomFade = (from: number, to: number, max: number): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  from,
  0,
  to,
  max,
]

/** Base paint values that depend on whether the online street-detail tiles are available. */
export function detailDependentPaint(tilesAvailable: boolean) {
  return tilesAvailable
    ? {
        /* Online: the detailed vector water draws the sea, so the ground becomes land-coloured. */
        background: ['interpolate', ['linear'], ['zoom'], 5.5, C.ocean, 7, C.land] as ExpressionSpecification,
        landOpacity: ['interpolate', ['linear'], ['zoom'], 6, 1, 7, 0] as ExpressionSpecification,
        coastOpacity: ['interpolate', ['linear'], ['zoom'], 5, 1, 7, 0] as ExpressionSpecification,
        borderOpacity: ['interpolate', ['linear'], ['zoom'], 5, 1, 6.5, 0] as ExpressionSpecification,
      }
    : { background: C.ocean, landOpacity: 1, coastOpacity: 1, borderOpacity: 1 }
}

function baseLayers(): LayerSpecification[] {
  const p = detailDependentPaint(true)
  return [
    { id: 'ocean', type: 'background', paint: { 'background-color': p.background } },
    { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': C.land, 'fill-opacity': p.landOpacity, 'fill-antialias': true } },
  ]
}

/** OpenFreeMap (OpenMapTiles schema) street detail in the same subdued palette. */
function detailLayers(): LayerSpecification[] {
  const src = { source: OFM_SOURCE, minzoom: DETAIL_MIN_ZOOM }
  return [
    {
      id: 'ofm-landcover',
      type: 'fill',
      ...src,
      'source-layer': 'landcover',
      filter: ['in', ['get', 'class'], ['literal', ['wood', 'wetland']]],
      paint: { 'fill-color': C.park, 'fill-opacity': zoomFade(DETAIL_MIN_ZOOM, DETAIL_FULL_ZOOM, 0.45) },
    },
    {
      id: 'ofm-landuse',
      type: 'fill',
      ...src,
      minzoom: 9,
      'source-layer': 'landuse',
      filter: ['in', ['get', 'class'], ['literal', ['residential', 'commercial', 'industrial', 'retail']]],
      paint: { 'fill-color': C.landuse, 'fill-opacity': zoomFade(9, 11, 1) },
    },
    {
      id: 'ofm-park',
      type: 'fill',
      ...src,
      minzoom: 9,
      'source-layer': 'park',
      paint: { 'fill-color': C.park, 'fill-opacity': zoomFade(9, 11, 1) },
    },
    {
      id: 'ofm-water',
      type: 'fill',
      ...src,
      'source-layer': 'water',
      paint: { 'fill-color': C.water, 'fill-opacity': zoomFade(DETAIL_MIN_ZOOM, DETAIL_FULL_ZOOM, 1) },
    },
    {
      id: 'ofm-water-edge',
      type: 'line',
      ...src,
      minzoom: 8,
      'source-layer': 'water',
      paint: {
        'line-color': gold(0.16),
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.4, 14, 1],
        'line-opacity': zoomFade(8, 10, 1),
      },
    },
    {
      id: 'ofm-waterway',
      type: 'line',
      ...src,
      minzoom: 8,
      'source-layer': 'waterway',
      paint: {
        'line-color': C.waterway,
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 14, 2.5],
        'line-opacity': zoomFade(8, 9.5, 1),
      },
    },
    {
      id: 'ofm-boundary',
      type: 'line',
      ...src,
      'source-layer': 'boundary',
      filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
      paint: { 'line-color': C.border, 'line-width': 0.7, 'line-opacity': zoomFade(5.5, 7, 1) },
    },
    {
      id: 'ofm-roads-minor',
      type: 'line',
      ...src,
      minzoom: 11,
      'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'tertiary']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': C.road,
        'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 11, 0.2, 14, 0.8, 16, 2.4],
        'line-opacity': zoomFade(11, 12.5, 1),
      },
    },
    {
      id: 'ofm-roads-major',
      type: 'line',
      ...src,
      minzoom: 6,
      'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': C.roadMajor,
        'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 6, 0.2, 10, 0.5, 14, 1.4, 16, 3.2],
        'line-opacity': zoomFade(6, 8, 0.8),
      },
    },
    {
      id: 'ofm-rail',
      type: 'line',
      ...src,
      minzoom: 10,
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'rail'],
      paint: { 'line-color': C.road, 'line-width': 0.5, 'line-dasharray': [3, 3], 'line-opacity': zoomFade(10, 12, 0.7) },
    },
    {
      id: 'ofm-building',
      type: 'fill',
      ...src,
      minzoom: 13,
      'source-layer': 'building',
      paint: { 'fill-color': C.building, 'fill-outline-color': C.buildingEdge, 'fill-opacity': zoomFade(13, 14.5, 1) },
    },
  ]
}

function referenceLayers(): LayerSpecification[] {
  const p = detailDependentPaint(true)
  return [
    {
      id: 'graticule',
      type: 'line',
      source: 'graticule',
      paint: {
        'line-color': C.graticule,
        'line-width': 0.6,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 1, 0.9, 6, 0.6, 9, 0],
      },
    },
    {
      id: 'borders',
      type: 'line',
      source: 'borders',
      layout: { 'line-join': 'round' },
      paint: { 'line-color': C.border, 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.4, 6, 0.9], 'line-opacity': p.borderOpacity },
    },
    {
      id: 'coast-glow',
      type: 'line',
      source: 'land',
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': C.coastGlow,
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 3, 6, 7],
        'line-blur': ['interpolate', ['linear'], ['zoom'], 1, 3, 6, 6],
        'line-opacity': p.coastOpacity,
      },
    },
    {
      id: 'coast',
      type: 'line',
      source: 'land',
      layout: { 'line-join': 'round' },
      paint: { 'line-color': C.coast, 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.4, 6, 0.8], 'line-opacity': p.coastOpacity },
    },
  ]
}

function overlayLayers(): LayerSpecification[] {
  return overlays.flatMap((o): LayerSpecification[] => {
    const [fill, hatch, edge, hatchEdge] = overlayLayerIds(o.id)
    const source = overlaySourceId(o.id)
    const isPale: ExpressionSpecification = ['!=', ['get', 'kind'], 'congress-poland']
    const isCongress: ExpressionSpecification = ['==', ['get', 'kind'], 'congress-poland']
    return [
      {
        id: fill,
        type: 'fill',
        source,
        filter: isPale,
        paint: { 'fill-color': C.gold, 'fill-opacity': 0, 'fill-opacity-transition': FADE },
      },
      {
        id: hatch,
        type: 'fill',
        source,
        filter: isCongress,
        paint: { 'fill-pattern': HATCH_IMAGE, 'fill-opacity': 0, 'fill-opacity-transition': FADE },
      },
      {
        id: edge,
        type: 'line',
        source,
        filter: isPale,
        layout: { 'line-join': 'round' },
        paint: {
          'line-color': gold(0.75),
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.8, 7, 1.4],
          'line-dasharray': [3, 2],
          'line-opacity': 0,
          'line-opacity-transition': FADE,
        },
      },
      {
        id: hatchEdge,
        type: 'line',
        source,
        filter: isCongress,
        layout: { 'line-join': 'round' },
        paint: {
          'line-color': gold(0.5),
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.6, 7, 1.1],
          'line-dasharray': [1, 2.5],
          'line-opacity': 0,
          'line-opacity-transition': FADE,
        },
      },
    ]
  })
}

const routeWidth = (base: number): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  1,
  base * 0.8,
  4,
  base * 1.15,
  8,
  base * 1.6,
]

/** Fully transparent gradient: nothing drawn yet. */
export const HIDDEN_GRADIENT: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['line-progress'],
  0,
  'rgba(0, 0, 0, 0)',
  1,
  'rgba(0, 0, 0, 0)',
]

function routeLayers(): LayerSpecification[] {
  return routes.flatMap((r): LayerSpecification[] => {
    const source = routeSourceId(r.id)
    const id = `route-${r.id}`
    switch (r.kind) {
      case 'sea':
      case 'internal':
        return [
          {
            id: `${id}-glow`,
            type: 'line',
            source,
            maxzoom: ROUTE_MAX_ZOOM,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-gradient': HIDDEN_GRADIENT,
              'line-width': routeWidth(r.kind === 'sea' ? 7 : 5),
              'line-blur': routeWidth(r.kind === 'sea' ? 6 : 4),
              'line-opacity': 0,
              'line-opacity-transition': FADE,
            },
          },
          {
            id: `${id}-line`,
            type: 'line',
            source,
            maxzoom: ROUTE_MAX_ZOOM,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-gradient': HIDDEN_GRADIENT,
              'line-width': routeWidth(r.kind === 'sea' ? 1.6 : 1.3),
              'line-opacity': 0,
              'line-opacity-transition': FADE,
            },
          },
        ]
      case 'overland':
        return [
          {
            id: `${id}-line`,
            type: 'line',
            source,
            maxzoom: ROUTE_MAX_ZOOM,
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': C.goldDim,
              'line-width': routeWidth(1.2),
              'line-dasharray': [2.5, 2],
              'line-opacity': 0,
              'line-opacity-transition': FADE,
            },
          },
        ]
      case 'deportation':
        return [
          {
            id: `${id}-line`,
            type: 'line',
            source,
            maxzoom: ROUTE_MAX_ZOOM,
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': memorial(0.85),
              'line-width': routeWidth(1.1),
              'line-dasharray': [2, 3],
              'line-opacity': 0,
              'line-opacity-transition': { duration: 1400, delay: 0 },
            },
          },
        ]
    }
  })
}

/** Opacity each route layer settles at when its route is visible. */
export function routeLayerOpacity(route: Route, layerId: string): number {
  if (layerId.endsWith('-glow')) return route.kind === 'sea' ? 0.45 : 0.3
  switch (route.kind) {
    case 'sea':
      return 1
    case 'internal':
      return 0.9
    case 'overland':
      return 0.9
    case 'deportation':
      return 0.8
  }
}

export function createAtlasStyle(): StyleSpecification {
  const sources: Record<string, SourceSpecification> = {
    land: { type: 'geojson', data: EMPTY },
    borders: { type: 'geojson', data: EMPTY },
    graticule: { type: 'geojson', data: graticule(10) },
    [OFM_SOURCE]: { type: 'vector', url: OFM_TILEJSON, attribution: '' },
  }
  for (const o of overlays) sources[overlaySourceId(o.id)] = { type: 'geojson', data: o.geojson }
  for (const r of routes) {
    sources[routeSourceId(r.id)] = {
      type: 'geojson',
      lineMetrics: true,
      data: { type: 'Feature', properties: { id: r.id }, geometry: { type: 'LineString', coordinates: routeLines[r.id] } },
    }
  }
  return {
    version: 8,
    name: 'Over the Rainbow atlas',
    sources,
    layers: [...baseLayers(), ...detailLayers(), ...referenceLayers(), ...overlayLayers(), ...routeLayers()],
  }
}
