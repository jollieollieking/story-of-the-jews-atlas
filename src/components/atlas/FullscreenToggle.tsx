import { Maximize2, Minimize2 } from 'lucide-react'
import type { FullscreenControls } from './useFullscreen'

export function FullscreenToggle({ fullscreen }: { fullscreen: FullscreenControls }) {
  const Icon = fullscreen.active ? Minimize2 : Maximize2
  const label = fullscreen.active ? 'Exit fullscreen' : 'Enter fullscreen'
  return (
    <button
      type="button"
      onClick={fullscreen.toggle}
      aria-label={label}
      title={label}
      className="grid size-[2.125rem] shrink-0 place-items-center border border-line-strong bg-ink-2/75 text-mist backdrop-blur-md transition-colors duration-300 hover:border-gold-dim hover:text-parchment"
    >
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
    </button>
  )
}
