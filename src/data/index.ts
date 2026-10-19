/**
 * Single entry point for all atlas data. Components import from here.
 */
import type { ArchivalImage, PlaceId, Source, StoryCard } from '../types'
import { chapterContent } from './stories'
import { sharedSources } from './sources'
import { comparison, comparisonSources } from './comparison'
import { overlaySources } from './overlays'

export { places, placesById } from './places'
export { chapters, chaptersById, chapterIndex } from './chapters'
export { periods, periodsById } from './periods'
export { routes, routesById, contextMarkers, contextMarkersById } from './routes'
export { overlays, overlaysById } from './overlays'
export { comparison }
export { OVERVIEW_CAMERA, OVERVIEW_CAMERA_MOBILE } from './camera'

const contents = Object.values(chapterContent)

export const stories: StoryCard[] = contents.flatMap((c) => c.stories)
export const storiesByPlace = Object.fromEntries(stories.map((s) => [s.placeId, s])) as Partial<
  Record<PlaceId, StoryCard>
>

/** All sources, de-duplicated by id, shared ones first. */
export const sources: Source[] = Array.from(
  new Map(
    [...sharedSources, ...contents.flatMap((c) => c.sources), ...comparisonSources, ...overlaySources].map((s) => [s.id, s]),
  ).values(),
)
export const sourcesById = Object.fromEntries(sources.map((s) => [s.id, s])) as Record<string, Source>

/** All archival images, de-duplicated by id. */
export const images: ArchivalImage[] = Array.from(
  new Map(contents.flatMap((c) => c.images).map((i) => [i.id, i])).values(),
)
export const imagesById = Object.fromEntries(images.map((i) => [i.id, i])) as Record<string, ArchivalImage>
