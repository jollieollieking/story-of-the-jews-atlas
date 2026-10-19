import { useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, X } from 'lucide-react'
import { comparison, imagesById, sourcesById } from '../../data'
import type { ComparisonColumn } from '../../types'
import { ArchivalFigure } from '../ui/ArchivalFigure'
import { SourceList } from '../ui/SourceList'
import { useFocusTrap } from '../ui/useFocusTrap'
import { EASE_CINEMA } from './atlasUi'

/**
 * Old World / New World comparison as a modal dialog over the atlas: two columns with paired points
 * aligned row by row (stacked in pairs on phones). Escape, the close button or the backdrop return to the
 * Lower East Side story.
 */
export function ComparisonDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)
  useFocusTrap(dialog, onClose)

  const { oldWorld, newWorld } = comparison
  const rows = Math.max(oldWorld.points.length, newWorld.points.length)
  const compSources = comparison.sourceIds.map((id) => sourcesById[id]).filter(Boolean)

  return (
    <div className="absolute inset-0 z-40">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
        transition={{ duration: 0.7, ease: EASE_CINEMA }}
        className="absolute inset-x-0 bottom-0 top-[calc(var(--atlas-nav)+0.5rem)] flex flex-col border-t border-line-strong bg-ink-2 md:inset-x-6 md:bottom-6 md:top-[calc(var(--atlas-nav)+1.5rem)] md:mx-auto md:max-w-[68rem] md:border"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-2.5 md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="label -ml-1 inline-flex items-center gap-2 px-1 py-2 text-[0.625rem] text-mist transition-colors hover:text-parchment"
          >
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
            Back to the Lower East Side
          </button>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close comparison"
            className="-mr-2 grid size-9 place-items-center text-mist transition-colors hover:text-parchment"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-[1.125rem]" />
          </button>
        </div>

        <div className="scroll-elegant min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-12 pt-8 md:px-12 md:pt-10">
          <p className="label text-gold">Old World / New World</p>
          <h3 id="comparison-title" className="mt-3 max-w-[30ch] text-balance font-serif text-[2.25rem] font-light leading-[1.04] text-parchment md:text-[3rem]">
            {comparison.title}
          </h3>
          {comparison.intro && (
            <p className="mt-5 max-w-[62ch] text-pretty text-[0.9375rem] leading-[1.75] text-parchment/85">{comparison.intro}</p>
          )}

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <ColumnHead column={oldWorld} />
            <ColumnHead column={newWorld} />
          </div>

          {rows > 0 && (
            <div className="mt-10 border-t border-line-strong">
              {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="grid gap-x-12 border-b border-line md:grid-cols-2">
                  <PointCell column={oldWorld} index={i} />
                  <PointCell column={newWorld} index={i} />
                </div>
              ))}
            </div>
          )}

          {compSources.length > 0 && (
            <section className="mt-12 max-w-[44rem]" aria-label="Sources for the comparison">
              <p className="label mb-4 text-gold">Sources</p>
              <SourceList sources={compSources} />
            </section>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function ColumnHead({ column }: { column: ComparisonColumn }) {
  const image = column.imageId ? imagesById[column.imageId] : undefined
  return (
    <div>
      <p className="label text-[0.625rem] text-gold">{column.heading}</p>
      <p className="mt-2 font-serif text-[1.75rem] leading-tight text-parchment">{column.place}</p>
      {column.era && <p className="label mt-2 text-[0.625rem] text-mist">{column.era}</p>}
      {/* Both columns use the same square frame so the paired images and their captions line up; the
          full, uncropped images are in the place cards and behind each Source link. */}
      {image && <ArchivalFigure image={image} className="mt-5" maxHeight="min(44vh, 400px)" frameRatio={1} fit="cover" />}
    </div>
  )
}

function PointCell({ column, index }: { column: ComparisonColumn; index: number }) {
  const point = column.points[index]
  if (!point) return <div aria-hidden="true" className="hidden md:block" />
  return (
    <div className="py-5">
      <p className="label text-[0.625rem] text-ash">
        <span className="md:hidden">{column.heading} · </span>
        {point.label}
      </p>
      <p className="mt-2 text-pretty text-[0.9375rem] leading-[1.7] text-parchment/85">{point.text}</p>
    </div>
  )
}
