import { ExternalLink } from './ExternalLink'

interface Credit {
  name: string
  role: string
  license?: string
  url: string
}

const MAP_AND_SOFTWARE: Credit[] = [
  {
    name: 'Natural Earth',
    role: 'Land and country outlines, used through world-atlas.',
    license: 'Public domain',
    url: 'https://www.naturalearthdata.com/',
  },
  {
    name: 'world-atlas',
    role: 'Natural Earth outlines packaged as TopoJSON, by Mike Bostock.',
    license: 'ISC License',
    url: 'https://github.com/topojson/world-atlas',
  },
  {
    name: 'OpenStreetMap contributors',
    role: 'Base map data.',
    license: 'Open Database License (ODbL)',
    url: 'https://www.openstreetmap.org/copyright',
  },
  {
    name: 'OpenMapTiles',
    role: 'Vector tile schema for the base map.',
    url: 'https://openmaptiles.org/',
  },
  {
    name: 'OpenFreeMap',
    role: 'Free, open hosting of the base map tiles.',
    url: 'https://openfreemap.org/',
  },
  {
    name: 'MapLibre GL JS',
    role: 'Open-source library that draws the interactive map.',
    license: 'BSD 3-Clause License',
    url: 'https://maplibre.org/',
  },
  {
    name: 'three.js',
    role: 'Open-source library for 3D graphics in the browser.',
    license: 'MIT License',
    url: 'https://threejs.org/',
  },
  {
    name: 'Cormorant Garamond',
    role: 'Display typeface by Christian Thalmann.',
    license: 'SIL Open Font License',
    url: 'https://fonts.google.com/specimen/Cormorant+Garamond',
  },
  {
    name: 'Inter',
    role: 'Interface typeface by Rasmus Andersson.',
    license: 'SIL Open Font License',
    url: 'https://rsms.me/inter/',
  },
]

const BUILT_WITH: Pick<Credit, 'name' | 'url'>[] = [
  { name: 'React', url: 'https://react.dev/' },
  { name: 'Vite', url: 'https://vite.dev/' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' },
  { name: 'Motion', url: 'https://motion.dev/' },
  { name: 'Lucide icons', url: 'https://lucide.dev/' },
]

export function MapCredits() {
  return (
    <div>
      <ul className="grid gap-x-10 md:grid-cols-2">
        {MAP_AND_SOFTWARE.map((credit) => (
          <li key={credit.name} className="border-t border-line py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <ExternalLink
                href={credit.url}
                className="font-serif text-[1.3rem] leading-snug text-parchment hover:text-gold-soft"
              >
                {credit.name}
              </ExternalLink>
              {credit.license && <span className="label !tracking-[0.18em] text-mist">{credit.license}</span>}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-parchment/65">{credit.role}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-mist">
        Also built with{' '}
        {BUILT_WITH.map((credit, i) => (
          <span key={credit.name}>
            <ExternalLink
              href={credit.url}
              arrow={false}
              className="text-parchment/85 underline decoration-line-strong underline-offset-4 hover:text-gold-soft hover:decoration-gold"
            >
              {credit.name}
            </ExternalLink>
            {i < BUILT_WITH.length - 2 ? ', ' : i === BUILT_WITH.length - 2 ? ' and ' : '.'}
          </span>
        ))}
      </p>
    </div>
  )
}
