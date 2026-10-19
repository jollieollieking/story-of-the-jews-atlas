import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useAtlas } from '../../state/atlas'
import { chapters } from '../../data'
import { EASE_CINEMA } from './atlasUi'

/**
 * The first thing a visitor sees over the overview map: start the guided journey, or explore freely.
 * Centred in the visible map area: over the Atlantic in the overview framing, so it hides neither continent.
 * data-entry-prompt marks the card so the map's label layout can treat it as an obstacle.
 */
export function EntryPrompt({ onExplore }: { onExplore: () => void }) {
  const { dispatch } = useAtlas()

  return (
    /* Spans the visible map area between header and timeline, so the card never overlaps either. */
    <div className="pointer-events-none absolute inset-x-4 bottom-[calc(var(--atlas-bottom-inset)+0.75rem)] top-[var(--atlas-top-inset)] z-20 flex flex-col justify-end md:bottom-[calc(var(--atlas-bottom-inset)+3.5rem)] md:left-0 md:right-[var(--atlas-right-inset)] md:items-center md:justify-center md:py-4">
    <motion.div
      role="region"
      data-yield-focus
      data-entry-prompt
      aria-label="Start exploring"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.35 } }}
      transition={{ duration: 0.9, delay: 0.15, ease: EASE_CINEMA }}
      className="scroll-elegant pointer-events-auto max-h-full overflow-y-auto border md:w-[25rem] border-line-strong bg-ink-2/95 backdrop-blur-sm"
    >
      <div aria-hidden="true" className="h-px w-16 bg-gold" />
      <div className="p-5 md:p-7 [@media(max-height:800px)]:md:p-6">
        <p className="label text-gold">Start here</p>
        <p className="mt-3 font-serif text-[1.65rem] font-light leading-[1.1] text-parchment md:text-[1.9rem] [@media(max-height:800px)]:text-[1.5rem]">
          {chapters.length} chapters across two continents
        </p>

        <button
          type="button"
          onClick={() => dispatch({ type: 'START_GUIDED' })}
          className="group mt-5 flex w-full items-center justify-between gap-4 bg-gold px-5 py-4 text-left text-ink transition-colors duration-300 hover:bg-gold-soft md:mt-6"
        >
          <span>
            <span className="block text-[0.9375rem] font-medium">Begin the guided journey</span>
            <span className="label mt-1 block text-[0.625rem] text-ink/70">
              About 6 minutes · {chapters.length} chapters
            </span>
          </span>
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-5 transition-transform duration-500 ease-cinema group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'START_FREE' })
            onExplore()
          }}
          className="mt-2 flex w-full items-center justify-between gap-4 border border-line-strong px-5 py-3.5 text-left text-[0.9375rem] text-parchment transition-colors duration-300 hover:border-gold-dim hover:bg-parchment/[0.03]"
        >
          Explore freely
          <span className="label text-[0.625rem] text-mist">Select any place</span>
        </button>

        <p className="mt-5 border-t border-line pt-4 text-[0.75rem] leading-relaxed text-mist">
          Places are mapped by theme; the chapters do not trace a single family's route.
        </p>
      </div>
    </motion.div>
    </div>
  )
}
