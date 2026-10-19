import { ArrowUp } from 'lucide-react'
import { DISCLAIMER } from './credits'
import { EpisodeCredit } from './EpisodeCredit'
import { navigateToSection } from './navigation'
import { Wordmark } from './Wordmark'

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-14 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <Wordmark />
            <EpisodeCredit className="max-w-2xl font-serif text-lg font-light leading-snug text-parchment/80" />
          </div>
          <button
            type="button"
            onClick={() => navigateToSection('top')}
            className="label group inline-flex items-center gap-3 self-start text-mist transition-colors duration-500 hover:text-parchment md:self-auto"
          >
            Back to top
            <span className="inline-flex h-9 w-9 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-gold">
              <ArrowUp
                className="h-4 w-4 text-gold transition-transform duration-500 ease-cinema group-hover:-translate-y-0.5"
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
        <div className="mt-10 border-t border-line pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-mist">{DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  )
}
