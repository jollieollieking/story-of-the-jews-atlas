import type { ReactNode } from 'react'
import { motion } from 'motion/react'

const EASE_CINEMA = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds to wait after the element enters the viewport. */
  delay?: number
  /** Starting vertical offset in px. */
  y?: number
}

/** Slow, once-only fade and lift as the element scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE_CINEMA, delay }}
    >
      {children}
    </motion.div>
  )
}

/** A fine gold rule that draws itself from the left when it scrolls into view. */
export function GoldRule({ className = '' }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`h-px origin-left bg-gradient-to-r from-gold via-gold/60 to-transparent ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.6, ease: EASE_CINEMA }}
    />
  )
}
