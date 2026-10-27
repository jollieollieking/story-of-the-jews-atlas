import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, type Variants } from 'motion/react'
import { useAtlas } from '../../state/atlas'
import { scrollToSection } from '../../lib/scroll'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { GlobeStage } from './GlobeStage'
import { HeroBackdrop } from './HeroBackdrop'
import { GlobeLegend } from './GlobeLegend'
import { ScrollCue } from './ScrollCue'

const EASE = [0.22, 1, 0.36, 1] as const

const GLOBE_LABEL =
  'A slowly turning globe centred on Europe and the Atlantic. Gold markers show places in the atlas, from Lithuania to Odesa and New York, and a gold arc traces the generalized emigration route from the Pale of Settlement to New York.'

/**
 * Opening title sequence. Timeline (seconds): globe fades up from 0; title words rise 0.25–1.5;
 * the gold rule draws at 0.95; subtitle, lede, credit and actions follow; scroll cue by 2.0.
 */
export function Hero() {
  const { dispatch } = useAtlas()
  const still = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const onScreen = useOnScreen(sectionRef)

  const word: Variants = still
    ? { hidden: { opacity: 0 }, shown: (i: number) => ({ opacity: 1, transition: { duration: 0.8, delay: 0.1 + i * 0.05 } }) }
    : {
        hidden: { opacity: 0, y: '0.55em', filter: 'blur(10px)' },
        shown: (i: number) => ({
          opacity: 1,
          y: '0em',
          filter: 'blur(0px)',
          transition: { duration: 1.15, delay: 0.25 + i * 0.11, ease: EASE },
        }),
      }

  const rise = (delay: number) =>
    still
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: delay * 0.4 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.95, delay, ease: EASE },
        }

  const lines = [['The', 'Story'], ['of', 'the', 'Jews']]
  let wordIndex = 0

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex h-[100dvh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: still ? 1 : 2.2, ease: EASE }}
      >
        <GlobeStage visible={onScreen} label={GLOBE_LABEL} />
      </motion.div>
      <HeroBackdrop />

      <div className="relative z-10 flex h-full w-full flex-col justify-start px-5 pt-[clamp(5.5rem,12.5vh,8rem)] sm:px-8 md:justify-center md:px-12 md:pb-16 md:pt-16 lg:px-[6vw]">
        <div className="max-w-[46rem] min-[1800px]:max-w-[56rem]">
          <h1
            id="hero-title"
            className="font-serif text-[clamp(2.25rem,11.4vw,3.5rem)] font-light uppercase leading-[0.98] tracking-[0.12em] text-parchment sm:text-[clamp(3rem,6vw,8.5rem)] sm:tracking-[0.16em]"
          >
            {lines.map((line, li) => (
              <span key={li} className="block whitespace-nowrap">
                {line.map((w, wi) => {
                  const i = wordIndex++
                  return (
                    <span key={w + wi}>
                      <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                        <motion.span className="inline-block" variants={word} custom={i} initial="hidden" animate="shown">
                          {w}
                        </motion.span>
                      </span>
                      {wi < line.length - 1 ? ' ' : ''}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>

          <div className="mt-6 flex items-center gap-4 md:mt-8 md:gap-5">
            <motion.span
              aria-hidden="true"
              className="block h-px w-10 origin-left bg-gold md:w-16"
              initial={{ scaleX: 0, opacity: still ? 0 : 1 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: still ? 0.8 : 1.1, delay: still ? 0.3 : 0.95, ease: EASE }}
            />
            <motion.p
              className="font-sans text-[0.8125rem] font-medium uppercase tracking-[0.42em] text-gold md:text-[0.9375rem] md:tracking-[0.5em] min-[1800px]:text-[1.125rem]"
              {...rise(1.1)}
            >
              Over the Rainbow
            </motion.p>
          </div>

          <motion.p
            className="mt-7 max-w-[33rem] font-serif text-[1.25rem] leading-[1.42] text-parchment/85 md:mt-9 md:text-[1.5rem] min-[1800px]:max-w-[40rem] min-[1800px]:text-[1.875rem]"
            {...rise(1.3)}
          >
            How Jewish life moved from the shtetls of Eastern Europe to New&nbsp;York, and what was lost in the
            Holocaust.
          </motion.p>

          <motion.p className="mt-4 max-w-[36rem] text-[0.8125rem] leading-relaxed text-mist min-[1800px]:max-w-[44rem] min-[1800px]:text-[0.9375rem]" {...rise(1.45)}>
            An interactive history project based on Simon Schama’s documentary{' '}
            <span className="text-gold-dim" aria-hidden="true">
              •
            </span>{' '}
            <span className="whitespace-nowrap">Episode IV</span>
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-9 md:mt-11"
            {...rise(1.6)}
          >
            <button
              type="button"
              onClick={() => scrollToSection('atlas')}
              className="group inline-flex items-center gap-4 border border-gold bg-gold px-7 py-4 text-ink transition-colors duration-500 ease-[var(--ease-cinema)] hover:border-gold-soft hover:bg-gold-soft"
            >
              <span className="label text-[0.75rem] font-semibold">Explore the journey</span>
              <ArrowGlyph />
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'START_GUIDED' })
                scrollToSection('atlas')
              }}
              className="group relative py-1.5 font-serif text-[1.125rem] italic text-parchment/80 transition-colors duration-500 hover:text-parchment"
            >
              Begin the guided journey
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-[0.3] bg-gold/80 transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </button>
          </motion.div>
        </div>
      </div>

      <GlobeLegend delay={still ? 0.6 : 1.9} />
      <ScrollCue delay={still ? 0.6 : 2.0} still={still} />
    </section>
  )
}

/** "→" drawn as a fine engraved arrow: the shaft lengthens and the head slides forward on hover. */
function ArrowGlyph() {
  return (
    <span aria-hidden="true" className="relative block h-3 w-6 overflow-visible">
      <svg
        viewBox="0 0 24 12"
        className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:translate-x-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      >
        <path d="M1 6h21" />
        <path d="M17 1.5 22 6l-5 4.5" />
      </svg>
    </span>
  )
}

/** True while a visible part of the element is in the viewport. */
function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    // No root margin and an edge-adjacent entry (ratio 0) counts as off-screen: when the atlas is
    // scrolled to exactly its top, the hero's bottom edge touches y=0 and the globe must stop
    // rendering so MapLibre has the GPU to itself.
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting && entry.intersectionRatio > 0), {
      rootMargin: '0px',
      threshold: [0, 0.01],
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return on
}
