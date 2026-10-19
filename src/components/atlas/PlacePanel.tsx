import { useRef } from 'react'
import { CircleAlert, Columns2 } from 'lucide-react'
import { useAtlas } from '../../state/atlas'
import { chaptersById, comparison, imagesById, sourcesById, storiesByPlace } from '../../data'
import type { Place, StoryCard } from '../../types'
import { ImageGallery } from '../ui/ImageGallery'
import { SourceList } from '../ui/SourceList'
import { ExternalLink } from '../ui/ExternalLink'
import { PLACE_KIND_LABEL, accentText, hasComparisonContent, pad2, type Tone } from './atlasUi'
import { PanelBar, SectionHeading } from './panelParts'
import { useHeadingFocus } from './panelFocus'

/** Panel view 'place': the full story card for the selected place. */
export function PlacePanel({ place }: { place: Place }) {
  const { view, dispatch } = useAtlas()
  const heading = useRef<HTMLHeadingElement>(null)
  useHeadingFocus(heading)

  const chapter = chaptersById[place.chapterId]
  const story = storiesByPlace[place.id]
  const tone: Tone = chapter.tone === 'solemn' ? 'solemn' : view.tone

  return (
    <>
      <PanelBar
        back={{ label: `Chapter ${pad2(chapter.number)} overview`, onClick: () => dispatch({ type: 'SHOW_CHAPTER_PANEL' }) }}
      />
      <article aria-labelledby="place-title" className="px-5 pb-10 pt-6 md:px-7 md:pt-7">
        <header>
          <p className={`label ${accentText(tone)}`}>
            Chapter {pad2(chapter.number)} · {PLACE_KIND_LABEL[place.kind]}
          </p>
          <h3
            id="place-title"
            ref={heading}
            tabIndex={-1}
            className="mt-3 text-balance font-serif text-[2.25rem] font-light leading-[1.02] text-parchment focus:outline-none md:text-[2.6rem]"
          >
            {place.name}
          </h3>
          {place.country && place.country !== place.name && (
            <p className="mt-3 text-[0.875rem] leading-relaxed text-parchment/80">{place.country}</p>
          )}
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-mist">{place.historicalContext}</p>
          {place.approximate && (
            <p className="label mt-3 text-[0.625rem] text-ash">Region · marker at approximate center</p>
          )}
        </header>

        {story ? <StoryBody place={place} story={story} tone={tone} /> : <StoryPending />}
      </article>
    </>
  )
}

function StoryPending() {
  return (
    <p className="mt-8 border-t border-line pt-6 font-serif text-lg italic text-mist">Story in preparation.</p>
  )
}

