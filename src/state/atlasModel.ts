import { OVERVIEW_CAMERA, OVERVIEW_CAMERA_MOBILE, chapters, chaptersById, periodsById, places, placesById } from '../data'
import type { CameraView, Chapter, ChapterId, OverlayId, Period, PeriodId, Place, PlaceId } from '../types'

/**
 * Atlas state shared by the map, story panel, timeline and guided journey.
 *
 * Flow: UI dispatches an action -> reducer updates focus -> `cameraRequest` gets a new nonce ->
 * MapView flies to `cameraTarget` (derived below). Nothing else moves the camera programmatically.
 */

export type AtlasMode = 'free' | 'guided'

/** What the side panel is showing. */
export type PanelView = 'chapter' | 'place' | 'comparison' | null

/** What the user last focused: the opening overview, a whole chapter, a timeline period, or one place. */
export type Focus =
  | { kind: 'overview' }
  | { kind: 'chapter'; id: ChapterId }
  | { kind: 'period'; id: PeriodId }
  | { kind: 'place'; id: PlaceId }

export interface AtlasState {
  mode: AtlasMode
  /** The chapter the guided journey / chapter controls are on. Always set. */
  chapterId: ChapterId
  /** The timeline period shown as active. Always set. */
  periodId: PeriodId
  focus: Focus
  selectedPlaceId: PlaceId | null
  panel: PanelView
  /** Incremented whenever the camera should move. MapView watches this. */
  cameraNonce: number
  /** True once the guided journey reaches its end and hands off to the reflection section. */
  journeyComplete: boolean
}

export type AtlasAction =
  | { type: 'START_GUIDED' }
  | { type: 'START_FREE' }
  | { type: 'GO_TO_CHAPTER'; id: ChapterId }
  | { type: 'NEXT_CHAPTER' }
  | { type: 'PREV_CHAPTER' }
  | { type: 'SELECT_PERIOD'; id: PeriodId }
  | { type: 'SELECT_PLACE'; id: PlaceId }
  | { type: 'SHOW_CHAPTER_PANEL' }
  | { type: 'OPEN_COMPARISON' }
  /** Back from the comparison to the place card, without moving the camera. */
  | { type: 'CLOSE_COMPARISON' }
  | { type: 'CLOSE_PANEL' }
  | { type: 'FINISH_JOURNEY' }
  | { type: 'RESET_VIEW' }

const firstChapter = chapters[0]

export const initialAtlasState: AtlasState = {
  mode: 'free',
  chapterId: firstChapter.id,
  periodId: firstChapter.periodId,
  focus: { kind: 'overview' },
  selectedPlaceId: null,
  panel: null,
  cameraNonce: 0,
  journeyComplete: false,
}

function goToChapter(state: AtlasState, id: ChapterId): AtlasState {
  const chapter = chaptersById[id]
  return {
    ...state,
    chapterId: id,
    periodId: chapter.periodId,
    focus: { kind: 'chapter', id },
    /* Only a place the user actually chose is "selected"; a chapter lights its places instead. */
    selectedPlaceId: null,
    panel: 'chapter',
    cameraNonce: state.cameraNonce + 1,
  }
}

function step(state: AtlasState, delta: 1 | -1): AtlasState {
  const index = chapters.findIndex((c) => c.id === state.chapterId)
  const next = chapters[index + delta]
  if (!next) return state
  return goToChapter(state, next.id)
}

