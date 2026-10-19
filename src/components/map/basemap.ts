/**
 * Offline base geography from Natural Earth (via the world-atlas package). The TopoJSON files are
 * emitted as separate static assets and fetched on demand, so they never weigh down the main bundle.
 */
import land50Url from 'world-atlas/land-50m.json?url'
import countries50Url from 'world-atlas/countries-50m.json?url'
import land110Url from 'world-atlas/land-110m.json?url'
import type { Topology, GeometryCollection } from 'topojson-specification'
import { repairPolygons, splitAtAntimeridian } from '../../lib/geo'

export interface BaseGeography {
  land: GeoJSON.FeatureCollection | GeoJSON.Feature
  borders: GeoJSON.MultiLineString
}

async function fetchTopology(url: string): Promise<Topology> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`)
  return (await res.json()) as Topology
}

let basePromise: Promise<BaseGeography> | null = null

/**
 * Land polygons and internal country borders at 1:50m, for the interactive map. Memoized: a remount
 * (StrictMode, the fallback's retry, a section reload) reuses the parsed geography; a failure is not cached.
 */
export function loadBaseGeography(): Promise<BaseGeography> {
  basePromise ??= buildBaseGeography().catch((error: unknown) => {
    basePromise = null
    throw error
  })
  return basePromise
}

async function buildBaseGeography(): Promise<BaseGeography> {
  const [topojson, land, countries] = await Promise.all([
    import('topojson-client'),
    fetchTopology(land50Url),
    fetchTopology(countries50Url),
  ])
  const borders = topojson.mesh(countries, countries.objects.countries as GeometryCollection, (a, b) => a !== b)
  return {
    land: repairFeatures(topojson.feature(land, land.objects.land as GeometryCollection)),
    borders: { type: 'MultiLineString', coordinates: splitAtAntimeridian(borders.coordinates) },
  }
}

/** Coarse 1:110m land for the static SVG fallback. */
export async function loadFallbackLand(): Promise<GeoJSON.Feature[]> {
  const [topojson, land] = await Promise.all([import('topojson-client'), fetchTopology(land110Url)])
  const result = repairFeatures(topojson.feature(land, land.objects.land as GeometryCollection))
  return 'features' in result ? result.features : [result]
}

function repairFeatures<T extends GeoJSON.FeatureCollection | GeoJSON.Feature>(input: T): T {
  if (input.type === 'Feature') return { ...input, geometry: repairPolygons(input.geometry) }
  return { ...input, features: input.features.map((f) => ({ ...f, geometry: repairPolygons(f.geometry) })) }
}

/** A faint 10° graticule. Meridians stop short of the poles, as on printed atlases. */
export function graticule(step = 10): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  const features: GeoJSON.Feature<GeoJSON.LineString>[] = []
  for (let lng = -180; lng <= 180; lng += step) {
    const coordinates: GeoJSON.Position[] = []
    for (let lat = -80; lat <= 80; lat += 2) coordinates.push([lng, lat])
    features.push({ type: 'Feature', properties: { kind: 'meridian' }, geometry: { type: 'LineString', coordinates } })
  }
  for (let lat = -80; lat <= 80; lat += step) {
    const coordinates: GeoJSON.Position[] = []
    for (let lng = -180; lng <= 180; lng += 5) coordinates.push([lng, lat])
    features.push({ type: 'Feature', properties: { kind: 'parallel' }, geometry: { type: 'LineString', coordinates } })
  }
  return { type: 'FeatureCollection', features }
}