function StoryBody({ place, story, tone }: { place: Place; story: StoryCard; tone: Tone }) {
  const { dispatch } = useAtlas()
  const storyImages = story.imageIds.map((id) => imagesById[id]).filter(Boolean)
  const storySources = story.sourceIds.map((id) => sourcesById[id]).filter(Boolean)
  const sourceNumber = (id: string) => storySources.findIndex((s) => s.id === id) + 1
  const verification = story.needsVerification?.filter(Boolean) ?? []
  const facts = story.keyFacts ?? []
  const paragraphs = story.whatHappened.filter(Boolean)
  const canCompare = place.id === 'lower-east-side' && hasComparisonContent(comparison)

  return (
    <>
      {(story.period || story.theme) && (
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-y border-line py-4 text-[0.8125rem]">
          {story.period && (
            <>
              <dt className="label pt-0.5 text-[0.625rem] text-ash">Period</dt>
              <dd className="text-parchment/85">{story.period}</dd>
            </>
          )}
          {story.theme && (
            <>
              <dt className="label pt-0.5 text-[0.625rem] text-ash">Theme</dt>
              <dd className="text-parchment/85">{story.theme}</dd>
            </>
          )}
        </dl>
      )}

      {storyImages.length > 0 && (
        <div className="mt-7">
          <ImageGallery images={storyImages} label={`Images: ${place.name}`} quiet={tone === 'solemn'} />
        </div>
      )}

      {paragraphs.length > 0 && (
        <section className="mt-9">
          <SectionHeading tag="Historical context" tone={tone}>
            What happened
          </SectionHeading>
          <div className="space-y-4 text-[0.9375rem] leading-[1.75] text-parchment/85">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-pretty">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {story.whyItMatters && (
        <section className="mt-9">
          <SectionHeading tag="Historical context" tone={tone}>
            Why it matters
          </SectionHeading>
          <p className="text-pretty text-[0.9375rem] leading-[1.75] text-parchment/85">{story.whyItMatters}</p>
        </section>
      )}

      {story.documentaryConnection && (
        <section
          className={`mt-9 border-l-2 py-1 pl-5 ${tone === 'solemn' ? 'border-memorial/70' : 'border-gold'}`}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className={`label ${accentText(tone)}`}>Connection to the documentary</h4>
            <span
              className={`label border px-2 py-0.5 text-[0.625rem] ${
                tone === 'solemn' ? 'border-memorial/40 text-memorial' : 'border-gold-dim text-gold-soft'
              }`}
            >
              From Episode IV
            </span>
          </div>
          <p className="text-pretty font-serif text-[1.15rem] leading-[1.6] text-parchment">{story.documentaryConnection}</p>
        </section>
      )}

      {facts.length > 0 && (
        <section className="@container mt-10">
          <SectionHeading tone={tone}>Key facts</SectionHeading>
          {/* One column in a narrow panel; two from 22rem. Long values (phrases rather than figures) are set
              smaller so the grid reads as figures, not heavy blocks. */}
          <dl className="grid grid-cols-1 border-t border-line @min-[22rem]:grid-cols-2">
            {facts.map((fact, i) => {
              const n = sourceNumber(fact.sourceId)
              const source = sourcesById[fact.sourceId]
              return (
                <div
                  key={i}
                  className={`flex flex-col-reverse justify-end border-b border-line py-4 ${
                    i % 2 === 0 ? '@min-[22rem]:pr-4' : '@min-[22rem]:border-l @min-[22rem]:pl-4'
                  }`}
                >
                  <dt className="mt-1.5 text-[0.75rem] leading-snug text-mist">
                    {fact.label}
                    {source && (
                      <sup className="ml-0.5">
                        <ExternalLink
                          href={source.url}
                          bare
                          className="text-[0.625rem] text-gold-dim no-underline"
                          aria-label={`Source ${n > 0 ? n : ''}: ${source.title} (opens in a new tab)`}
                        >
                          [{n > 0 ? n : '•'}]
                        </ExternalLink>
                      </sup>
                    )}
                  </dt>
                  <dd
                    className={`text-balance font-serif font-light ${
                      fact.value.length > 14 ? 'text-[1.35rem] leading-tight' : 'text-[1.9rem] leading-none'
                    } ${tone === 'solemn' ? 'text-parchment' : 'text-gold-soft'}`}
                  >
                    {fact.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>
      )}

      {canCompare && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN_COMPARISON' })}
          className="group mt-10 flex w-full items-center gap-4 border border-line-strong px-5 py-4 text-left transition-colors duration-300 hover:border-gold-dim hover:bg-parchment/[0.03]"
        >
          <Columns2 aria-hidden="true" strokeWidth={1.25} className="size-5 shrink-0 text-gold" />
          <span>
            <span className="label block text-[0.625rem] text-ash">Old World / New World</span>
            <span className="mt-1 block font-serif text-[1.2rem] leading-tight text-parchment">
              Compare: the shtetl and the Lower East Side
            </span>
          </span>
        </button>
      )}

      {verification.length > 0 && (
        <section className="mt-10 border border-line bg-parchment/[0.02] p-4">
          <p className="label flex items-center gap-2 text-[0.625rem] text-mist">
            <CircleAlert aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
            Marked for verification
          </p>
          <ul className="mt-3 space-y-2 text-[0.8125rem] leading-relaxed text-mist">
            {verification.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="text-ash">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {storySources.length > 0 && (
        <section className="mt-10 border-t border-line pt-6">
          <SectionHeading tone={tone}>Sources</SectionHeading>
          <SourceList sources={storySources} />
        </section>
      )}
    </>
  )
}
