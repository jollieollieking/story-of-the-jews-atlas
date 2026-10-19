import { ArrowDown, ArrowRight } from 'lucide-react'
import { chapters } from '../../data'
import { useAtlas } from '../../state/atlas'
import { EpisodeCredit } from '../nav/EpisodeCredit'
import { navigateToSection, useStartGuidedJourney } from '../nav/navigation'
import { ChapterIndex } from './ChapterIndex'
import { GoldRule, Reveal } from './Reveal'

const THEMES = [
  {
    numeral: 'I',
    heading: 'Culture',
    text: 'Jewish communities developed strong traditions that influenced later generations.',
  },
  {
    numeral: 'II',
    heading: 'Migration',
    text: 'Movement to new countries created opportunities while transforming community life.',
  },
  {
    numeral: 'III',
    heading: 'Memory',
    text: 'Remembering the communities that were destroyed helps preserve their history and cultural contributions.',
  },
] as const

export function Reflection() {
  const { state } = useAtlas()
  const startGuided = useStartGuidedJourney()
  const total = chapters.length

  return (
    <section
      id="reflection"
      aria-labelledby="reflection-heading"
      className="relative overflow-hidden bg-ink px-5 py-28 focus:outline-none sm:px-8 md:py-40 lg:px-12"
    >
      <div aria-hidden="true" className="grain absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(199_164_106/0.07),transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="label text-gold">Reflection</p>
          {state.journeyComplete && (
            <>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <p className="label text-parchment/80">
                Journey complete · {total} / {total} chapters
              </p>
            </>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            id="reflection-heading"
            className="mt-8 font-serif text-[clamp(2.5rem,6vw,5.75rem)] font-light uppercase leading-[0.92] tracking-[0.005em] text-parchment"
          >
            <span className="block">A people.</span>{' '}
            <span className="block italic text-parchment/85">Many places.</span>{' '}
            <span className="block text-gold-soft">One enduring history.</span>
          </h2>
        </Reveal>

        <GoldRule className="mt-12 w-40 md:mt-16 md:w-64" />

        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <p className="max-w-4xl font-serif text-[clamp(1.4rem,2.5vw,2.15rem)] font-light leading-[1.32] text-parchment/90">
            The history of Eastern European Jews was shaped by faith, tradition, migration, and adaptation. As Jewish
            communities moved across borders, they carried their culture into new places, influencing the world around
            them. Yet the destruction of many European Jewish communities during the Holocaust also shows the
            importance of preserving historical memory.
          </p>
        </Reveal>

        <ul className="mt-20 grid border-t border-line md:mt-28 md:grid-cols-3">
          {THEMES.map((theme, i) => (
            <li
              key={theme.heading}
              className={`relative border-b border-line py-10 md:border-b-0 md:py-12 ${
                i > 0 ? 'md:border-l md:pl-10' : ''
              } ${i < THEMES.length - 1 ? 'md:pr-10' : ''}`}
            >
              <Reveal delay={0.12 * i}>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 right-2 select-none font-serif text-[6rem] font-light leading-none text-parchment/[0.045] md:right-4"
                >
                  {theme.numeral}
                </span>
                <h3 className="relative pr-16 font-serif text-[1.65rem] font-normal uppercase tracking-[0.2em] text-gold-soft">
                  {theme.heading}
                </h3>
                <p className="relative mt-5 max-w-sm pr-16 text-[0.98rem] leading-relaxed text-mist">{theme.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20 md:mt-28">
          <ChapterIndex />
        </Reveal>

        <Reveal className="mt-24 flex flex-col items-center text-center md:mt-32">
          <span aria-hidden="true" className="h-12 w-px bg-gradient-to-b from-transparent to-gold/70" />
          <EpisodeCredit className="mt-8 max-w-2xl font-serif text-[clamp(1.25rem,2.1vw,1.7rem)] font-light leading-snug text-parchment/85" />

          <div className="mt-12 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <button
              type="button"
              onClick={startGuided}
              className="label group inline-flex items-center justify-center gap-3 bg-gold px-6 py-4 !tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-gold-soft"
            >
              Take the guided journey again
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 ease-cinema group-hover:translate-x-0.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('atlas')}
              className="label inline-flex items-center justify-center gap-3 border border-line-strong px-6 py-4 !tracking-[0.2em] text-parchment transition-colors duration-500 hover:border-gold hover:text-gold-soft"
            >
              Revisit the atlas
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('sources')}
              className="label group inline-flex items-center justify-center gap-2 px-6 py-4 !tracking-[0.2em] text-mist transition-colors duration-500 hover:text-parchment"
            >
              Sources &amp; Credits
              <ArrowDown
                className="h-4 w-4 text-gold transition-transform duration-500 ease-cinema group-hover:translate-y-0.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
