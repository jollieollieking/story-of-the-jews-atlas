import type { ContextMarker, Route } from '../types'

/**
 * Directional movements drawn on the map. Only movements with clear historical support are
 * drawn, and each is a generalized corridor, not one family's exact journey.
 */
export const routes: Route[] = [
  {
    id: 'pale-to-hamburg',
    kind: 'overland',
    label: 'Overland to Hamburg',
    path: [
      [24.6, 54.6],
      [13.4, 52.52],
      [9.99, 53.55],
    ],
    fromLabel: 'Northern Pale of Settlement',
    toLabel: 'Hamburg',
    years: 'c. 1881–1914',
    evidence:
      'Generalized corridor. Many emigrants from the Russian Empire crossed Germany to reach the North Sea ports, often by rail, though some walked; individual routes varied.',
    sourceIds: ['hamburg-geschichtsbuch-emigration-port', 'yivo-america-lederhendler', 'yivo-russian-empire'],
    chapterIds: ['atlantic'],
  },
  {
    id: 'pale-to-bremen',
    kind: 'overland',
    label: 'Overland to Bremen',
    path: [
      [28.5, 50.4],
      [21.0, 52.23],
      [13.4, 52.52],
      [8.58, 53.54],
    ],
    fromLabel: 'Russian Empire (the Pale and Congress Poland)',
    toLabel: 'Bremen / Bremerhaven',
    years: 'c. 1881–1914',
    evidence:
      'Generalized corridor. Bremen and its port at Bremerhaven were, with Hamburg, the main German ports of embarkation for Eastern European emigrants.',
    sourceIds: ['hamburg-geschichtsbuch-emigration-port', 'bremerhaven-museum-emigrants-database', 'yivo-america-lederhendler'],
    chapterIds: ['atlantic'],
  },
  {
    id: 'hamburg-to-new-york',
    kind: 'sea',
    label: 'Steamship from Hamburg',
    path: [
      [9.99, 53.55],
      [8.75, 53.9],
      [8.0, 54.05],
      [6.2, 53.8],
      [4.4, 53.25],
      [3.0, 52.0],
      [1.6, 51.05],
      [0.6, 50.6],
      [-1.3, 50.4],
      [-5.6, 49.6],
      [-50.0, 43.0],
      [-69.0, 40.2],
      [-73.82, 40.45],
      [-73.97, 40.49],
      [-74.035, 40.55],
      [-74.047, 40.605],
      [-74.05, 40.66],
      [-74.0396, 40.6995],
    ],
    fromLabel: 'Hamburg',
    toLabel: 'New York',
    years: 'c. 1881–1924',
    evidence:
      'Hamburg–New York steamship lines carried large numbers of Eastern European Jewish emigrants. Other ports were also used; individual routes varied.',
    sourceIds: ['hamburg-geschichtsbuch-emigration-port', 'yivo-america-lederhendler', 'nps-ellis-island-history-culture', 'nps-castle-clinton-history', 'nyc-lpc-forward-building'],
    chapterIds: ['atlantic'],
  },
  {
    id: 'bremen-to-new-york',
    kind: 'sea',
    label: 'Steamship from Bremerhaven',
    path: [
      [8.58, 53.54],
      [8.48, 53.7],
      [8.1, 53.9],
      [6.2, 53.8],
      [4.4, 53.25],
      [3.0, 52.0],
      [1.4, 50.9],
      [-5.6, 49.6],
      [-50.0, 43.0],
      [-69.0, 40.2],
      [-73.82, 40.45],
      [-73.97, 40.49],
      [-74.035, 40.55],
      [-74.047, 40.605],
      [-74.05, 40.66],
      [-74.0396, 40.6995],
    ],
    fromLabel: 'Bremen / Bremerhaven',
    toLabel: 'New York',
    years: 'c. 1881–1924',
    evidence:
      'Bremerhaven was the largest continental port of emigration, and ships from it carried large numbers of Eastern European emigrants to New York.',
    sourceIds: ['bremerhaven-museum-emigrants-database', 'hamburg-geschichtsbuch-emigration-port', 'nps-ellis-island-history-culture', 'nps-castle-clinton-history', 'nyc-lpc-forward-building'],
    chapterIds: ['atlantic'],
  },
  {
    id: 'new-york-to-hollywood',
    kind: 'internal',
    label: 'The film industry moves west',
    path: [
      [-73.97, 40.85],
      [-118.3267, 34.0983],
    ],
    fromLabel: 'New York area (incl. Fort Lee, N.J.)',
    toLabel: 'Hollywood',
    years: '1910s',
    evidence:
      'Film production moved from the New York area, including Fort Lee, New Jersey, to the Los Angeles area in the 1910s, as companies such as Universal and Jesse Lasky’s firm set up in Southern California. This marks the movement of an industry, not of a single group of people.',
    sourceIds: ['hfa-100-years-paramount', 'nara-carl-laemmle', 'afi-catalog-squaw-man', 'ca-ohp-demille-studio-barn', 'explorepa-warner-first-theater', 'academy-museum-hollywoodland'],
    chapterIds: ['american-culture'],
  },
  {
    id: 'kosice-to-auschwitz',
    kind: 'deportation',
    label: 'Deportation, 1944',
    path: [
      [21.2611, 48.7164],
      [19.1786, 50.0343],
    ],
    fromLabel: 'Košice',
    toLabel: 'Auschwitz-Birkenau',
    years: 'From May 16, 1944',
    evidence:
      'Jews held in two brickworks and a small ghetto in Košice, then under Hungarian rule, were deported by train to Auschwitz-Birkenau from May 16, 1944.',
    sourceIds: ['jvl-kosice', 'ushmm-holocaust-in-hungary', 'auschwitz-museum-hungarian-deportations', 'pbs-wisconsin-episode-4'],
    chapterIds: ['destruction'],
  },
]

export const routesById = Object.fromEntries(routes.map((r) => [r.id, r])) as Record<string, Route>

/** Labelled reference points that are not story locations. */
export const contextMarkers: ContextMarker[] = [
  {
    id: 'hamburg',
    name: 'Hamburg',
    coordinates: [9.9937, 53.5511],
    note: 'Port of embarkation',
    chapterIds: ['atlantic'],
  },
  {
    id: 'bremen',
    name: 'Bremerhaven',
    coordinates: [8.5809, 53.5396],
    note: 'Port of embarkation',
    chapterIds: ['atlantic'],
  },
  {
    id: 'auschwitz-birkenau',
    name: 'Auschwitz-Birkenau',
    coordinates: [19.1786, 50.0343],
    note: 'German Nazi concentration and extermination camp',
    chapterIds: ['destruction'],
  },
]

export const contextMarkersById = Object.fromEntries(contextMarkers.map((m) => [m.id, m])) as Record<
  string,
  ContextMarker
>
