import type { ChapterContent } from '../../types'

/**
 * Chapter 06: Transforming American Culture (Tin Pan Alley and Hollywood).
 *
 * Documentary material (what Episode 4 says) lives only in `documentaryConnection`
 * and is checked against the PBS Wisconsin transcript (lines 64–96).
 * Everything else is additional historical context from the sources below.
 * Song lyrics are copyrighted: only titles appear here.
 */
const content: ChapterContent = {
  chapterText: {
    subtitle: 'Immigrants and their children write America’s songs and build its studios',
    dateRange: '1890s–1940',
    summary:
      'From a noisy block of music publishers in Manhattan to the film studios of Southern California, Jewish immigrants and their children helped create American popular culture. Irving Berlin, born in Russia, and the Gershwin brothers wrote songs the whole country sang. Mostly Jewish founders built Hollywood’s studio system. In 1939, Yip Harburg and Harold Arlen’s “Over the Rainbow” gave this episode its title.',
  },
  stories: [
    {
      placeId: 'tin-pan-alley',
      theme: 'Tin Pan Alley: immigrants and their children write America’s songs',
      period: '1890s to 1930s',
      whatHappened: [
        'Between 1893 and 1910, the block of West 28th Street between Broadway and Sixth Avenue became known as Tin Pan Alley. It held New York City’s most important cluster of sheet-music publishers, and the racket of their pianos made it sound “like a tin pan alley.” Publishers hired try-out pianists, called “song pluggers,” to play their new songs. Sheet music carried those songs into countless American homes. Jewish and African American songwriters and publishers found new chances here to break into mainstream American music.',
        'Irving Berlin was born Israel Baline in 1888, the son of a poor Jewish cantor in the Russian Empire, and came to New York as a small child in 1893. He started out as a street singer and saloon pianist and never learned to read musical notation. “Alexander’s Ragtime Band” (1911) made him famous. He wrote “God Bless America” in 1918, set it aside, and revised it in 1938. He said it expressed his gratitude for the opportunities America had given him. “White Christmas” later won him an Academy Award.',
        'George Gershwin was born in Brooklyn in 1898 to Rose and Morris Gershovitz, immigrants from Russia, who settled on the Lower East Side. At 15 he became a song plugger for a music publisher. His older brother Ira wrote the lyrics for many of his songs. As a teenager, Ira co-edited his high school paper with Yip Harburg. George’s Rhapsody in Blue premiered in New York on February 12, 1924, and his opera Porgy and Bess opened on Broadway in October 1935.',
      ],
      whyItMatters:
        'Tin Pan Alley turned songs into a national business, and immigrants and their children helped write its biggest hits. Berlin, an immigrant from Russia, wrote “God Bless America,” a song many Americans treat almost like a second national anthem. These songwriters showed that newcomers could do more than fit into American culture. They could shape it.',
      documentaryConnection:
        'Schama argues that the children of shtetl immigrants carried their parents’ ideals into American popular culture. He says a group of Jewish boys from the Lower East Side would “create the music that all America would sing.” He names Israel Baline, who became Irving Berlin, composer of “God Bless America”; the Gershowitz brothers, who became the Gershwins; and Isidore Hochberg, who became Yip Harburg. The episode mentions Tin Pan Alley only once, to describe Harburg’s partner Jay Gorney, and never names West 28th Street.',
      keyFacts: [
        { label: 'Tin Pan Alley on West 28th Street', value: '1893–1910', sourceId: 'nyc-lpc-tin-pan-alley' },
        { label: 'Berlin’s breakthrough hit', value: '“Alexander’s Ragtime Band,” 1911', sourceId: 'loc-nrr-white-christmas' },
        {
          label: 'Rhapsody in Blue premiere, Aeolian Hall, New York',
          value: 'Feb. 12, 1924',
          sourceId: 'loc-blog-rhapsody-in-blue-100',
        },
        {
          label: '“God Bless America” first heard nationally, on Kate Smith’s radio show',
          value: 'Nov. 11, 1938',
          sourceId: 'loc-nrr-god-bless-america',
        },
      ],
      imageIds: [
        'american-culture-irving-berlin-c1911',
        'american-culture-tin-pan-alley-1910',
        'american-culture-george-gershwin-bain',
      ],
      sourceIds: [
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
        'nyc-lpc-tin-pan-alley',
        'loc-nrr-white-christmas',
        'loc-nrr-god-bless-america',
        'loc-haven-to-home-conclusion',
        'pbs-broadway-george-gershwin',
        'loc-lcib-gershwin-legacy',
        'loc-blog-rhapsody-in-blue-100',
      ],
      needsVerification: [],
    },
    {
      placeId: 'hollywood',
      theme: 'Hollywood: immigrant founders build the movie studios',
      period: '1910s to 1940',
      whatHappened: [
        'Thomas Edison’s Motion Picture Patents Company, known as the Edison Trust, dominated early American filmmaking. Carl Laemmle, born to Jewish parents near Stuttgart, Germany, in 1867, came to America in 1884 and opened a movie theater in Chicago in 1906. He became an independent producer. The Trust sued him hundreds of times, and Laemmle fought back in federal court, arguing that it was an illegal monopoly. Universal, the company he founded with other producers, first made films in Fort Lee, New Jersey, then moved to California’s San Fernando Valley.',
        'In late 1913, Jesse Lasky, Samuel Goldfish (later Samuel Goldwyn) and Cecil B. DeMille started a film company in Hollywood. In a rented barn at Selma and Vine Streets, they made The Squaw Man, the first feature-length film made there. In 1916 their company joined Famous Players, founded by Hungarian-born Adolph Zukor, and the new firm took control of Paramount. Louis B. Mayer, born in Minsk (now in Belarus), grew up in Canada, bought a run-down Massachusetts theater in 1909, and later ran MGM.',
        'The Warner brothers, sons of Polish immigrants, ran a small Pennsylvania movie theater in 1906–07 and later made films in New York, then Hollywood. Their studio’s The Jazz Singer, starring Al Jolson, premiered on October 6, 1927. With only about two minutes of spoken dialogue, it became the first successful feature film with synchronized talking. By the end of 1929, silent films were finished. At MGM, Arthur Freed hired Arlen and Harburg for The Wizard of Oz (1939) and twice saved “Over the Rainbow” after studio bosses cut it.',
      ],
      whyItMatters:
        'Movie theaters spread to big cities and small towns. The Academy Museum in Los Angeles notes that Hollywood’s studio system was built mostly by Jewish founders and calls the film industry’s birth, at its heart, an immigrant story. Through their films, Jewish immigrants and their children helped shape how millions of Americans pictured their country and its dreams. Jewish cultural influence now reached far beyond New York’s immigrant neighborhoods.',
      documentaryConnection:
        'Schama says success took Harburg, the Gershwins and Berlin to Hollywood, the industry that left the deepest mark on American life. He says Jews ran the big 1930s studios, including Paramount, Warner Bros. and Louis B. Mayer’s MGM, and that they wanted the movies to be “a school for working-class America.” He says Mayer gave Harburg the Wizard of Oz job in 1938, and he closes with “Over the Rainbow” winning the Oscar in 1940. The episode does not mention Laemmle, Zukor or The Jazz Singer.',
      keyFacts: [
        { label: 'First feature made in Hollywood', value: 'The Squaw Man, released February 1914', sourceId: 'afi-catalog-squaw-man' },
        { label: 'Universal’s founder arrives in America', value: 'Carl Laemmle, 1884', sourceId: 'nara-carl-laemmle' },
        { label: 'The Jazz Singer premiere', value: 'October 6, 1927', sourceId: 'loc-nfr-jazz-singer' },
        { label: '“Over the Rainbow”', value: 'Oscar for Best Song, 1940', sourceId: 'pbs-jews-arts-10-innovators' },
      ],
      imageIds: ['american-culture-universal-city-1915', 'american-culture-jazz-singer-poster-1927'],
      sourceIds: [
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
        'nara-carl-laemmle',
        'afi-catalog-squaw-man',
        'ca-ohp-demille-studio-barn',
        'hfa-100-years-paramount',
        'herrick-zukor-correspondence',
        'gbh-louis-b-mayer-massachusetts',
        'explorepa-warner-first-theater',
        'academy-museum-hollywoodland',
        'loc-nfr-jazz-singer',
        'loc-nrr-over-the-rainbow',
        'pbs-jews-arts-10-innovators',
      ],
      needsVerification: [
        'Who hired Harburg for The Wizard of Oz? The episode and the PBS companion page say Louis B. Mayer gave him the job in 1938. A Library of Congress National Recording Registry essay says Arthur Freed was the man at MGM who made the decision. Mayer ran the studio, so both accounts may be partly right.',
      ],
    },
  ],
  sources: [
    {
      id: 'nyc-lpc-tin-pan-alley',
      title: 'LPC Designates Five Historic Buildings Associated with Tin Pan Alley',
      publisher: 'New York City Landmarks Preservation Commission (press release, December 10, 2019)',
      url: 'https://www.nyc.gov/site/lpc/about/pr2019/lpc-designates-five-historic-buildings-associated-with-tin-pan-alley.page',
      kind: 'institutional',
      usedFor:
        'Tin Pan Alley’s location and years (West 28th Street, 1893–1910), the origin of the name, sheet music, and the role of Jewish and African American songwriters and publishers.',
    },
    {
      id: 'loc-nrr-white-christmas',
      title: '“White Christmas”—Bing Crosby (1942)',
      publisher: 'Laurence Bergreen, National Recording Registry essay, Library of Congress',
      url: 'https://www.loc.gov/static/programs/national-recording-preservation-board/documents/White-Christmas.pdf',
      kind: 'institutional',
      usedFor:
        'Irving Berlin’s birth name, his father the cantor, his start as a street singer, “Alexander’s Ragtime Band” (1911), his lack of musical notation, and the Academy Award for “White Christmas.”',
    },
    {
      id: 'loc-nrr-god-bless-america',
      title: '“God Bless America”—Kate Smith (Radio broadcast premiere) (November 11, 1938)',
      publisher: 'Cary O’Dell, National Recording Registry essay, Library of Congress',
      url: 'https://www.loc.gov/static/programs/national-recording-preservation-board/documents/GodBlessAmerica.pdf',
      kind: 'institutional',
      usedFor: 'The 1918 origin of “God Bless America,” its 1938 radio premiere, and its place as an unofficial national anthem.',
    },
    {
      id: 'loc-haven-to-home-conclusion',
      title: 'Conclusion – From Haven to Home: 350 Years of Jewish Life in America',
      publisher: 'Library of Congress (exhibition)',
      url: 'https://www.loc.gov/exhibits/haventohome/haven-conclusion.html',
      kind: 'institutional',
      usedFor:
        'Irving Berlin’s birth year (1888), his 1893 arrival, his 1918 composition and 1938 revision of “God Bless America,” and his explanation that it expressed gratitude for America’s opportunities.',
    },
    {
      id: 'pbs-broadway-george-gershwin',
      title: 'George Gershwin | The Stars | Broadway: The American Musical',
      publisher: 'PBS',
      url: 'https://www.pbs.org/wnet/broadway/stars/george-gershwin/',
      kind: 'institutional',
      usedFor:
        'George Gershwin’s birth in Brooklyn in 1898, his parents as immigrants from Russia, the family name change, and his start as a song plugger at 15.',
    },
    {
      id: 'loc-lcib-gershwin-legacy',
      title: 'The Gershwin Legacy: Library Celebrates Contributions of George and Ira',
      publisher: 'Raymond A. White, Library of Congress Information Bulletin (September 1998)',
      url: 'https://www.loc.gov/loc/lcib/9809/gershwin.html',
      kind: 'institutional',
      usedFor:
        'Ira Gershwin (born 1896) co-editing the Townsend Harris Hall high school paper with Yip Harburg, and the October 10, 1935, Broadway opening of Porgy and Bess.',
    },
    {
      id: 'loc-blog-rhapsody-in-blue-100',
      title: '“Rhapsody in Blue” at 100',
      publisher: 'Raymond A. White (guest post), In the Muse: Performing Arts Blog, Library of Congress (February 9, 2024)',
      url: 'https://blogs.loc.gov/music/2024/02/rhapsody-in-blue-at-100/',
      kind: 'institutional',
      usedFor: 'The premiere of Rhapsody in Blue at Aeolian Hall, New York, on February 12, 1924.',
    },
    {
      id: 'nara-carl-laemmle',
      title: 'Carl Laemmle: Founder of Universal Studios and Humanitarian',
      publisher: 'Jim Zeender, Pieces of History blog, U.S. National Archives (January 5, 2017)',
      url: 'https://prologue.blogs.archives.gov/2017/01/05/carl-laemmle-founder-of-universal-studios-and-humanitarian/',
      kind: 'institutional',
      usedFor:
        'Carl Laemmle’s birth to Jewish parents near Stuttgart (1867), his 1884 immigration, his 1906 Chicago theater, his court fight with the Edison Trust, and Universal’s move from Fort Lee, New Jersey, to the San Fernando Valley.',
    },
    {
      id: 'afi-catalog-squaw-man',
      title: 'The Squaw Man (1914)',
      publisher: 'AFI Catalog of Feature Films, American Film Institute',
      url: 'https://catalog.afi.com/Catalog/moviedetails/2124',
      kind: 'encyclopedia',
      usedFor:
        'The founding of the Jesse L. Lasky Feature Play Co. in Hollywood in late 1913 by Lasky, Samuel Goldfish (Goldwyn) and DeMille, and The Squaw Man as the first Hollywood-made feature.',
    },
    {
      id: 'ca-ohp-demille-studio-barn',
      title: 'Cecil B. DeMille Studio Barn (California Historical Landmark No. 554)',
      publisher: 'California Office of Historic Preservation, California State Parks',
      url: 'https://ohp.parks.ca.gov/ListedResources/Detail/554',
      kind: 'institutional',
      usedFor: 'The barn at Selma and Vine Streets where The Squaw Man, the first feature-length film made in Hollywood, was made.',
    },
    {
      id: 'gbh-louis-b-mayer-massachusetts',
      title: 'How Massachusetts Helped Launch The Golden Age Of Hollywood',
      publisher: 'GBH News (January 2, 2015)',
      url: 'https://www.wgbh.org/news/local/2015-01-02/how-massachusetts-helped-launch-the-golden-age-of-hollywood',
      kind: 'institutional',
      usedFor:
        'Louis B. Mayer’s birth in Minsk, childhood in Canada, 1909 purchase of a run-down theater in Haverhill, Massachusetts, and his move to Hollywood to run MGM.',
    },
    {
      id: 'academy-museum-hollywoodland',
      title: 'Hollywoodland: Jewish Founders and the Making of a Movie Capital',
      publisher: 'Academy Museum of Motion Pictures, Los Angeles',
      url: 'https://www.academymuseum.org/exhibitions/hollywoodland',
      kind: 'institutional',
      usedFor:
        'The predominantly Jewish founders of the Hollywood studio system and the museum’s view of the film industry’s birth as an immigrant story.',
    },
    {
      id: 'hfa-100-years-paramount',
      title: '100 Years of Paramount Pictures',
      publisher: 'Harvard Film Archive, Harvard University',
      url: 'https://harvardfilmarchive.org/programs/100-years-of-paramount-pictures',
      kind: 'institutional',
      usedFor:
        'Hungarian-born Adolph Zukor (1873–1976), his start in penny arcades and nickelodeons, Famous Players (1912), the 1916 union with Jesse Lasky and Paramount, and The Squaw Man’s role in moving the film industry to Hollywood.',
    },
    {
      id: 'herrick-zukor-correspondence',
      title: 'Adolph Zukor correspondence, 1912–1977 (finding aid)',
      publisher: 'Margaret Herrick Library, Academy of Motion Picture Arts and Sciences, via Online Archive of California',
      url: 'https://oac.cdlib.org/findaid/ark:/13030/c86974xw/',
      kind: 'archive',
      usedFor:
        'Zukor as a Hungarian-born immigrant, the 1916 merger of Famous Players with the Jesse L. Lasky Feature Play Company, and the new firm’s controlling interest in Paramount.',
    },
    {
      id: 'explorepa-warner-first-theater',
      title: 'Warner Brothers’ First Theater Historical Marker',
      publisher: 'ExplorePAhistory.com (WITF and the Pennsylvania Historical and Museum Commission)',
      url: 'https://explorepahistory.com/hmarker.php?markerId=1-A-261',
      kind: 'institutional',
      usedFor:
        'The Warner brothers as sons of Polish immigrants, their 1906–07 theater in New Castle, Pennsylvania, their later film production in New York and then Hollywood, and the spread of cheap movie theaters to cities and small towns.',
    },
    {
      id: 'loc-nfr-jazz-singer',
      title: 'The Jazz Singer',
      publisher: 'Ron Hutchinson, National Film Registry essay, Library of Congress',
      url: 'https://www.loc.gov/static/programs/national-film-preservation-board/documents/jazz_singer.pdf',
      kind: 'institutional',
      usedFor:
        'The Jazz Singer’s premiere on October 6, 1927, its two minutes of dialogue, its place as the first successful synchronized feature with talking, and the end of silent films by 1929.',
    },
    {
      id: 'loc-nrr-over-the-rainbow',
      title: '“Over the Rainbow”—Judy Garland (1939)',
      publisher: 'Walter Rimler, National Recording Registry essay, Library of Congress',
      url: 'https://www.loc.gov/static/programs/national-recording-preservation-board/documents/OverTheRainbow.pdf',
      kind: 'institutional',
      usedFor:
        'Arthur Freed hiring Arlen and Harburg at MGM for The Wizard of Oz, and the studio twice cutting “Over the Rainbow” before Freed saved it.',
    },
  ],
  images: [
    {
      id: 'american-culture-irving-berlin-c1911',
      src: '/images/american-culture/american-culture-irving-berlin-c1911.jpg',
      width: 1400,
      height: 1151,
      alt: 'Black-and-white studio photograph, mounted on a card with paper photo corners, of a slim young man with slicked dark hair in a three-piece suit, seated on a padded stool beside an open grand piano in a parlor with a fireplace, a mantel clock and framed pictures.',
      caption:
        'Irving Berlin at the piano, c. 1911. Photograph by the Pach Brothers studio, New York. Born Israel Baline in the Russian Empire, Berlin had his first huge hit, “Alexander’s Ragtime Band,” in 1911.',
      date: 'c. 1911',
      creator: 'Pach Brothers',
      institution: 'National Portrait Gallery, Smithsonian Institution',
      license: 'CC0',
      licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Irving_Berlin_by_Pach_Brothers_Studio,_c._1911,_gelatin_silver_print,_from_the_National_Portrait_Gallery_-_NPG-NPG_93_388_4.jpg',
    },
    {
      id: 'american-culture-tin-pan-alley-1910',
      src: '/images/american-culture/american-culture-tin-pan-alley-1910.jpg',
      width: 381,
      height: 450,
      alt: 'Black-and-white photograph of a row of narrow brick buildings on a city street. Large painted signs across the facades read “Jerome H. Remick & Company,” “Whitney Warner Music,” “Music Publishers” and “William Morris”; stoops with iron railings lead up from the sidewalk.',
      caption:
        'Music publishers’ offices on West 28th Street, Manhattan, the block nicknamed Tin Pan Alley, c. 1910. Song publishers crowded into these row houses, where pianists called “song pluggers” tried out new tunes.',
      date: 'c. 1910',
      creator: 'Unknown',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tinpanalley.jpg',
    },
    {
      id: 'american-culture-george-gershwin-bain',
      src: '/images/american-culture/american-culture-george-gershwin-bain.jpg',
      width: 960,
      height: 1274,
      alt: 'Black-and-white half-length photograph of George Gershwin, a dark-haired man in a dark three-piece suit, patterned tie and pocket square, standing with one hand in his pocket against a pale wall and looking off to the left.',
      caption:
        'George Gershwin, undated photograph, probably 1920s or early 1930s. Bain News Service. The son of immigrants from Russia, Gershwin wrote Rhapsody in Blue (1924) and the opera Porgy and Bess (1935).',
      date: 'Undated (probably 1920s or early 1930s)',
      creator: 'Bain News Service (unnamed photographer)',
      institution: 'Library of Congress',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:GershwinStandingFacingLeftBain.jpg',
    },
    {
      id: 'american-culture-universal-city-1915',
      src: '/images/american-culture/american-culture-universal-city-1915.jpg',
      width: 1600,
      height: 901,
      alt: 'Black-and-white photograph of a long, low white studio building with striped awnings and Spanish Mission-style curved gables, beside a square tower with small turrets, on an unpaved road lined with telephone poles; a man in a dark suit walks past an early open automobile.',
      caption:
        'Studio buildings identified as Universal City, in the San Fernando Valley near Hollywood, 1915. Photograph from a traveler’s album. Carl Laemmle’s Universal company moved its filmmaking here from Fort Lee, New Jersey.',
      date: '1915',
      creator: 'Unknown',
      institution: 'Mississippi Department of Archives and History',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Main_entrance_to_Universal_City_studio_lot_photographed_1915.jpg',
    },
    {
      id: 'american-culture-jazz-singer-poster-1927',
      src: '/images/american-culture/american-culture-jazz-singer-poster-1927.jpg',
      width: 873,
      height: 1326,
      alt: 'Color film poster on a green background. Large red letters read “Al Jolson,” with “The Jazz Singer” in white below. A smiling young man in a brown suit plays an upright piano while turning toward an older gray-haired woman seated beside him. Smaller text lists May McAvoy, Warner Oland and Cantor Rosenblatt, and “A Warner Bros. Production.”',
      caption:
        'Poster for The Jazz Singer (Warner Bros., 1927), starring Al Jolson. It premiered on October 6, 1927, and became the first successful feature film with synchronized talking, though it had only about two minutes of dialogue.',
      date: '1927',
      creator: 'Unknown (Warner Bros., original rights holder)',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Jazz_Singer_1927_Poster.jpg',
    },
  ],
}

export default content
