import type { ChapterContent, Source } from '../../types'
import { comparisonSources } from '../comparison'

/**
 * Chapter 05: The Lower East Side.
 *
 * Documentary material (what Episode 4 says) lives only in `documentaryConnection`
 * and is checked against the PBS Wisconsin transcript (lines 59–69 and 88).
 * Everything else is additional historical context from the sources below.
 */

/** Sources defined in comparison.ts that this chapter's card also cites. */
const SHARED_WITH_COMPARISON = ['nps-tenement-faq', 'mjl-lower-east-side']

const chapterSources: Source[] = [
  {
    id: 'jwa-uprising-of-20000',
    title: 'Uprising of 20,000 (1909)',
    publisher: 'Tony Michels, Jewish Women’s Archive Encyclopedia',
    url: 'https://jwa.org/encyclopedia/article/uprising-of-20000-1909',
    kind: 'encyclopedia',
    usedFor: 'The 1909 shirtwaist strike, the 1910 cloak makers’ strike, and the growth of garment unions.',
  },
  {
    id: 'jwa-triangle-shirtwaist-fire',
    title: 'Triangle Shirtwaist Fire',
    publisher: 'Hadassa Kosak, Jewish Women’s Archive Encyclopedia',
    url: 'https://jwa.org/encyclopedia/article/triangle-shirtwaist-fire',
    kind: 'encyclopedia',
    usedFor: 'Date, location and death toll of the 1911 Triangle fire, and the Factory Investigating Commission that followed.',
  },
  {
    id: 'nara-tenement-over-time',
    title: 'Life on the Lower East Side: A Tenement over Time',
    publisher: 'U.S. National Archives (educator resources)',
    url: 'https://www.archives.gov/education/lessons/tenement.html',
    kind: 'institutional',
    usedFor:
      '97 Orchard Street as home to nearly 7,000 immigrants, and the Port of New York as the entry point for nearly three-quarters of immigrants at the peak of immigration.',
  },
]

