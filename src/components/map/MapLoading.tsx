import { AnimatePresence, motion } from 'motion/react'

/** Veil shown until the style and the base geography are in, then quietly lifted. */
export function MapLoading({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="atlas-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
        >
          <p className="atlas-loading__text">Preparing the atlas…</p>
          <span className="atlas-loading__rule" aria-hidden="true">
            <span />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
