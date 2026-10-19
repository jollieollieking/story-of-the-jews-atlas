import { chapters, chaptersById, comparison, images, overlays, placesById, routes, stories } from '../../data'
import type { ArchivalImage, ChapterId, Source, SourceKind } from '../../types'

/**
 * Which chapters cite each source and use each image, derived from the data rather than typed by hand:
 * story cards (sources, key facts, images) -> place -> chapter; routes and overlays -> their chapters;
 * the Old World / New World comparison -> the Lower East Side chapter.
 */

const COMPARISON_CHAPTER: ChapterId = 'lower-east-side'

const byChapterOrder = (a: ChapterId, b: ChapterId) => chaptersById[a].number - chaptersById[b].number

function collect(pairs: [string, ChapterId][]): Map<string, ChapterId[]> {
  const sets = new Map<string, Set<ChapterId>>()
  for (const [key, chapterId] of pairs) {
    if (!key || !chaptersById[chapterId]) continue
    let set = sets.get(key)
    if (!set) sets.set(key, (set = new Set()))
    set.add(chapterId)
  }
  return new Map(Array.from(sets, ([key, set]) => [key, Array.from(set).sort(byChapterOrder)]))
}

export const chaptersBySource: Map<string, ChapterId[]> = collect([
  ...stories.flatMap((story) => {
    const chapterId = placesById[story.placeId]?.chapterId
    if (!chapterId) return []
    const ids = [...story.sourceIds, ...(story.keyFacts ?? []).map((fact) => fact.sourceId)]
    return ids.map((id): [string, ChapterId] => [id, chapterId])
  }),
  ...routes.flatMap((route) =>
    route.sourceIds.flatMap((id) => route.chapterIds.map((chapterId): [string, ChapterId] => [id, chapterId])),
  ),
  ...overlays.flatMap((overlay) =>
    chapters
      .filter((chapter) => chapter.overlayIds.includes(overlay.id))
      .flatMap((chapter) => overlay.sourceIds.map((id): [string, ChapterId] => [id, chapter.id])),
  ),
  ...comparison.sourceIds.map((id): [string, ChapterId] => [id, COMPARISON_CHAPTER]),
])

/** Content agents store images under /images/<chapter-id>/; used when no story card lists the image. */
function chapterFromPath(src: string): ChapterId | null {
  const match = /^\/images\/([^/]+)\//.exec(src)
  const id = match?.[1] as ChapterId | undefined
  return id && chaptersById[id] ? id : null
}

const chaptersByImage: Map<string, ChapterId[]> = collect([
  ...stories.flatMap((story) => {
    const chapterId = placesById[story.placeId]?.chapterId
    return chapterId ? story.imageIds.map((id): [string, ChapterId] => [id, chapterId]) : []
  }),
  ...[comparison.oldWorld.imageId, comparison.newWorld.imageId]
    .filter((id): id is string => Boolean(id))
    .map((id): [string, ChapterId] => [id, COMPARISON_CHAPTER]),
])

export function chaptersForImage(image: ArchivalImage): ChapterId[] {
  const listed = chaptersByImage.get(image.id)
  if (listed?.length) return listed
  const fromPath = chapterFromPath(image.src)
  return fromPath ? [fromPath] : []
}

export interface ImageGroup {
  chapterId: ChapterId | null
  images: ArchivalImage[]
}

/** Images grouped under the first chapter that uses them, in chapter order; unassigned images last. */
export function groupImagesByChapter(list: ArchivalImage[] = images): ImageGroup[] {
  const groups = new Map<ChapterId | null, ArchivalImage[]>()
  for (const image of list) {
    const key = chaptersForImage(image)[0] ?? null
    const bucket = groups.get(key) ?? []
    bucket.push(image)
    groups.set(key, bucket)
  }
  return Array.from(groups, ([chapterId, imgs]) => ({ chapterId, images: imgs })).sort((a, b) => {
    if (a.chapterId === null) return 1
    if (b.chapterId === null) return -1
    return byChapterOrder(a.chapterId, b.chapterId)
  })
}

export const DOCUMENTARY_KINDS: SourceKind[] = ['documentary', 'transcript']

export const HISTORICAL_GROUPS: { kind: SourceKind; label: string }[] = [
  { kind: 'institutional', label: 'Museums & institutions' },
  { kind: 'encyclopedia', label: 'Encyclopedias & reference works' },
  { kind: 'archive', label: 'Archives & collections' },
  { kind: 'dataset', label: 'Datasets' },
]

export function isDocumentary(source: Source) {
  return DOCUMENTARY_KINDS.includes(source.kind)
}

/** "pbs.org" from "https://www.pbs.org/wnet/...". */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
