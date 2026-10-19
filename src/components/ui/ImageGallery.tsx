import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ArchivalImage } from '../../types'
import { ArchivalFigure } from './ArchivalFigure'
import { isRecentImage } from './imageDate'

interface ImageGalleryProps {
  images: ArchivalImage[]
  /** Accessible name for the gallery, e.g. "Images of Uman". */
  label: string
  /** Fade only, no movement (used in the memorial chapter). */
  quiet?: boolean
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/**
 * One large archival figure plus a strip of thumbnails. Thumbnails are a roving-focus group:
 * Left/Right/Home/End move between images; the large figure follows.
 */
export function ImageGallery({ images, label, quiet = false }: ImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const thumbs = useRef<(HTMLButtonElement | null)[]>([])
  if (images.length === 0) return null

  const current = Math.min(index, images.length - 1)
  const active = images[current]

  const select = (i: number, focus = false) => {
    const next = (i + images.length) % images.length
    setIndex(next)
    if (focus) thumbs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: images.length - 1 }
    if (!(e.key in map)) return
    e.preventDefault()
    select(map[e.key], true)
  }

  const onStepKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    select(current + (e.key === 'ArrowRight' ? 1 : -1))
  }

  return (
    <div role="group" aria-roledescription="gallery" aria-label={label}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: quiet ? 0.6 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArchivalFigure image={active} eager={current === 0} />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <div role="group" aria-label="Choose an image" onKeyDown={onKeyDown} className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 scroll-elegant">
            {images.map((img, i) => (
              <button
                key={img.id}
                ref={(el) => {
                  thumbs.current[i] = el
                }}
                type="button"
                tabIndex={i === current ? 0 : -1}
                aria-pressed={i === current}
                aria-label={`Show image ${i + 1} of ${images.length}: ${img.alt}`}
                onClick={() => select(i)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden border transition-[border-color,opacity] duration-300 ${
                  i === current ? 'border-gold opacity-100' : 'border-line opacity-60 hover:opacity-90'
                }`}
              >
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={isRecentImage(img) ? undefined : { filter: 'sepia(0.2) saturate(0.8)' }}
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
              </button>
            ))}
          </div>
          {/* Arrow keys on the previous/next buttons step through the images (and do not reach the
              atlas-wide chapter shortcuts). */}
          <div className="flex shrink-0 items-center gap-1" onKeyDown={onStepKeyDown}>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => select(current - 1)}
              className="grid size-8 place-items-center border border-line text-mist transition-colors hover:border-line-strong hover:text-parchment"
            >
              <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </button>
            <span className="label w-14 text-center text-[0.625rem] text-mist" aria-live="polite">
              {pad2(current + 1)} / {pad2(images.length)}
            </span>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => select(current + 1)}
              className="grid size-8 place-items-center border border-line text-mist transition-colors hover:border-line-strong hover:text-parchment"
            >
              <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
