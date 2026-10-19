import type { Chapter, ChapterId } from '../types'
import { chapterContent } from './stories'

type ChapterFrame = Omit<Chapter, 'subtitle' | 'dateRange' | 'summary'>

/** Structure and camera framing. Narrative text lives in src/data/stories/<chapter>.ts. */
const frames: ChapterFrame[] = [
  {
    id: 'shtetls',
    number: 1,
    title: 'Eastern Europe: A World of Shtetls',
    placeIds: ['polish-lithuanian-commonwealth', 'lithuania'],
    routeIds: [],
    overlayIds: [],
    contextMarkerIds: [],
    camera: { center: [24.0, 53.1], zoom: 4.6 },
    mobileCamera: { center: [24.0, 53.1], zoom: 3.75 },
    periodId: 'settlement',
    tone: 'default',
  },
  {
    id: 'pale',
    number: 2,
    title: 'The Pale of Settlement',
    placeIds: ['pale-of-settlement'],
    routeIds: [],
    overlayIds: ['pale-1835'],
    contextMarkerIds: [],
    camera: { center: [28.2, 50.6], zoom: 4.35 },
    mobileCamera: { center: [28.2, 50.6], zoom: 3.6 },
    periodId: 'partitions',
    tone: 'default',
  },
  {
    id: 'faith-ideas',
    number: 3,
    title: 'Faith, Culture, and New Ideas',
    placeIds: ['uman', 'odesa'],
    routeIds: [],
    overlayIds: ['pale-1835'],
    contextMarkerIds: [],
    camera: { center: [30.5, 47.65], zoom: 6.4 },
    mobileCamera: { center: [30.5, 47.65], zoom: 5.6 },
    periodId: 'pale-life',
    tone: 'default',
  },
  {
    id: 'atlantic',
    number: 4,
    title: 'Across the Atlantic',
    placeIds: ['new-york-harbor'],
    routeIds: ['pale-to-hamburg', 'pale-to-bremen', 'hamburg-to-new-york', 'bremen-to-new-york'],
    overlayIds: ['pale-1835'],
    contextMarkerIds: ['hamburg', 'bremen'],
    camera: { center: [-26, 47.5], zoom: 2.45 },
    mobileCamera: { center: [-23, 48], zoom: 1.25 },
    periodId: 'emigration',
    tone: 'default',
  },
  {
    id: 'lower-east-side',
    number: 5,
    title: 'The Lower East Side',
    placeIds: ['lower-east-side'],
    routeIds: [],
    overlayIds: [],
    contextMarkerIds: [],
    camera: { center: [-73.99, 40.716], zoom: 13.4 },
    mobileCamera: { center: [-73.99, 40.716], zoom: 12.8 },
    periodId: 'emigration',
    tone: 'default',
  },
  {
    id: 'american-culture',
    number: 6,
    title: 'Transforming American Culture',
    placeIds: ['tin-pan-alley', 'hollywood'],
    routeIds: ['new-york-to-hollywood'],
    overlayIds: [],
    contextMarkerIds: [],
    camera: { center: [-96, 38.6], zoom: 3.35 },
    mobileCamera: { center: [-96, 38.6], zoom: 2.4 },
    periodId: 'american-culture',
    tone: 'default',
  },
  {
    id: 'destruction',
    number: 7,
    title: 'The Destruction of a World',
    placeIds: ['plunge', 'kosice'],
    routeIds: ['kosice-to-auschwitz'],
    overlayIds: [],
    contextMarkerIds: ['auschwitz-birkenau'],
    camera: { center: [21.4, 52.4], zoom: 5.0 },
    mobileCamera: { center: [21.4, 52.4], zoom: 4.3 },
    periodId: 'destruction',
    tone: 'solemn',
  },
]

export const chapters: Chapter[] = frames.map((frame) => ({ ...frame, ...chapterContent[frame.id].chapterText }))

export const chaptersById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, Chapter>

export const chapterIndex = (id: ChapterId) => chapters.findIndex((c) => c.id === id)
