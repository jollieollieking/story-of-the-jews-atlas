import { EPISODE_TITLE, PRESENTER, SERIES_TITLE } from './credits'

/** "Based on The Story of the Jews — Episode IV: Over the Rainbow, presented by Simon Schama." */
export function EpisodeCredit({ className }: { className?: string }) {
  return (
    <p className={className}>
      Based on{' '}
      <cite className="italic">
        {SERIES_TITLE} — {EPISODE_TITLE}
      </cite>
      , presented by {PRESENTER}.
    </p>
  )
}
