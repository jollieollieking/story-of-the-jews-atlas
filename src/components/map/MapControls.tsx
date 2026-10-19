import { Minus, Plus, RotateCcw } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

/** Zoom and reset, top-right, kept below the chapter header and clear of the story panel. */
export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <div className="atlas-controls" role="group" aria-label="Map controls" data-map-ui>
      <button type="button" className="atlas-controls__button" onClick={onZoomIn} aria-label="Zoom in" title="Zoom in">
        <Plus size={16} strokeWidth={1.4} aria-hidden="true" />
      </button>
      <button type="button" className="atlas-controls__button" onClick={onZoomOut} aria-label="Zoom out" title="Zoom out">
        <Minus size={16} strokeWidth={1.4} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="atlas-controls__button atlas-controls__button--reset"
        onClick={onReset}
        aria-label="Reset view to the overview"
        title="Reset view"
      >
        <RotateCcw size={15} strokeWidth={1.4} aria-hidden="true" />
      </button>
    </div>
  )
}
