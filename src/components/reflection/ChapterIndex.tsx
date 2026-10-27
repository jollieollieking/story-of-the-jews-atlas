import { chapters } from '../../data'
import { useAtlas } from '../../state/atlas'
import type { ChapterId } from '../../types'
import { navigateToSection } from '../nav/navigation'

/**
 * The atlas's chapters as seven quiet points on one hairline. Each point reopens its chapter on the map.
 * Chapter 07 uses the memorial tone and no accent colour.
 */
export function ChapterIndex() {
  const { dispatch } = useAtlas()

  const open = (id: ChapterId) => {
    dispatch({ type: 'GO_TO_CHAPTER', id })
    navigateToSection('atlas')
  }

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <h3 className="label text-gold">Chapters of the atlas</h3>
        <p className="max-w-md text-sm leading-relaxed text-ash md:text-right">
          Organized by theme and time period, not as one person’s or one family’s journey. Pick a chapter to open it
          on the map again.
        </p>
      </div>

      <ol className="relative mt-10 grid gap-0 md:grid-cols-7 md:gap-4">
        {/* The connecting hairline: vertical on phones, horizontal from md up. */}
        <span aria-hidden="true" className="absolute bottom-6 left-[7px] top-2 w-px bg-line-strong md:hidden" />
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-gold/50 via-line-strong to-memorial/30 md:block"
        />
        {chapters.map((chapter) => {
          const solemn = chapter.tone === 'solemn'
          return (
            <li key={chapter.id} className="relative">
              <button
                type="button"
                onClick={() => open(chapter.id)}
                className="group flex w-full items-start gap-5 py-3 text-left md:flex-col md:gap-0 md:py-0"
              >
                <span
                  aria-hidden="true"
                  className={`relative z-[1] mt-1 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border bg-ink transition-colors duration-500 md:mt-0 ${
                    solemn ? 'border-memorial/60' : 'border-gold/70 group-hover:border-gold-soft'
                  }`}
                >
                  <span
                    className={`h-[5px] w-[5px] rounded-full transition-transform duration-500 ease-cinema ${
                      solemn ? 'bg-memorial/70' : 'bg-gold group-hover:scale-125'
                    }`}
                  />
                </span>
                <span className="flex flex-col md:mt-6">
                  <span className={`label ${solemn ? 'text-memorial/80' : 'text-gold-dim'}`}>
                    <span className="sr-only">Chapter </span>
                    {String(chapter.number).padStart(2, '0')}
                  </span>
                  <span
                    className={`mt-2 font-serif text-[1.2rem] font-normal leading-[1.15] transition-colors duration-500 ${
                      solemn ? 'text-memorial' : 'text-parchment/90 group-hover:text-gold-soft'
                    }`}
                  >
                    {chapter.title}
                  </span>
                  {chapter.dateRange && <span className="mt-2 text-xs text-ash">{chapter.dateRange}</span>}
                  <span className="sr-only">, open this chapter on the map</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
