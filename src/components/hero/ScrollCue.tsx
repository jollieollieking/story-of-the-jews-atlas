import { motion } from 'motion/react'
import { scrollToSection } from '../../lib/scroll'

const EASE = [0.22, 1, 0.36, 1] as const

/** "Scroll" with a thin line that a drop of gold slides down. Clicking it goes to the atlas. */
export function ScrollCue({ delay = 0, still = false }: { delay?: number; still?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={() => scrollToSection('atlas')}
      aria-label="Scroll to the interactive atlas"
      className="group absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 px-4 py-2 text-mist transition-colors duration-500 hover:text-parchment md:bottom-7 [@media(max-height:719px)]:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      <span className="label text-[0.625rem]">Scroll</span>
      <span className="relative block h-12 w-px overflow-hidden bg-parchment/15 md:h-14">
        {!still && (
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent via-gold to-transparent"
            initial={{ y: '-100%' }}
            animate={{ y: '200%' }}
            transition={{ duration: 2.4, ease: EASE, repeat: Infinity, repeatDelay: 0.6, delay: delay + 0.4 }}
          />
        )}
      </span>
    </motion.button>
  )
}
