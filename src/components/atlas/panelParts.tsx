import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react'
import { useAtlas } from '../../state/atlas'
import { chapters, imagesById, storiesByPlace } from '../../data'
import type { Place } from '../../types'
import { PLACE_KIND_LABEL, accentText, pad2, type Tone } from './atlasUi'

/** Sticky top row inside the panel: optional back link on the left, close button on the right. */
export function PanelBar({ back, label = 'Story' }: { back?: { label: string; onClick: () => void }; label?: string }) {
  const { dispatch } = useAtlas()
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-ink-2/95 px-5 py-2.5 backdrop-blur-sm md:px-7">
      {back ? (
        <button
          type="button"
          onClick={back.onClick}
          className="label -ml-1 inline-flex items-center gap-2 px-1 py-2 text-[0.625rem] text-mist transition-colors hover:text-parchment"
        >
          <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
          {back.label}
        </button>
      ) : (
        <span className="label text-[0.625rem] text-ash">{label}</span>
      )}
      <button
        type="button"
        onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
        aria-label="Close story panel"
        className="-mr-2 grid size-9 place-items-center text-mist transition-colors hover:text-parchment"
      >
        <X aria-hidden="true" strokeWidth={1.5} className="size-[1.125rem]" />
      </button>
    </div>
  )
}

/** Section heading in the panel: an uppercase label, optionally with a small tag on the right. */
export function SectionHeading({ children, tag, tone = 'default' }: { children: ReactNode; tag?: string; tone?: Tone }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h4 className={`label ${accentText(tone)}`}>{children}</h4>
      {tag && <span className="label text-[0.625rem] text-ash">{tag}</span>}
    </div>
  )
}

/** Pre-sized copy next to the original: `/images/<chapter>/thumbs/<file>`. */
const thumbSrc = (src: string) => src.replace(/\/([^/]+)$/, '/thumbs/$1')

