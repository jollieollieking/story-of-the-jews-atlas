import type { ReactNode } from 'react'
import { images, sources } from '../../data'
import type { Source } from '../../types'
import { DISCLAIMER } from '../nav/credits'
import { GoldRule, Reveal } from '../reflection/Reveal'
import { ExternalLink } from './ExternalLink'
import { HistoricalSources } from './HistoricalSources'
import { ImageCredits } from './ImageCredits'
import { MapCredits } from './MapCredits'
import { Methodology } from './Methodology'
import { SourceBlock } from './SourceBlock'
import { HISTORICAL_GROUPS, hostOf, isDocumentary, pad2 } from './citations'

const historicalKinds = new Set(HISTORICAL_GROUPS.map((g) => g.kind))
const documentarySources = sources.filter(isDocumentary)
const historicalSources = sources.filter((s) => historicalKinds.has(s.kind))

interface Block {
  id: string
  title: string
  intro?: ReactNode
  content: ReactNode
}

export function Sources() {
  const blocks: Block[] = []

  if (documentarySources.length > 0) {
    blocks.push({
      id: 'sources-documentary',
      title: 'Documentary reference',
      intro: 'The episode this project is based on, plus the program page and transcript used to check what it says.',
      content: <DocumentarySources items={documentarySources} />,
    })
  }
  if (historicalSources.length > 0) {
    blocks.push({
      id: 'sources-historical',
      title: 'Historical sources',
      intro: 'The museums, encyclopedias and archives used for the extra historical background on each story card.',
      content: <HistoricalSources sources={historicalSources} />,
    })
  }
  if (images.length > 0) {
    blocks.push({
      id: 'sources-images',
      title: 'Image credits',
      intro: 'Every historical image in the atlas, with who made it, where it is held, its license and where it came from.',
      content: <ImageCredits images={images} />,
    })
  }
  blocks.push(
    {
      id: 'sources-map',
      title: 'Map data & software',
      intro: 'The open map data, code libraries and fonts used to build the map and the site.',
      content: <MapCredits />,
    },
    {
      id: 'sources-method',
      title: 'About this atlas',
      intro: 'How the atlas was made and how to read it.',
      content: <Methodology />,
    },
  )

  const counts = [
    historicalSources.length > 0 && `${historicalSources.length} historical ${historicalSources.length === 1 ? 'source' : 'sources'}`,
    images.length > 0 && `${images.length} archival ${images.length === 1 ? 'image' : 'images'}`,
  ].filter(Boolean)

  return (
    <section
      id="sources"
      aria-labelledby="sources-heading"
      className="relative bg-ink-2 px-5 py-28 focus:outline-none sm:px-8 md:py-36 lg:px-12"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="relative mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <Reveal>
            <p className="label text-gold">Appendix</p>
            <h2
              id="sources-heading"
              className="mt-6 font-serif text-[clamp(2.75rem,6.5vw,5.5rem)] font-light leading-[0.95] text-parchment"
            >
              Sources <span className="italic text-gold-soft">&amp;</span> Credits
            </h2>
          </Reveal>
          <GoldRule className="mt-10 w-32 md:w-48" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-mist md:text-[1.05rem]">
              Everything this project used: the documentary episode, the historical sources behind each story card,
              the archival images, and the open map data and software that make the atlas work.
            </p>
            {counts.length > 0 && <p className="label mt-6 text-parchment/70">{counts.join(' · ')}</p>}
          </Reveal>
        </header>

        <nav aria-label="Sources and credits contents" className="mt-14 md:mt-20">
          <ol className="flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4">
            {blocks.map((block, i) => (
              <li key={block.id}>
                <a
                  href={`#${block.id}`}
                  className="label group inline-flex items-baseline gap-2.5 py-1 text-mist transition-colors duration-500 hover:text-parchment"
                >
                  <span className="text-gold">{pad2(i + 1)}</span>
                  {block.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {blocks.map((block, i) => (
            <SourceBlock key={block.id} id={block.id} index={pad2(i + 1)} title={block.title} intro={block.intro}>
              {block.content}
            </SourceBlock>
          ))}
        </div>

        <Reveal className="mt-24 md:mt-32">
          <aside aria-label="Disclaimer" className="border border-line px-6 py-6 md:flex md:items-center md:gap-8 md:px-8">
            <p className="label shrink-0 text-gold">Disclaimer</p>
            <p className="mt-3 text-sm leading-relaxed text-parchment/80 md:mt-0">{DISCLAIMER}</p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}

function DocumentarySources({ items }: { items: Source[] }) {
  return (
    <ul>
      {items.map((source) => (
        <li
          key={source.id}
          className="grid gap-3 border-t border-line py-7 first:border-t-0 first:pt-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8"
        >
          <p className="label pt-2 text-mist">
            {source.kind === 'documentary' ? 'Documentary' : 'Program page & transcript'}
          </p>
          <div>
            <ExternalLink
              href={source.url}
              className="font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] font-light leading-tight text-parchment hover:text-gold-soft"
            >
              {source.title}
            </ExternalLink>
            <p className="mt-2 text-sm text-mist">
              {source.publisher}
              <span aria-hidden="true" className="mx-2 text-line-strong">
                /
              </span>
              {hostOf(source.url)}
            </p>
            {source.usedFor && <p className="mt-3 text-sm leading-relaxed text-parchment/65">{source.usedFor}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
