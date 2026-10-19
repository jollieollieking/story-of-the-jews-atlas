import type { Period, PeriodId } from '../types'

/** Timeline periods. Selecting one flies the camera, highlights its chapters' places and routes. */
export const periods: Period[] = [
  {
    id: 'settlement',
    label: 'Jewish settlement in Eastern Europe',
    years: '1200s–1795',
    description:
      'Jewish communities grow across the Kingdom of Poland and the Grand Duchy of Lithuania, which unite as the Polish–Lithuanian Commonwealth in 1569.',
    chapterIds: ['shtetls'],
    camera: { center: [23.6, 53.0], zoom: 4.5 },
    mobileCamera: { center: [24.0, 53.1], zoom: 3.75 },
  },
  {
    id: 'partitions',
    label: 'Expansion of Russian control',
    years: '1772–1835',
    description:
      'Russia, Prussia and Austria partition the Commonwealth. The Russian Empire gains a large Jewish population and restricts where Jews may live.',
    chapterIds: ['pale'],
    camera: { center: [27.5, 51.4], zoom: 4.1 },
    mobileCamera: { center: [27.5, 51.4], zoom: 3.4 },
  },
  {
    id: 'pale-life',
    label: 'Life in the Pale of Settlement',
    years: 'Late 1700s–1905',
    description:
      'Most Jews in the Russian Empire live inside the Pale, where Hasidism, Yiddish culture and new political ideas take shape.',
    chapterIds: ['pale', 'faith-ideas'],
    camera: { center: [28.7, 50.6], zoom: 4.4 },
    mobileCamera: { center: [28.6, 50.0], zoom: 3.6 },
  },
  {
    id: 'emigration',
    label: 'Mass emigration',
    years: '1881–1924',
    description:
      'Poverty, discrimination and violence push millions of Jews to leave Eastern Europe. Most who cross the Atlantic settle in the United States.',
    chapterIds: ['atlantic', 'lower-east-side'],
    camera: { center: [-36, 47.5], zoom: 2.35 },
    mobileCamera: { center: [-25, 47], zoom: 1 },
  },
  {
    id: 'american-culture',
    label: 'Jewish American cultural influence',
    years: '1890s–1940',
    description:
      'The children of immigrants help shape American popular music on Tin Pan Alley and the new film industry in Hollywood.',
    chapterIds: ['american-culture'],
    camera: { center: [-96, 38.6], zoom: 3.35 },
    mobileCamera: { center: [-96, 38.6], zoom: 2.4 },
  },
  {
    id: 'destruction',
    label: 'Destruction of Eastern European communities',
    years: '1939–1945',
    description:
      'During the Holocaust, Nazi Germany and its collaborators murder about six million Jews and destroy the Jewish communities of Eastern Europe.',
    chapterIds: ['destruction'],
    camera: { center: [21.4, 52.4], zoom: 5.0 },
    mobileCamera: { center: [21.4, 52.4], zoom: 4.3 },
  },
]

export const periodsById = Object.fromEntries(periods.map((p) => [p.id, p])) as Record<PeriodId, Period>
