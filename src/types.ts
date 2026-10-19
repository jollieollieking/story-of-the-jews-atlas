/**
 * Shared data contract for the atlas. Every data file in src/data and every
 * component reads these shapes, so change them deliberately.
 */

/** [longitude, latitude] in WGS84 degrees, the order MapLibre and GeoJSON use. */
export type LngLat = [number, number]

export type ChapterId =
  | 'shtetls'
  | 'pale'
  | 'faith-ideas'
  | 'atlantic'
  | 'lower-east-side'
  | 'american-culture'
  | 'destruction'

export type PeriodId =
  | 'settlement'
  | 'partitions'
  | 'pale-life'
  | 'emigration'
  | 'american-culture'
  | 'destruction'

export type PlaceId =
  | 'polish-lithuanian-commonwealth'
  | 'lithuania'
  | 'pale-of-settlement'
  | 'uman'
  | 'odesa'
  | 'new-york-harbor'
  | 'lower-east-side'
  | 'tin-pan-alley'
  | 'hollywood'
  | 'plunge'
  | 'kosice'

export interface CameraView {
  center: LngLat
  zoom: number
  bearing?: number
  pitch?: number
}

export type SourceKind = 'documentary' | 'transcript' | 'institutional' | 'encyclopedia' | 'archive' | 'dataset'

export interface Source {
  id: string
  title: string
  /** Author or institution, e.g. "YIVO Institute for Jewish Research". */
  publisher: string
  url: string
  kind: SourceKind
  /** What this source was used for on the site. */
  usedFor?: string
}

export interface ArchivalImage {
  id: string
  /** Root-relative path to a file in /public, e.g. "/images/hester-street-1903.jpg". */
  src: string
  width: number
  height: number
  alt: string
  /** Visible caption, identifying the image as historical, e.g. "Hester Street, New York, c. 1903". */
  caption: string
  date?: string
  /** Photographer, artist or publisher. "Unknown" when unrecorded. */
  creator: string
  /** Holding institution, e.g. "Library of Congress". */
  institution?: string
  /** e.g. "Public domain", "CC BY-SA 4.0". */
  license: string
  licenseUrl?: string
  /** The page the image came from (Wikimedia Commons file page or archive record). */
  sourceUrl: string
}

/** A short, sourced figure shown as a highlighted fact on a story card. */
export interface KeyFact {
  label: string
  value: string
  sourceId: string
}

export interface StoryCard {
  placeId: PlaceId
  /** The historical event or theme, e.g. "Hasidism and Rabbi Nachman of Breslov". */
  theme: string
  /** Human-readable period, e.g. "Late 18th century to today". */
  period: string
  /** WHAT HAPPENED: one to three short paragraphs. */
  whatHappened: string[]
  /** WHY IT MATTERS: one short paragraph. */
  whyItMatters: string
  /**
   * CONNECTION TO THE DOCUMENTARY: what Episode 4 shows or discusses here.
   * Only content supported by the PBS episode page or transcript; no invented quotes.
   */
  documentaryConnection: string
  keyFacts?: KeyFact[]
  imageIds: string[]
  sourceIds: string[]
  /** Anything that could not be confirmed. Rendered visibly as "Marked for verification". */
  needsVerification?: string[]
}

export type PlaceKind = 'city' | 'town' | 'region' | 'neighborhood' | 'port'

export interface Place {
  id: PlaceId
  name: string
  /** Modern country, e.g. "Ukraine". */
  country: string
  /** Historical political context, e.g. "Kiev Governorate, Russian Empire". */
  historicalContext: string
  coordinates: LngLat
  kind: PlaceKind
  /** For regions, the marker sits at an approximate centre; say so in the UI. */
  approximate?: boolean
  /** Zoom used when the camera flies to this place on its own. */
  focusZoom: number
  chapterId: ChapterId
  periodIds: PeriodId[]
}

export type RouteKind = 'overland' | 'sea' | 'internal' | 'deportation'

export interface Route {
  id: string
  kind: RouteKind
  label: string
  /** Waypoints in order. Arcs are interpolated along great circles between them. */
  path: LngLat[]
  fromLabel: string
  toLabel: string
  years: string
  /** Why it is reasonable to draw this movement. */
  evidence: string
  sourceIds: string[]
  chapterIds: ChapterId[]
}

export type OverlayId = 'pale-1835'

export interface Overlay {
  id: OverlayId
  label: string
  /** Date the boundary represents, shown in the legend. */
  dateLabel: string
  /** Visible caveat, e.g. "Approximate, simplified boundary". */
  caveat: string
  sourceIds: string[]
  geojson: GeoJSON.FeatureCollection
}

/** A labelled waypoint shown on the map that is context, not a story location (e.g. a port). */
export interface ContextMarker {
  id: string
  name: string
  coordinates: LngLat
  note: string
  chapterIds: ChapterId[]
}

export interface Chapter {
  id: ChapterId
  /** 1-based chapter number. */
  number: number
  title: string
  /** A short line under the title. */
  subtitle: string
  dateRange: string
  /** Guided-journey narration: two to four concise sentences. */
  summary: string
  placeIds: PlaceId[]
  routeIds: string[]
  overlayIds: OverlayId[]
  contextMarkerIds: string[]
  camera: CameraView
  /** Optional tighter/looser framing for narrow screens. */
  mobileCamera?: CameraView
  periodId: PeriodId
  /** 'solemn' disables decorative motion and switches to the memorial palette. */
  tone: 'default' | 'solemn'
}

export interface Period {
  id: PeriodId
  label: string
  /** Compact label for the timeline rail, e.g. "1881–1924". */
  years: string
  description: string
  chapterIds: ChapterId[]
  camera: CameraView
  mobileCamera?: CameraView
}

/** Everything one chapter's content file (src/data/stories/<chapter>.ts) exports. */
export interface ChapterContent {
  chapterText: Pick<Chapter, 'subtitle' | 'dateRange' | 'summary'>
  /** One card per place in the chapter. */
  stories: StoryCard[]
  /** Sources cited by this chapter's cards (shared sources live in src/data/sources.ts). */
  sources: Source[]
  /** Archival images used by this chapter, files stored under /public/images/<chapter>/. */
  images: ArchivalImage[]
}

/** One column of the Old World / New World comparison. */
export interface ComparisonColumn {
  heading: string
  place: string
  era: string
  imageId?: string
  points: { label: string; text: string }[]
}

export interface Comparison {
  title: string
  intro: string
  oldWorld: ComparisonColumn
  newWorld: ComparisonColumn
  sourceIds: string[]
}
