import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { overlaysById, places, routesById } from '../../data'
import { useIsNarrow } from '../../hooks/useMediaQuery'
import type { AtlasView } from '../../state/atlas'
import type { LegendContext } from './AtlasMapController'

type Swatch = 'place' | 'region' | 'selected' | 'sea' | 'internal' | 'overland' | 'deportation' | 'reference' | 'pale' | 'congress'

interface Entry {
  swatch: Swatch
  label: string
}

/** Only what is on the map right now. */
function legendEntries(view: AtlasView, context: LegendContext | null): Entry[] {
  const entries: Entry[] = [{ swatch: 'place', label: 'Story location' }]
  const lit = places.filter((p) => view.highlightedPlaceIds.has(p.id))
  if (lit.some((p) => p.approximate)) entries.push({ swatch: 'region', label: 'Region (marker at approx. center)' })
  if (view.selectedPlace) entries.push({ swatch: 'selected', label: 'Selected' })

  /* Routes are not drawn at street zoom, and an overlay far outside the viewport cannot be seen. */
  const kinds = new Set(context?.routesShown === false ? [] : [...view.visibleRouteIds].map((id) => routesById[id]?.kind))
  if (kinds.has('overland')) entries.push({ swatch: 'overland', label: 'Overland corridor (generalized)' })
  if (kinds.has('sea')) entries.push({ swatch: 'sea', label: 'Migration route (generalized)' })
  if (kinds.has('internal')) entries.push({ swatch: 'internal', label: 'Movement within the U.S. (generalized)' })
  if (kinds.has('deportation')) entries.push({ swatch: 'deportation', label: 'Deportation' })
  if (view.visibleContextMarkerIds.size) entries.push({ swatch: 'reference', label: 'Reference point' })

  for (const id of view.visibleOverlayIds) {
    if (context && !context.overlaysInView.includes(id)) continue
    const overlay = overlaysById[id]
    if (!overlay?.geojson.features.length) continue
    entries.push({ swatch: 'pale', label: `Approx. ${overlay.label}, ${overlay.dateLabel}` })
    const congress = overlay.geojson.features.find((f) => f.properties?.kind === 'congress-poland')
    if (congress) {
      const name = typeof congress.properties?.name === 'string' ? congress.properties.name : 'Kingdom of Poland (Congress Poland)'
      entries.push({ swatch: 'congress', label: `${name}, ${overlay.dateLabel}` })
    }
  }
  return entries
}

function LegendSwatch({ swatch, solemn }: { swatch: Swatch; solemn: boolean }) {
  return <span className={`atlas-legend__swatch is-${swatch}${solemn ? ' is-solemn' : ''}`} aria-hidden="true" />
}

export function MapLegend({ view, context = null }: { view: AtlasView; context?: LegendContext | null }) {
  const narrow = useIsNarrow()
  const [open, setOpen] = useState<boolean | null>(null)
  const expanded = open ?? !narrow
  const listId = useId()
  const entries = legendEntries(view, context)
  const solemn = view.tone === 'solemn'

  return (
    <div className="atlas-legend" aria-label="Map legend" role="region" data-map-ui data-expanded={expanded}>
      <button
        type="button"
        className="atlas-legend__toggle label"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setOpen(!expanded)}
      >
        <span>Legend</span>
        <ChevronDown className="atlas-legend__chevron" size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <div id={listId} className="atlas-legend__body" hidden={!expanded}>
        <ul className="atlas-legend__list">
          {entries.map((e) => (
            <li key={e.swatch}>
              <LegendSwatch swatch={e.swatch} solemn={solemn} />
              <span>{e.label}</span>
            </li>
          ))}
          <li className="atlas-legend__note">Modern borders shown faintly for reference</li>
        </ul>
      </div>
    </div>
  )
}
