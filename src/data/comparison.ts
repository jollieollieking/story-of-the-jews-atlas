import type { Comparison, Source } from '../types'

/**
 * Old World / New World comparison: an Eastern European shtetl beside the
 * Lower East Side of New York. These are general patterns, not one town or
 * one family; real places varied a great deal.
 *
 * Every point is drawn from the sources listed in `comparisonSources` plus the
 * shared Episode 4 transcript reference ('pbs-wisconsin-episode-4') and the
 * Forward Building report ('nyc-lpc-forward-building'). 'yivo-shtetl' and
 * 'nyc-lpc-forward-building' are cited by several files, so they live in src/data/sources.ts.
 */
export const comparison: Comparison = {
  title: 'From the shtetl to the Lower East Side',
  intro:
    'In Episode 4, Simon Schama calls the Lower East Side a “mega-shtetl.” Putting the two side by side shows what immigrants brought with them and what changed once they got to America. These are general patterns, since every town, neighborhood and family was different.',
  oldWorld: {
    heading: 'The shtetl',
    place: 'Jewish market towns of Eastern Europe',
    era: 'Late 1800s to World War I',
    imageId: 'lower-east-side-jedrzejow-market-1916',
    points: [
      {
        label: 'Home',
        text: 'Most buildings were made of wood, and the town was built around a market square. The dirt streets turned to mud in spring and fall, and fires happened a lot.',
      },
      {
        label: 'Work',
        text: 'Market day, when peasants came into town to trade, was the most important day for business. Jews worked as shopkeepers, tailors, shoemakers, carpenters, wagon drivers and water carriers.',
      },
      {
        label: 'Language',
        text: 'Yiddish was the everyday language, and it had lots of sayings that came from religious tradition. It borrowed many Slavic words, but it still set Jews apart from their mostly Slavic neighbors.',
      },
      {
        label: 'Faith',
        text: 'A shtetl was big enough to have at least one synagogue, a ritual bath, a cemetery and schools. The Sabbath was the only real time of rest all week.',
      },
      {
        label: 'Community',
        text: 'Volunteer groups buried the dead, visited the sick and gave dowries to poor brides. It was a small world where almost everyone knew each other by name.',
      },
    ],
  },
  newWorld: {
    heading: 'The Lower East Side',
    place: 'Manhattan, New York City',
    era: 'c. 1880s–1920s',
    imageId: 'lower-east-side-hester-street-1903',
    points: [
      {
        label: 'Home',
        text: 'Many families lived in tenements, which were crowded walk-up buildings. One of them, 97 Orchard Street, was home to an estimated 7,000 people from over 20 countries between 1863 and 1935.',
      },
      {
        label: 'Work',
        text: 'Many people worked in the garment trade, often in small shops or at home. One block of Orchard Street once had over 100 apartments with clothing workshops. Others sold from pushcarts.',
      },
      {
        label: 'Language',
        text: 'Yiddish was still the language of home and the street. Yiddish newspapers, theater and poetry did well, and Episode 4 says the Forward introduced readers to baseball and voting.',
      },
      {
        label: 'Faith',
        text: 'Most immigrants were Orthodox, but working to get ahead made it hard to keep the Sabbath. Episode 4 says the Forward and a bank took over the rabbi’s authority.',
      },
      {
        label: 'Community',
        text: 'Hometown societies (landsmanshaftn), unions and charities took over jobs the old community used to do. Episode 4 says over 80,000 mostly Jewish garment workers went on strike in 1909–1910.',
      },
    ],
  },
  sourceIds: ['pbs-wisconsin-episode-4', 'yivo-shtetl', 'nps-tenement-faq', 'mjl-lower-east-side', 'nyc-lpc-forward-building'],
}

export const comparisonSources: Source[] = [
  {
    id: 'nps-tenement-faq',
    title: 'Lower East Side Tenement Museum National Historic Site: Frequently Asked Questions',
    publisher: 'U.S. National Park Service',
    url: 'https://www.nps.gov/loea/faqs.htm',
    kind: 'institutional',
    usedFor: 'Residents of 97 Orchard Street (1863–1935) and clothing workshops in Orchard Street apartments.',
  },
  {
    id: 'mjl-lower-east-side',
    title: 'The Lower East Side of New York City',
    publisher: 'My Jewish Learning (reprinted from A Historical Atlas of the Jewish People, Schocken Books)',
    url: 'https://www.myjewishlearning.com/article/the-lower-east-side-of-new-york-city/',
    kind: 'encyclopedia',
    usedFor:
      'Immigrant jobs (garment industry, petty trade), the Jewish labor movement, Yiddish culture, Orthodox practice under American pressures, and new community organizations.',
  },
]
