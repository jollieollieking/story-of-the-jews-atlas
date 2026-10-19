import type { ArchivalImage } from '../../types'

/**
 * True for photographs taken recently (1990 or later), judged by the first four-digit year in the image's
 * date, e.g. "2012 (photograph); the memorial's date is not recorded". These are not shown as historical
 * images and get no archival grade. Images with no year count as historical.
 */
export function isRecentImage(image: Pick<ArchivalImage, 'date'>): boolean {
  const year = Number(/\b(1[5-9]\d\d|20\d\d)\b/.exec(image.date ?? '')?.[1] ?? 0)
  return year >= 1990
}

/** A short name for an image (first sentence of the caption, or the alt text), for link labels. */
export function shortImageName(image: Pick<ArchivalImage, 'caption' | 'alt'>): string {
  const text = (image.caption || image.alt).trim()
  /* First sentence: a full stop or semicolon followed by a capital letter (so "c. 1903" stays whole). */
  const first = text.split(/(?<=[.;])\s+(?=[A-Z\u00C0-\u017F])/)[0].replace(/[.;]$/, '')
  return first.length > 90 ? `${first.slice(0, 87).trimEnd()}…` : first
}
