import type { LngLat, Overlay, OverlayId, Source } from '../types'

/*
 * Pale of Settlement as defined by the 1835 statute, plus the Kingdom of Poland
 * ("Congress Poland") as a separate, visually distinct feature.
 *
 * HOW THIS WAS DRAWN: the outer edge of the provinces listed in the 1835 statute was
 * traced by hand from known historical borders (the Russian-Prussian and
 * Russian-Austrian frontiers, the Western Bug, Neman, Zbruch, Prut and Danube rivers,
 * the Courland, Livonia, Pskov, Smolensk, Orel, Kursk, Kharkov and Don Host
 * boundaries) and the Black Sea / Sea of Azov coasts, checked against the 1905
 * Jewish Encyclopedia map, then simplified (about 5 km tolerance). It is a
 * classroom-scale approximation, not a surveyed border.
 *
 * Rings are [longitude, latitude], closed, and counter-clockwise (RFC 7946).
 * The two features share their common border vertex-for-vertex, so they meet
 * without gaps or overlaps.
 */

/** Outer boundary of the provinces of the 1835 Pale (Kovno was still part of Vilna province then). */
const PALE_RING: LngLat[] = [
  [21.1, 55.9], [21.62, 55.42], [22.3, 55.12], [22.65, 55.07], [23.1, 55.05], [23.85, 54.86],
  [24.15, 54.15], [22.75, 53.45], [22.82, 53.18], [22.72, 52.92], [22.35, 52.62], [22.66, 52.4],
  [23.45, 52.2], [23.65, 52.05], [23.55, 51.55], [23.65, 51.3], [24.1, 50.88], [24.06, 50.68],
  [25.05, 50.28], [26.05, 49.65], [26.17, 49.45], [26.25, 48.55], [26.2, 48.38], [26.28, 48.22],
  [26.85, 48.24], [28.02, 46.92], [28.2, 46.38], [28.1, 45.8], [28.2, 45.48], [28.45, 45.36],
  [28.84, 45.32], [29.3, 45.43], [29.72, 45.35], [29.75, 45.6], [30.4, 46.08], [30.85, 46.6],
  [31.52, 46.6], [31.52, 46.55], [32.4, 46.14], [33.68, 46.12], [33.6, 45.95], [32.55, 45.52],
  [32.48, 45.36], [32.8, 45.35], [33.4, 45.18], [33.6, 45.05], [33.48, 44.62], [33.75, 44.39],
  [34.15, 44.48], [34.42, 44.66], [35.38, 45.02], [35.7, 45.08], [36.05, 45.02], [36.4, 45.1],
  [36.62, 45.42], [35.9, 45.43], [35.5, 45.3], [34.82, 46.17], [35.9, 46.62], [36.8, 46.75],
  [37.55, 47.08], [38.92, 47.22], [39.3, 47.12], [39.75, 47.15], [39.95, 47.25], [39.98, 47.6],
  [39.85, 48.0], [39.92, 48.4], [39.8, 48.8], [39.3, 48.95], [38.6, 48.98], [37.5, 48.88],
  [36.4, 49.15], [35.9, 49.35], [34.6, 50.2], [34.35, 50.5], [33.62, 51.05], [33.55, 51.3],
  [33.9, 51.45], [34.15, 51.7], [34.15, 52.05], [33.85, 52.3], [33.35, 52.38], [33.25, 52.62],
  [33.8, 53.1], [33.4, 53.35], [33.0, 53.45], [32.7, 53.38], [32.7, 53.55], [32.4, 53.8],
  [31.05, 54.75], [30.95, 55.05], [31.3, 55.3], [31.45, 55.6], [31.2, 55.9], [30.6, 56.15],
  [28.9, 56.45], [28.2, 56.78], [27.85, 57.3], [27.4, 57.35], [26.6, 56.88], [25.75, 56.62],
  [26.45, 55.84], [26.85, 55.79], [26.63, 55.67], [26.2, 55.95], [25.7, 56.13], [25.2, 56.2],
  [24.8, 56.38], [24.3, 56.3], [22.0, 56.42], [21.25, 56.1], [21.1, 55.9],
]

