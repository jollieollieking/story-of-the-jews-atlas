import type { Source } from '../types'

/**
 * Sources shared across chapters (or cited by more than one data file).
 * Chapter-specific sources live in src/data/stories/<chapter>.ts.
 */
export const sharedSources: Source[] = [
  {
    id: 'pbs-episode-4',
    title: 'The Story of the Jews, Episode Four: "Over the Rainbow"',
    publisher: 'PBS / WNET, presented by Simon Schama',
    url: 'https://www.pbs.org/wnet/story-jews/video/episode-four-over-the-rainbow/',
    kind: 'documentary',
    usedFor: 'Primary documentary reference for every chapter.',
  },
  {
    id: 'pbs-wisconsin-episode-4',
    title: 'The Story of the Jews: "Over the Rainbow" (program page and transcript)',
    publisher: 'PBS Wisconsin',
    url: 'https://pbswisconsin.org/watch/story-jews-program/story-jews-program-over-rainbow/',
    kind: 'transcript',
    usedFor: 'Episode reference used to connect each location to the documentary.',
  },
  {
    id: 'pbs-jews-arts-10-innovators',
    title: 'Jews & The Arts: 10 Innovators',
    publisher: 'PBS / WNET, The Story of the Jews companion website (not part of the episode)',
    url: 'https://www.pbs.org/wnet/story-jews/explore-the-diaspora/10-influential-jewish-american-artists/',
    kind: 'institutional',
    usedFor:
      'Yip Harburg’s birth in 1896 on Allen Street, Louis B. Mayer’s 1938 hiring of Harburg for The Wizard of Oz, and the 1940 Oscar for “Over the Rainbow” (Ch. 5 and 6). The page’s 1930 date for “Brother, Can You Spare a Dime?” conflicts with the episode and is not used.',
  },
  {
    id: 'yivo-shtetl',
    title: 'Shtetl',
    publisher: 'Samuel Kassow, YIVO Encyclopedia of Jews in Eastern Europe',
    url: 'https://encyclopedia.yivo.org/article.aspx/Shtetl',
    kind: 'encyclopedia',
    usedFor:
      'Meaning of the word shtetl, the origins of private market towns, the arenda leasing system, the market square, wooden buildings and Jewish population shares (Ch. 1); shtetl housing, market day, occupations, Yiddish, communal institutions, the Sabbath, volunteer societies and emigrant hometown societies (landsmanshaftn) (Old World / New World comparison).',
  },
  {
    id: 'ushmm-lithuania',
    title: 'Lithuania',
    publisher: 'United States Holocaust Memorial Museum, Holocaust Encyclopedia',
    url: 'https://encyclopedia.ushmm.org/content/en/article/lithuania',
    kind: 'encyclopedia',
    usedFor:
      'Lithuanian Jewish culture and its role in the workers’ movement and Zionism, the prewar population of about 160,000 (Ch. 1), and the murder of about 90 percent of Lithuania’s Jews by German forces and Lithuanian auxiliaries (Ch. 1 and 7).',
  },
  {
    id: 'yivo-pale-of-settlement',
    title: 'Pale of Settlement',
    publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (John Klier)',
    url: 'https://encyclopedia.yivo.org/article.aspx/Pale_of_Settlement',
    kind: 'encyclopedia',
    usedFor:
      'The 1790 merchants’ protest, the statutes of 1804 and 1835, the provinces, the Pale’s size, limits inside it, Russian Poland’s separate status, the May Laws, causes of poverty, and the wartime breakdown and 1917 abolition (Ch. 2); the extent of the Pale shown on the map overlay.',
  },
  {
    id: 'yivo-russian-empire',
    title: 'Russia: Russian Empire',
    publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Michael Stanislawski)',
    url: 'https://encyclopedia.yivo.org/article.aspx/Russia/Russian_Empire',
    kind: 'encyclopedia',
    usedFor:
      'Partition years, the largest Jewish population in the world, the 1882 May Laws, the 1897 census figure, historians’ debate, and the emigration of about 3 million Jews in the 33 years after 1881 (Ch. 2); also the May Laws and economic causes of emigration (Ch. 4 and the emigration routes).',
  },
  {
    id: 'yivo-pogroms',
    title: 'Pogroms',
    publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (John Klier)',
    url: 'https://encyclopedia.yivo.org/article.aspx/Pogroms',
    kind: 'encyclopedia',
    usedFor:
      'The 1881–82 pogrom waves in the southwestern provinces, mostly against property, including the Kiev pogrom of 26 April (7 May) 1881 (Ch. 2); also the 1903–1906 wave, including Kishinev (Ch. 4).',
  },
  {
    id: 'yivo-population-and-migration-before-wwi',
    title: 'Population and Migration: Population and Migration before World War I',
    publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Mark Kupovetsky)',
    url: 'https://encyclopedia.yivo.org/article.aspx/Population_and_Migration/Population_and_Migration_before_World_War_I',
    kind: 'encyclopedia',
    usedFor:
      'Only about 6 percent of Jews in European Russia lived legally outside the Pale before World War I, and about 2 million Jews left the Russian Empire in 1881–1914 (Ch. 2); also over 760,000 emigrants from Eastern Europe in 1881–1900 and about 1.6 million in 1901–1914, and the economic pull of the United States (Ch. 4).',
  },
  {
    id: 'nyc-lpc-forward-building',
    title: 'Forward Building, 173–175 East Broadway, Borough of Manhattan (Designation Report LP-1419)',
    publisher: 'New York City Landmarks Preservation Commission (March 18, 1986)',
    url: 'https://s-media.nyc.gov/agencies/lpc/lp/1419.pdf',
    kind: 'institutional',
    usedFor:
      'Founding of the Jewish Daily Forward (1897), Abraham Cahan, circulation, the “Bintel Brief,” Yiddish as the immigrants’ shared language, and estimates of East European Jewish immigration to the Lower East Side (Ch. 5, the comparison and the routes to New York).',
  },
]
