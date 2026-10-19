/**
 * Content of the HTML markers. The controller owns the positioned wrapper elements and decides
 * label side and visibility (data-side / data-label on the wrapper); these components render
 * what is inside, through portals, so they stay ordinary accessible React.
 */
import type { ContextMarker, Overlay, Place, PlaceId, Route } from '../../types'

interface PlaceMarkerProps {
  place: Place
  highlighted: boolean
  selected: boolean
  /** Chapter 07: memorial palette, no glow. */
  solemn: boolean
  /** No pulsing (reduced motion or solemn tone). */
  still: boolean
  onSelect: (id: PlaceId) => void
}

export function PlaceMarker({ place, highlighted, selected, solemn, still, onSelect }: PlaceMarkerProps) {
  const tipId = `atlas-place-tip-${place.id}`
  const className = [
    'atlas-place',
    highlighted || selected ? 'is-highlighted' : 'is-dimmed',
    selected && 'is-selected',
    place.approximate && 'is-region',
    solemn && 'is-solemn',
    still && 'is-still',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type="button"
      className={className}
      aria-label={`${place.name}${place.country && place.country !== place.name ? `, ${place.country}` : ''} — open story`}
      aria-describedby={tipId}
      aria-current={selected ? 'location' : undefined}
      onClick={() => onSelect(place.id)}
    >
      <span className="atlas-place__origin">
        {place.approximate && <span className="atlas-place__region" aria-hidden="true" />}
        <span className="atlas-place__halo" aria-hidden="true" />
        <span className="atlas-place__halo atlas-place__halo--late" aria-hidden="true" />
        <span className="atlas-place__dot" aria-hidden="true" />
        <span className="atlas-place__label" data-map-label aria-hidden="true">
          <span className="atlas-place__name">{place.name}</span>
          {place.approximate && <span className="atlas-place__note">approx. center</span>}
        </span>
        <span className="atlas-place__tip" id={tipId} role="tooltip">
          {place.historicalContext}
          {place.approximate && <span className="atlas-place__tip-note">Marker shows an approximate center</span>}
        </span>
      </span>
    </button>
  )
}

export function ContextPoint({ marker }: { marker: ContextMarker }) {
  /* The death camp is shown plainly, in the memorial palette, never with the gold of the story. */
  const memorial = marker.chapterIds.includes('destruction')
  return (
    <div className={`atlas-context${memorial ? ' is-memorial' : ''}`}>
      <span className="atlas-context__ring" aria-hidden="true" />
      <span className="atlas-sr-only">
        {marker.name}: {marker.note}
      </span>
      <span className="atlas-context__label" data-map-label aria-hidden="true">
        <span className="atlas-context__name">{marker.name}</span>
        <span className="atlas-context__note">{marker.note}</span>
      </span>
    </div>
  )
}

export function RouteLabel({ route }: { route: Route }) {
  return (
    <div className={`atlas-route-label is-${route.kind}`} data-map-label>
      <span className="atlas-route-label__title">{route.label}</span>
      <span className="atlas-route-label__years">{route.years}</span>
    </div>
  )
}

export function AreaLabel({ overlay }: { overlay: Overlay }) {
  return (
    <div className="atlas-area-label" data-map-label>
      <span className="atlas-area-label__title">{overlay.label}</span>
      <span className="atlas-area-label__note">approx. extent · {overlay.dateLabel}</span>
    </div>
  )
}