export function atlasReducer(state: AtlasState, action: AtlasAction): AtlasState {
  switch (action.type) {
    case 'START_GUIDED':
      return { ...goToChapter(state, firstChapter.id), mode: 'guided', journeyComplete: false }
    case 'START_FREE':
      return { ...state, mode: 'free' }
    case 'GO_TO_CHAPTER':
      return goToChapter(state, action.id)
    case 'NEXT_CHAPTER':
      return step(state, 1)
    case 'PREV_CHAPTER':
      return step(state, -1)
    case 'SELECT_PERIOD': {
      const period = periodsById[action.id]
      const chapterId = period.chapterIds[0]
      return {
        ...state,
        periodId: action.id,
        chapterId,
        focus: { kind: 'period', id: action.id },
        selectedPlaceId: null,
        panel: 'chapter',
        cameraNonce: state.cameraNonce + 1,
      }
    }
    case 'SELECT_PLACE': {
      const place = placesById[action.id]
      return {
        ...state,
        chapterId: place.chapterId,
        periodId: place.periodIds.includes(state.periodId) ? state.periodId : chaptersById[place.chapterId].periodId,
        focus: { kind: 'place', id: action.id },
        selectedPlaceId: action.id,
        panel: 'place',
        cameraNonce: state.cameraNonce + 1,
      }
    }
    case 'SHOW_CHAPTER_PANEL':
      return { ...state, panel: 'chapter' }
    case 'OPEN_COMPARISON':
      return { ...state, panel: 'comparison' }
    case 'CLOSE_COMPARISON':
      return { ...state, panel: state.selectedPlaceId ? 'place' : 'chapter' }
    case 'CLOSE_PANEL':
      return { ...state, panel: null }
    case 'FINISH_JOURNEY':
      return { ...state, journeyComplete: true, mode: 'free' }
    case 'RESET_VIEW':
      return { ...initialAtlasState, mode: state.mode, cameraNonce: state.cameraNonce + 1 }
  }
}

/** Everything the UI needs, derived once from state. */
export interface AtlasView {
  chapter: Chapter
  chapterNumber: number
  chapterCount: number
  hasPrev: boolean
  hasNext: boolean
  period: Period
  selectedPlace: Place | null
  /** Places drawn at full strength; everything else is dimmed. */
  highlightedPlaceIds: Set<PlaceId>
  visibleRouteIds: Set<string>
  visibleOverlayIds: Set<OverlayId>
  visibleContextMarkerIds: Set<string>
  /** Where the camera should be after the latest action. Use `mobileCamera` on narrow screens. */
  cameraTarget: { camera: CameraView; mobileCamera?: CameraView }
  /** 'solemn' when the focus is Chapter 07: no decorative motion, memorial palette. */
  tone: Chapter['tone']
}

export function deriveView(state: AtlasState): AtlasView {
  const chapter = chaptersById[state.chapterId]
  const period = periodsById[state.periodId]
  const index = chapters.findIndex((c) => c.id === chapter.id)
  const activeChapters: Chapter[] =
    state.focus.kind === 'overview'
      ? []
      : state.focus.kind === 'period'
        ? period.chapterIds.map((id) => chaptersById[id])
        : [chapter]

  const selectedPlace = state.selectedPlaceId ? placesById[state.selectedPlaceId] : null

  let cameraTarget: AtlasView['cameraTarget']
  if (state.focus.kind === 'overview') {
    cameraTarget = { camera: OVERVIEW_CAMERA, mobileCamera: OVERVIEW_CAMERA_MOBILE }
  } else if (state.focus.kind === 'period') {
    cameraTarget = { camera: period.camera, mobileCamera: period.mobileCamera }
  } else if (state.focus.kind === 'place' && selectedPlace) {
    const camera = { center: selectedPlace.coordinates, zoom: selectedPlace.focusZoom }
    cameraTarget = { camera, mobileCamera: { ...camera, zoom: Math.max(1.2, selectedPlace.focusZoom - 0.7) } }
  } else {
    cameraTarget = { camera: chapter.camera, mobileCamera: chapter.mobileCamera }
  }

  return {
    chapter,
    chapterNumber: chapter.number,
    chapterCount: chapters.length,
    hasPrev: index > 0,
    hasNext: index < chapters.length - 1,
    period,
    selectedPlace,
    /* In the overview every place is lit; otherwise only the focused chapter(s) or period. */
    highlightedPlaceIds: new Set(
      state.focus.kind === 'overview'
        ? places.map((p) => p.id)
        : state.focus.kind === 'period'
          ? places.filter((p) => p.periodIds.includes(period.id)).map((p) => p.id)
          : activeChapters.flatMap((c) => c.placeIds),
    ),
    visibleRouteIds: new Set(activeChapters.flatMap((c) => c.routeIds)),
    visibleOverlayIds: new Set(activeChapters.flatMap((c) => c.overlayIds)),
    visibleContextMarkerIds: new Set(activeChapters.flatMap((c) => c.contextMarkerIds)),
    cameraTarget,
    tone: activeChapters.some((c) => c.tone === 'solemn') ? 'solemn' : 'default',
  }
}
