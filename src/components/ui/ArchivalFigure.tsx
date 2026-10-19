import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { ArchivalImage } from '../../types'
import { ExternalLink } from './ExternalLink'
import { isRecentImage, shortImageName } from './imageDate'

interface ArchivalFigureProps {
  image: ArchivalImage
  className?: string
  /** Load immediately (for the first, above-the-fold image). */
  eager?: boolean
  /** Hide the caption and credit (for compact uses). */
  compact?: boolean
  /** CSS max-height for the image frame. The frame narrows to keep the image's proportions under it. */
  maxHeight?: string
  /** Fixed frame proportions (width / height) instead of the image's own, e.g. 4 / 3 for paired images. */
  frameRatio?: number
  /** 'contain' shows the whole image (default); 'cover' fills the frame, cropping the edges. */
  fit?: 'contain' | 'cover'
}

/** A gentle warm grade so photographs from different archives sit together without looking filtered. */
const ARCHIVAL_GRADE = 'sepia(0.14) saturate(0.88) contrast(1.03) brightness(0.97)'

/**
 * A historical image with its caption and full credit line. Recent photographs (of memorials, plaques or
 * surviving buildings) are labelled as such and shown without the archival grade. If the file fails to load, it falls back to a
 * typographic placeholder that still carries the alt text and caption, so no information is lost.
 */
export function ArchivalFigure({
  image,
  className = '',
  eager = false,
  compact = false,
  maxHeight = 'min(58vh, 520px)',
  frameRatio,
  fit = 'contain',
}: ArchivalFigureProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc === image.src
  const aspect = frameRatio ?? (image.width > 0 && image.height > 0 ? image.width / image.height : 4 / 3)
  const recent = isRecentImage(image)
  const name = shortImageName(image)

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className={`relative w-full overflow-hidden border border-line bg-ink-3 ${frameRatio ? '' : 'mx-auto'}`}
        style={{ aspectRatio: String(aspect), maxHeight, maxWidth: `calc(${maxHeight} * ${aspect.toFixed(4)})` }}
      >
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 py-8 text-center">
            <ImageOff aria-hidden="true" strokeWidth={1.25} className="size-6 text-ash" />
            <p className="label text-ash">Image unavailable</p>
            <p className="max-w-[28ch] font-serif text-base italic leading-snug text-mist">{image.alt}</p>
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width || undefined}
            height={image.height || undefined}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailedSrc(image.src)}
            className={`h-full w-full ${fit === 'cover' ? 'object-cover object-[center_30%]' : 'object-contain'}`}
            style={recent ? undefined : { filter: ARCHIVAL_GRADE }}
          />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_48px_rgba(0,0,0,0.35)]" />
        <span className="label absolute left-2 top-2 bg-ink/75 px-2 py-1 text-[0.625rem] text-parchment/85 backdrop-blur-sm">
          {recent ? 'Recent photograph' : 'Historical image'}
        </span>
      </div>

      {!compact && (
        <figcaption className="mt-3 space-y-1.5">
          {image.caption && <p className="text-[0.8125rem] leading-relaxed text-parchment/80">{image.caption}</p>}
          <p className="text-[0.6875rem] leading-relaxed text-ash">
            <span>Credit: {image.creator || 'Unknown'}</span>
            {image.institution && <span> · {image.institution}</span>}
            <span> · </span>
            {image.licenseUrl ? (
              <ExternalLink
                href={image.licenseUrl}
                bare
                aria-label={`${image.license}, license for: ${name} (opens in a new tab)`}
              >
                {image.license}
              </ExternalLink>
            ) : (
              <span>{image.license}</span>
            )}
            <span> · </span>
            <ExternalLink href={image.sourceUrl} aria-label={`Source: ${name} (opens in a new tab)`}>
              Source
            </ExternalLink>
          </p>
        </figcaption>
      )}
    </figure>
  )
}
