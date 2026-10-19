import { useAtlas } from '../../state/atlas'
import { chapters } from '../../data'
import { pad2 } from './atlasUi'

/** "CHAPTER 03 / 07" with one clickable segment per chapter. Shown during the guided journey. */
export function GuidedProgress() {
  const { state, view, dispatch } = useAtlas()
  const overview = state.focus.kind === 'overview'
  const current = overview ? 0 : view.chapterNumber
  const solemn = view.tone === 'solemn'

  return (
    <nav aria-label="Guided journey progress" className="flex items-center justify-center gap-2 pb-2.5 pt-1 min-[360px]:gap-4 md:pb-3">
      <p
        className={`label shrink-0 text-[0.625rem] tracking-[0.18em] min-[360px]:tracking-[var(--tracking-label)] ${
          overview ? 'text-mist' : solemn ? 'text-memorial' : 'text-gold'
        }`}
      >
        {overview ? 'Overview' : `Chapter ${pad2(current)} / ${pad2(view.chapterCount)}`}
      </p>
      <ol className="flex items-center gap-1">
        {chapters.map((c) => {
          const done = c.number < current
          const isCurrent = c.number === current
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: 'GO_TO_CHAPTER', id: c.id })}
                aria-label={`Chapter ${c.number} of ${chapters.length}: ${c.title}`}
                aria-current={isCurrent ? 'step' : undefined}
                title={`${pad2(c.number)} · ${c.title}`}
                className="group flex h-6 items-center px-0.5"
              >
                <span
                  aria-hidden="true"
                  className={`block h-[2px] w-5 transition-colors duration-700 min-[360px]:w-6 md:w-9 ${
                    isCurrent
                      ? solemn
                        ? 'bg-memorial'
                        : 'bg-gold'
                      : done
                        ? 'bg-parchment/55 group-hover:bg-parchment/80'
                        : 'bg-parchment/15 group-hover:bg-parchment/40'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
