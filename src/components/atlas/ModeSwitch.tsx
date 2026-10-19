import { useRef, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { useAtlas, type AtlasMode } from '../../state/atlas'
import { EASE_CINEMA } from './atlasUi'

const OPTIONS: { mode: AtlasMode; label: string; short: string }[] = [
  { mode: 'guided', label: 'Guided Journey', short: 'Guided' },
  { mode: 'free', label: 'Free Explore', short: 'Explore' },
]

/**
 * Segmented control: Guided Journey (restarts at Chapter 01) / Free Explore. A radio group with arrow keys.
 * Full labels show when the enclosing @container (the chapter header) is at least 40rem wide.
 */
export function ModeSwitch() {
  const { state, dispatch } = useAtlas()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const choose = (mode: AtlasMode) => {
    if (mode === state.mode) return
    dispatch({ type: mode === 'guided' ? 'START_GUIDED' : 'START_FREE' })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
    e.preventDefault()
    const current = OPTIONS.findIndex((o) => o.mode === state.mode)
    const next = (current + 1) % OPTIONS.length
    choose(OPTIONS[next].mode)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="How to explore the atlas"
      onKeyDown={onKeyDown}
      className="flex border border-line-strong bg-ink-2/75 p-0.5 backdrop-blur-md"
    >
      {OPTIONS.map((o, i) => {
        const checked = state.mode === o.mode
        return (
          <button
            key={o.mode}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => choose(o.mode)}
            className={`label relative px-2.5 py-2 text-[0.625rem] transition-colors duration-500 @min-[40rem]:px-3.5 ${
              checked ? 'text-ink' : 'text-mist hover:text-parchment'
            }`}
          >
            {checked && (
              <motion.span
                layoutId="atlas-mode-pill"
                aria-hidden="true"
                className="absolute inset-0 bg-parchment"
                transition={{ duration: 0.5, ease: EASE_CINEMA }}
              />
            )}
            <span className="relative">
              <span className="@min-[40rem]:hidden">{o.short}</span>
              <span className="hidden @min-[40rem]:inline">{o.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
