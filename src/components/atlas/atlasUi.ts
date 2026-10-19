import type { HTMLMotionProps } from 'motion/react'
import type { Comparison, PeriodId, PlaceKind } from '../../types'

export type Tone = 'default' | 'solemn'

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const EASE_CINEMA = [0.22, 1, 0.36, 1] as const

type MotionPreset = Pick<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition'>

/** Fade and rise for normal chapters; a slow plain fade for the memorial chapter. */
export function fadeRise(tone: Tone, distance = 12, duration = 0.7): MotionPreset {
  if (tone === 'solemn') {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: duration * 1.6, ease: 'easeInOut' },
    }
  }
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -distance / 2 },
    transition: { duration, ease: EASE_CINEMA },
  }
}

/** Compact period names for the phone and tablet timeline rail. Falls back to the full label. */
const SHORT_PERIOD_LABEL: Record<PeriodId, string> = {
  settlement: 'Jewish settlement',
  partitions: 'Russian control',
  'pale-life': 'Life in the Pale',
  emigration: 'Mass emigration',
  'american-culture': 'American culture',
  destruction: 'The Holocaust',
}
export const shortPeriodLabel = (id: PeriodId, fallback: string) => SHORT_PERIOD_LABEL[id] ?? fallback

/**
 * Period names for the desktop rail from xl up to very wide screens, where the full labels would be cut off with
 * an ellipsis. Descriptive, at most two lines; the full label stays in the radio's accessible name.
 */
const MEDIUM_PERIOD_LABEL: Record<PeriodId, string> = {
  settlement: 'Jewish settlement',
  partitions: 'Expansion of Russian control',
  'pale-life': 'Life in the Pale',
  emigration: 'Mass emigration',
  'american-culture': 'Jewish culture in America',
  destruction: 'Destruction of communities',
}
export const mediumPeriodLabel = (id: PeriodId, fallback: string) => MEDIUM_PERIOD_LABEL[id] ?? fallback

export const PLACE_KIND_LABEL: Record<PlaceKind, string> = {
  city: 'City',
  town: 'Town',
  region: 'Region',
  neighborhood: 'Neighborhood',
  port: 'Port',
}

/** The comparison view is only offered once its content exists. */
export const hasComparisonContent = (c: Comparison) =>
  Boolean(c.title) && (c.oldWorld.points.length > 0 || c.newWorld.points.length > 0)

/** Accent text colour for the current tone. */
export const accentText = (tone: Tone) => (tone === 'solemn' ? 'text-memorial' : 'text-gold')