/** Selectable list of places (thumbnail, name, country, theme). */
export function PlaceList({ places, label }: { places: Place[]; label: string }) {
  const { state, view, dispatch } = useAtlas()
  const solemn = view.tone === 'solemn'
  if (places.length === 0) return null
  return (
    <ul aria-label={label} className="divide-y divide-line border-y border-line">
      {places.map((place) => {
        const story = storiesByPlace[place.id]
        const image = story?.imageIds.map((id) => imagesById[id]).find(Boolean)
        const current = state.selectedPlaceId === place.id && state.panel === 'place'
        return (
          <li key={place.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SELECT_PLACE', id: place.id })}
              aria-current={current ? 'true' : undefined}
              className="group flex w-full items-center gap-4 py-4 text-left transition-colors duration-300 hover:bg-parchment/[0.025]"
            >
              <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden border border-line bg-ink-3">
                {image ? (
                  <img
                    src={thumbSrc(image.src)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ filter: 'sepia(0.2) saturate(0.8)' }}
                    onError={(e) => {
                      /* The small copy first, then the full-size original, then nothing. */
                      const img = e.currentTarget
                      if (img.dataset.fallback !== 'full') {
                        img.dataset.fallback = 'full'
                        img.src = image.src
                      } else {
                        img.style.display = 'none'
                      }
                    }}
                  />
                ) : (
                  <MapPin aria-hidden="true" strokeWidth={1.25} className={`size-5 ${solemn ? 'text-memorial/70' : 'text-gold-dim'}`} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-[1.3rem] leading-tight text-parchment">{place.name}</span>
                <span className="mt-0.5 block truncate text-[0.75rem] text-mist">
                  {place.approximate ? `${PLACE_KIND_LABEL[place.kind]} · ` : ''}
                  {place.country}
                </span>
                {story?.theme && (
                  <span className="mt-1.5 line-clamp-2 block text-[0.8125rem] leading-snug text-parchment/75">{story.theme}</span>
                )}
              </span>
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.5}
                className={`size-4 shrink-0 transition-[color,transform] duration-500 ease-cinema ${
                  solemn ? 'text-memorial/60 group-hover:text-memorial' : 'text-gold-dim group-hover:translate-x-0.5 group-hover:text-gold'
                }`}
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Guided-journey controls pinned to the foot of the story panel (outside its scroll area), so the
 * Continue / Complete button is always in view: a compact Back button and the prominent Continue.
 */
export function GuidedFooter() {
  const { view, dispatch } = useAtlas()
  const index = chapters.findIndex((c) => c.id === view.chapter.id)
  const next = chapters[index + 1]
  const prev = chapters[index - 1]
  const solemn = view.tone === 'solemn'

  return (
    <div className="flex shrink-0 items-stretch gap-2 border-t border-line bg-ink-2 px-5 py-3 md:px-7 md:py-4">
      {prev && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'PREV_CHAPTER' })}
          aria-label={`Back to Chapter ${pad2(prev.number)}: ${prev.title}`}
          title={`Back to Chapter ${pad2(prev.number)}`}
          className="grid w-11 shrink-0 place-items-center border border-line-strong text-mist transition-colors duration-300 hover:border-gold-dim hover:text-parchment"
        >
          <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" />
        </button>
      )}
      {next ? (
        <button
          type="button"
          onClick={() => dispatch({ type: 'NEXT_CHAPTER' })}
          className="group flex min-w-0 flex-1 items-center justify-between gap-4 bg-gold px-4 py-3 text-left text-ink transition-colors duration-300 hover:bg-gold-soft md:px-5 md:py-3.5"
        >
          <span className="min-w-0">
            <span className="label block text-[0.625rem] text-ink/70">Continue</span>
            <span className="mt-1 block text-balance text-[0.9375rem] font-medium leading-snug">
              Chapter {pad2(next.number)}: {next.title}
            </span>
          </span>
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 transition-transform duration-500 ease-cinema group-hover:translate-x-1" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => dispatch({ type: 'FINISH_JOURNEY' })}
          className={`group flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-3 text-left transition-colors duration-500 md:px-5 md:py-3.5 ${
            solemn
              ? 'border border-memorial/50 bg-memorial/10 text-parchment hover:bg-memorial/20'
              : 'bg-gold text-ink hover:bg-gold-soft'
          }`}
        >
          <span>
            <span className={`label block text-[0.625rem] ${solemn ? 'text-memorial' : 'text-ink/70'}`}>End of the atlas</span>
            <span className="mt-1 block text-[0.9375rem] font-medium leading-snug">Complete the journey</span>
          </span>
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0" />
        </button>
      )}
    </div>
  )
}

/**
 * Chapter navigation at the foot of the chapter panel's scroll area. Guided: only the keyboard hint
 * (the Continue button lives in GuidedFooter, pinned below the scroll area). Free: quiet previous/next links.
 */
export function ChapterFooter() {
  const { state, view, dispatch } = useAtlas()
  const index = chapters.findIndex((c) => c.id === view.chapter.id)
  const next = chapters[index + 1]
  const prev = chapters[index - 1]

  if (state.mode === 'guided') {
    return (
      <p className="mt-10 hidden text-[0.75rem] text-ash md:block">
        Use <kbd className="font-sans">←</kbd> <kbd className="font-sans">→</kbd> keys to move between chapters
      </p>
    )
  }

  if (!prev && !next) return null
  return (
    <nav aria-label="Chapters" className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-5">
      {prev ? (
        <button
          type="button"
          onClick={() => dispatch({ type: 'PREV_CHAPTER' })}
          className="group min-w-0 text-left"
        >
          <span className="label flex items-center gap-1.5 text-[0.625rem] text-ash">
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-3" /> Chapter {pad2(prev.number)}
          </span>
          <span className="mt-1 block truncate font-serif text-[1.05rem] text-parchment/80 transition-colors group-hover:text-parchment">
            {prev.title}
          </span>
        </button>
      ) : (
        <span />
      )}
      {next && (
        <button type="button" onClick={() => dispatch({ type: 'NEXT_CHAPTER' })} className="group min-w-0 text-right">
          <span className="label flex items-center justify-end gap-1.5 text-[0.625rem] text-ash">
            Chapter {pad2(next.number)} <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-3" />
          </span>
          <span className="mt-1 block truncate font-serif text-[1.05rem] text-parchment/80 transition-colors group-hover:text-parchment">
            {next.title}
          </span>
        </button>
      )}
    </nav>
  )
}