const content: ChapterContent = {
  chapterText: {
    subtitle: 'Tenements, pushcarts, Yiddish newspapers and the fight for fair work',
    dateRange: '1880s–1920s',
    summary:
      'Most Jewish immigrants who landed in New York settled just streets from the docks, in the crowded tenements of Manhattan’s Lower East Side. Schama calls it a “mega-shtetl.” Yiddish newspapers like the Forward explained America to newcomers, while garment workers organized unions and went on strike for fairer pay. The future songwriter Yip Harburg was born here, in a sixth-floor walk-up on Allen Street.',
  },
  stories: [
    {
      placeId: 'lower-east-side',
      theme: 'Immigrant life: tenements, the Yiddish press and garment unions',
      period: '1880s to 1920s',
      whatHappened: [
        'Between the 1880s and the 1920s, between 2 million and 2.5 million Jews from Eastern Europe came to the United States. Estimates differ, but most of them began their American lives on the Lower East Side. Families crowded into tenements, walk-up apartment buildings with small rooms. One of them, 97 Orchard Street, housed an estimated 7,000 people from more than 20 countries between 1863 and 1935. Homes were often workplaces too: at one time, more than 100 apartments on a single block of Orchard Street held clothing workshops.',
        'Many immigrants worked in the garment trade, often in cramped “sweatshops.” Others made a living in small trade, such as selling from pushcarts in street markets like Hester Street’s. Yiddish was the shared language of the neighborhood. The Jewish Daily Forward, founded in 1897 and shaped for nearly fifty years by its editor Abraham Cahan, became the world’s leading Yiddish newspaper, with paid circulation over 250,000 by the mid-1920s. Its advice column, the “Bintel Brief” (“bundle of letters”), printed readers’ own letters about love, work and family.',
        'Workers also fought back. In November 1909, more than 20,000 shirtwaist makers, mostly young Yiddish-speaking women, began an eleven-week strike. In 1910, about 60,000 cloak makers followed. Within a few years, the garment trades were among the best-organized in the country. Then, on March 25, 1911, a fire at the Triangle Shirtwaist Company in nearby Greenwich Village killed 146 workers, most of them young immigrant women, many of them Jewish. After public protests, the state legislature set up a Factory Investigating Commission, which helped write new safety laws.',
      ],
      whyItMatters:
        'For more than a million Eastern European Jews, the Lower East Side was where they first learned to be American without ceasing to be Jewish. Yiddish newspapers, theaters, unions and charities turned old habits of community and mutual help into tools for surviving a harsh new city. Children raised in its tenements, like Yip Harburg, later carried its voice into American music and film.',
      documentaryConnection:
        'Schama calls the Lower East Side a “mega-shtetl.” He says more than 60% of the 2.5 million Jews arriving in America between the 1880s and 1920s started out there. He argues that the Daily Forward and the Jarmulowsky Bank took over the rabbi’s old authority, and both expressed tzedakah, charity and justice carried over from the shtetl. The episode tells how Yip Harburg was born in a sixth-floor Allen Street walk-up to poor, Yiddish-speaking parents from Minsk, and recalls the 1909–1910 garment strikes. It does not discuss the Triangle fire.',
      keyFacts: [
        { label: '97 Orchard Street', value: 'About 7,000 residents, 1863–1935', sourceId: 'nps-tenement-faq' },
        { label: 'The Forward founded', value: '1897', sourceId: 'nyc-lpc-forward-building' },
        { label: 'Forward circulation peak', value: 'Over 250,000 (mid-1920s)', sourceId: 'nyc-lpc-forward-building' },
        { label: 'Shirtwaist strike, 1909', value: 'More than 20,000 strikers', sourceId: 'jwa-uprising-of-20000' },
      ],
      imageIds: [
        'lower-east-side-hester-norfolk-1898',
        'lower-east-side-forward-newsboys-1913',
        'lower-east-side-ludlow-street-sweatshop',
        'lower-east-side-hester-street-1903',
      ],
      sourceIds: [
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
        'nyc-lpc-forward-building',
        'nps-tenement-faq',
        'nara-tenement-over-time',
        'mjl-lower-east-side',
        'jwa-uprising-of-20000',
        'jwa-triangle-shirtwaist-fire',
        'pbs-jews-arts-10-innovators',
        'loc-haven-to-home-century-of-immigration',
      ],
      needsVerification: [
        'Immigration figures differ. Episode 4 says 2.5 million Jews arrived between the 1880s and 1920s and more than 60% began on the Lower East Side. The Library of Congress gives over 2.5 million East European Jewish immigrants for 1881–1924 (see Chapter 4). The 1986 NYC Landmarks report gives about 2 million (1881–1925), with about 75% settling on the Lower East Side. No second source confirmed the share who began on the Lower East Side.',
      ],
    },
  ],
  sources: [...chapterSources, ...comparisonSources.filter((s) => SHARED_WITH_COMPARISON.includes(s.id))],
  images: [
    {
      id: 'lower-east-side-hester-norfolk-1898',
      src: '/images/lower-east-side/lower-east-side-hester-norfolk-1898.jpg',
      width: 1600,
      height: 1221,
      alt: 'Black-and-white street photograph of Hester Street seen from Norfolk Street: women in long skirts and shawls and a bearded older man stand among pushcarts and barrels of produce, with tall tenement buildings and shop awnings lining the street behind them.',
      caption:
        'Hester Street looking west from Norfolk Street, Lower East Side, New York, c. 1898. Shoppers and peddlers gather around pushcarts below the tenements. Photograph; photographer and holding archive not recorded.',
      date: 'c. 1898',
      creator: 'Unknown',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Norfolk_and_Hester_Street_around_1898.jpg',
    },
    {
      id: 'lower-east-side-forward-newsboys-1913',
      src: '/images/lower-east-side/lower-east-side-forward-newsboys-1913.jpg',
      width: 829,
      height: 640,
      alt: 'Black-and-white photograph of about thirty newsboys in caps and coats crowded on the steps of a building at night, several holding bundles of newspapers under their arms.',
      caption:
        'Newsboys waiting at night for copies of the Yiddish daily Forward on the Lower East Side, New York, March 1913. Photograph by Lewis Hine for the National Child Labor Committee.',
      date: 'March 1913',
      creator: 'Lewis Hine',
      institution: 'Library of Congress (National Child Labor Committee collection, LC-DIG-nclc-03863)',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Waiting_for_the_forwards.jpg',
    },
    {
      id: 'lower-east-side-ludlow-street-sweatshop',
      src: '/images/lower-east-side/lower-east-side-ludlow-street-sweatshop.jpg',
      width: 1280,
      height: 1005,
      alt: 'Black-and-white interior photograph of a cramped tenement room used as a workshop: a bearded man in suspenders sews a heavy garment on his lap, other workers sit at tables by the windows, and piles of cloth cover the chairs and floor.',
      caption:
        'Sweatshop in a Ludlow Street tenement on the Lower East Side, New York, c. 1889. The archive record does not name the workers. Photograph by Jacob Riis.',
      date: 'c. 1889',
      creator: 'Jacob Riis',
      institution: 'Library of Congress, Prints and Photographs Division (cph.3a24271)',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sweatshop_in_Ludlow_Street_Tenement,_New_York_cph.3a24271.jpg',
    },
    {
      id: 'lower-east-side-hester-street-1903',
      src: '/images/lower-east-side/lower-east-side-hester-street-1903.jpg',
      width: 600,
      height: 822,
      alt: 'Black-and-white photograph looking down a packed Hester Street: crowds of shoppers and vendors fill the roadway between pushcarts loaded with goods, horse-drawn wagons and awnings, with tenement buildings rising on both sides.',
      caption:
        'Hester Street on the Lower East Side, New York, c. 1903. Pushcart market crowded with shoppers and peddlers. Lantern slide photograph.',
      date: 'c. 1903',
      creator: 'Unknown',
      institution: 'U.S. National Archives and Records Administration',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Lantern_Slide_of_Hester_Street,_New_York_City_-_NARA_-_3854683.jpg',
    },
    {
      // Used by the Old World column of the comparison (src/data/comparison.ts), not by the story card.
      id: 'lower-east-side-jedrzejow-market-1916',
      src: '/images/lower-east-side/lower-east-side-jedrzejow-market-1916.jpg',
      width: 1600,
      height: 1026,
      alt: 'Sepia photograph of a fair on a cobbled market square: a white-bearded Jewish man in a long coat and cap stands beside wooden racks hung with leather boots for sale, while men in long coats and women in headscarves crowd the stalls in front of plastered two- and three-story houses.',
      caption:
        'Market day (jarmark) on the market square of Jędrzejów, a small town in today’s Poland that had been under Russian rule before World War I, photographed in 1916. The archive title identifies the people as Jews of Jędrzejów; they crowd around stalls hung with boots.',
      date: '1916',
      creator: 'Unknown',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:J%C4%99drzej%C3%B3w._Rynek._Jarmark._%C5%BBydzi_j%C4%99drzejowscy_1916.jpg',
    },
  ],
}

export default content