/** Kingdom of Poland in the 1830s, west of the Pale (eastern edge identical to the Pale's western edge). */
const CONGRESS_POLAND_RING: LngLat[] = [
  [22.65, 55.07], [22.85, 54.78], [22.75, 54.45], [22.8, 54.3], [22.45, 53.68], [21.95, 53.45],
  [20.9, 53.32], [20.4, 53.2], [19.8, 53.2], [18.9, 53.0], [17.95, 52.4], [17.98, 51.75],
  [18.18, 51.4], [18.45, 51.12], [18.75, 50.95], [19.0, 50.65], [19.05, 50.35], [19.3, 50.25],
  [20.15, 50.1], [21.45, 50.48], [21.85, 50.75], [22.6, 50.45], [23.1, 50.35], [23.6, 50.42],
  [24.06, 50.68], [24.1, 50.88], [23.65, 51.3], [23.55, 51.55], [23.65, 52.05], [23.45, 52.2],
  [22.66, 52.4], [22.35, 52.62], [22.72, 52.92], [22.82, 53.18], [22.75, 53.45], [24.15, 54.15],
  [23.85, 54.86], [23.1, 55.05], [22.65, 55.07],
]

export const overlays: Overlay[] = [
  {
    id: 'pale-1835',
    label: 'Pale of Settlement',
    dateLabel: '1835',
    caveat:
      'Approximate, simplified boundary based on the 1835 statute; not a precise historical border. ' +
      'The Kingdom of Poland, shown separately, was never legally part of the Pale.',
    sourceIds: ['yivo-pale-of-settlement', 'overlay-je-pale-of-settlement', 'overlay-je-1905-pale-map'],
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'pale',
          properties: {
            name: 'Pale of Settlement (1835)',
            kind: 'pale',
            note:
              'The provinces of the Russian Empire where Jews were allowed to live permanently under the 1835 ' +
              'statute: Vilna (which then still included Kovno), Grodno (with the Belostok district), Minsk, Vitebsk, ' +
              'Mogilev, Volhynia, ' +
              'Podolia, Kiev, Chernigov, Poltava, Kherson, Yekaterinoslav, Taurida (with Crimea) and ' +
              'Bessarabia. Even inside this line, Jews were barred from the cities of Kiev, Nikolaev and ' +
              'Sevastopol, from villages in Mogilev and Vitebsk provinces, from Cossack and crown villages in ' +
              'Chernigov and Poltava, and from new settlement within 50 versts (about 53 km) of the western ' +
              'frontier. Courland and the Livonian towns of Riga and Shlok, outside the line, allowed only ' +
              'Jews already registered there. Taganrog and the Rostov district, inside the line in 1835, ' +
              'were later removed from the Pale under Alexander III (1881–1894).',
          },
          geometry: { type: 'Polygon', coordinates: [PALE_RING] },
        },
        {
          type: 'Feature',
          id: 'congress-poland',
          properties: {
            name: 'Kingdom of Poland ("Congress Poland")',
            kind: 'congress-poland',
            note:
              'Ruled by the Russian tsar but administered separately, with its own, quite different rules for ' +
              'Jews. It was not part of the Pale, but Jews here also lived under residence restrictions and ' +
              'were barred from the Russian interior. Shown for context only.',
          },
          geometry: { type: 'Polygon', coordinates: [CONGRESS_POLAND_RING] },
        },
      ],
    },
  },
]

/** Sources cited by the overlays (merged into the site-wide source list). */
export const overlaySources: Source[] = [
  {
    id: 'overlay-je-pale-of-settlement',
    title: 'Pale of Settlement',
    publisher: 'Herman Rosenthal, The Jewish Encyclopedia (1901–1906)',
    url: 'https://www.jewishencyclopedia.com/articles/11862-pale-of-settlement',
    kind: 'encyclopedia',
    usedFor:
      'The 1835 restrictions inside the Pale, the rule that the Polish provinces were not in the Pale, and the later ' +
      'removal of Taganrog and the Rostov district from it.',
  },
  {
    id: 'overlay-je-1905-pale-map',
    title: 'Map showing the percentage of Jews in the Pale of Settlement and Congress Poland (The Jewish Encyclopedia, 1905)',
    publisher: 'Wikimedia Commons (public domain; from The Jewish Encyclopedia, vol. 10, "Russia", p. 531)',
    url: 'https://commons.wikimedia.org/wiki/File:Map_showing_the_percentage_of_Jews_in_the_Pale_of_Settlement_and_Congress_Poland,_The_Jewish_Encyclopedia_(1905).jpg',
    kind: 'archive',
    usedFor: 'Reference map used to check the shape of the simplified Pale and Kingdom of Poland outlines on the atlas.',
  },
]

export const overlaysById = Object.fromEntries(overlays.map((o) => [o.id, o])) as Record<OverlayId, Overlay>
