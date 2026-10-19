import { motion } from 'motion/react'

/** A small engraved-plate key for the globe, shown on wide screens only. */
export function GlobeLegend({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute bottom-8 right-[4vw] z-10 hidden w-[21rem] xl:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="label mb-3 border-b border-line pb-2 text-ash">On the globe</p>
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="mt-[0.3rem] flex h-2.5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-soft shadow-[0_0_8px_2px_rgb(199_164_106/0.55)]" />
          </span>
          <span className="text-[0.75rem] leading-snug text-mist">
            <span className="block text-parchment/85">Places in the atlas</span>
            Lithuania · Plungė · Košice · Uman · Odesa ·{" "}
            <span className="whitespace-nowrap">New York</span>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-[0.55rem] block h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
          <span className="text-[0.75rem] leading-snug text-mist">
            <span className="block text-parchment/85">Generalized emigration route</span>
            The Pale of Settlement to New York, c. 1881–1924
          </span>
        </li>
      </ul>
    </motion.div>
  )
}
