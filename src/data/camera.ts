import type { CameraView } from '../types'

/**
 * Opening view: Eastern Europe, the Atlantic and the United States (Hollywood included) in one frame.
 * Composed so every story marker clears the left edge and the zoom controls from 1280px wide up.
 * On phones (zoom 1 is the map's minimum) the frame holds New York and Eastern Europe; Hollywood is too far west to fit.
 */
export const OVERVIEW_CAMERA: CameraView = { center: [-36, 47.5], zoom: 2.35 }
export const OVERVIEW_CAMERA_MOBILE: CameraView = { center: [-25, 47], zoom: 1 }
