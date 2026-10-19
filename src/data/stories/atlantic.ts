import type { ChapterContent } from '../../types'

const content: ChapterContent = {
  chapterText: {
    subtitle: 'Millions leave Eastern Europe for America’s “golden land”',
    dateRange: '1881–1924',
    summary:
      'Between 1881 and 1924, more than two million Jews left Eastern Europe for the United States. Pogroms, harsh laws and deep poverty pushed them out; the hope of work and letters from relatives already in America drew them across the ocean. Many crossed Germany to ports such as Hamburg and Bremerhaven, then sailed by steamship to New York Harbor. The lines on the map are general corridors, not one family’s journey.',
  },
  stories: [
    {
      placeId: 'new-york-harbor',
      theme: 'Mass migration to America and arrival through Ellis Island',
      period: '1881–1924',
      whatHappened: [
        'In the 1880s, life for Jews in the Russian Empire grew harder. After Tsar Alexander II was assassinated in 1881, waves of anti-Jewish riots, called pogroms, swept the empire’s southwestern provinces in 1881 and 1882. In 1882 the government issued the May Laws, which barred Jews from newly settling in villages outside towns and cities. A fast-growing population made poverty worse. A second wave of pogroms followed from 1903 to 1906, beginning with Kishinev (today Chișinău, Moldova) in 1903, where almost 50 Jews were killed.',
        'Fear was not the only reason to leave. Historians point out that poverty at home and the hope of work in America also drove people to go, and that young adults and children made up most of the travelers. According to YIVO, more than 2 million Jews moved from Eastern Europe to America between 1881 and 1914, about 1.6 million of them from the Russian Empire. Many crossed Germany, a major transit country for Eastern European emigrants, and sailed from Hamburg or Bremerhaven.',
        'For many, the journey ended in New York Harbor. Until 1890, arrivals were processed at Castle Garden in Manhattan; from 1892 to 1924, Ellis Island was America’s largest immigration station, processing over 12 million people. Letters from relatives in America drew others to follow, a pattern called chain migration. Immigrants from the same town formed landsmanshaftn, hometown societies whose dues helped pay for members’ medical care, money troubles and burial. The great wave ended when Congress passed quota laws in 1921 and 1924.',
      ],
      whyItMatters:
        'This migration moved the center of the Jewish world. In the 1800s and early 1900s, one-third of Europe’s Jews emigrated to the United States, making it home to the largest Jewish community outside the Land of Israel. The newcomers settled in cities, spoke Yiddish and built strong networks of religious, cultural and mutual-aid groups. Those networks shaped the Lower East Side and the American culture explored in the next chapters.',
      documentaryConnection:
        'Episode 4 does not mention Ellis Island or steamships, and it names Hamburg only as a place where timber was shipped, not as an emigration port; the map’s routes are added context. Schama says 2 million Eastern European Jews “sought a different way out.” He asks, “Why wait for Zion when there was another promised land lying across the ocean--America?” He describes letters from relatives that “told fables of a land of miracles,” and contrasts the newcomers with Central European Jews of the 1850s, whose success Temple Emanu-El displays. Most new arrivals, he says, ended up “just streets away from the boat.”',
      keyFacts: [
        {
          label: 'Eastern European Jews to America, 1881–1914',
          value: 'More than 2 million',
          sourceId: 'yivo-america-lederhendler',
        },
        {
          label: 'East European Jewish immigrants, 1881–1924',
          value: 'Over 2.5 million',
          sourceId: 'loc-haven-to-home-century-of-immigration',
        },
        {
          label: 'Immigrants processed at Ellis Island, 1892–1924',
          value: 'Over 12 million',
          sourceId: 'nps-ellis-island-history-culture',
        },
        {
          label: 'Landsmanshaftn counted in New York City (1938 survey)',
          value: '2,468',
          sourceId: 'cjh-landsmanshaftn-guide',
        },
      ],
      imageIds: [
        'atlantic-ellis-island-landing-station-1905',
        'atlantic-young-russian-jewish-woman-ellis-island',
        'atlantic-physicians-examining-jewish-immigrants',
        'atlantic-hamburg-emigrant-halls-1909',
      ],
      sourceIds: [
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
        'yivo-america-lederhendler',
        'yivo-population-and-migration-before-wwi',
        'yivo-pogroms',
        'yivo-russian-empire',
        'loc-haven-to-home-century-of-immigration',
        'nps-ellis-island-history-culture',
        'nps-ellis-island-chronology',
        'nps-castle-clinton-history',
        'state-dept-immigration-act-1924',
        'cjh-landsmanshaftn-guide',
        'hamburg-geschichtsbuch-emigration-port',
        'bremerhaven-museum-emigrants-database',
      ],
      needsVerification: [],
    },
  ],
  sources: [
    {
      id: 'yivo-america-lederhendler',
      title: 'America',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Eli Lederhendler)',
      url: 'https://encyclopedia.yivo.org/article/2281',
      kind: 'encyclopedia',
      usedFor:
        'Migration figures for 1881–1914, reasons for leaving, letters home, the 1903–1906 peak, the 1921/1924 quota laws and the one-third-of-Europe’s-Jews estimate.',
    },
    {
      id: 'loc-haven-to-home-century-of-immigration',
      title: 'A Century of Immigration, 1820–1924 — From Haven to Home: 350 Years of Jewish Life in America',
      publisher: 'Library of Congress',
      url: 'https://www.loc.gov/exhibits/haventohome/haven-century.html',
      kind: 'institutional',
      usedFor:
        'The figure of over 2.5 million East European Jewish immigrants, 1881–1924, the “Golden Land” idea and immigrant community networks.',
    },
    {
      id: 'nps-ellis-island-history-culture',
      title: 'History & Culture — Ellis Island',
      publisher: 'National Park Service, Statue of Liberty National Monument',
      url: 'https://www.nps.gov/elis/learn/historyculture/index.htm',
      kind: 'institutional',
      usedFor: 'Ellis Island’s years of operation (1892–1924) and the 12 million immigrants processed there.',
    },
    {
      id: 'nps-ellis-island-chronology',
      title: 'Ellis Island Chronology',
      publisher: 'National Park Service, Statue of Liberty National Monument',
      url: 'https://www.nps.gov/elis/learn/historyculture/ellis-island-chronology.htm',
      kind: 'institutional',
      usedFor: 'Opening in 1892, the 1897 fire, the main building of December 1900 and the 1924 visa rule.',
    },
    {
      id: 'nps-castle-clinton-history',
      title: 'History & Culture — Castle Clinton',
      publisher: 'National Park Service, Castle Clinton National Monument',
      url: 'https://www.nps.gov/cacl/learn/historyculture/index.htm',
      kind: 'institutional',
      usedFor: 'Castle Garden as New York’s immigrant landing depot from 1855 until it closed in April 1890.',
    },
    {
      id: 'state-dept-immigration-act-1924',
      title: 'The Immigration Act of 1924 (The Johnson-Reed Act)',
      publisher: 'Office of the Historian, U.S. Department of State',
      url: 'https://history.state.gov/milestones/1921-1936/immigration-act',
      kind: 'institutional',
      usedFor: 'How the 1921 and 1924 quota laws limited immigration from Southern and Eastern Europe.',
    },
    {
      id: 'cjh-landsmanshaftn-guide',
      title: 'Genealogy Guide: Landsmanshaftn Records — Introduction',
      publisher: 'Center for Jewish History',
      url: 'https://libguides.cjh.org/genealogyguides/landsmanshaftn',
      kind: 'institutional',
      usedFor: 'What landsmanshaftn were, how dues funded aid and burial, and the 1938 count of 2,468 in New York City.',
    },
    {
      id: 'hamburg-geschichtsbuch-emigration-port',
      title: 'Auswanderung über den Hamburger Hafen (Emigration through the Port of Hamburg)',
      publisher: 'Geschichtsbuch Hamburg, hamburg.de (Inge Bahnsen)',
      url: 'https://geschichtsbuch.hamburg.de/epochen/kaiserreich/auswanderung-ueber-den-hamburger-hafen/',
      kind: 'institutional',
      usedFor:
        'Germany as a transit country for Eastern European emigrants; Bremen/Bremerhaven and Hamburg as ports; the HAPAG emigrant halls; emigrants’ letters leading to chain migration.',
    },
    {
      id: 'bremerhaven-museum-emigrants-database',
      title: 'The German Emigrants Database — Information',
      publisher: 'Historisches Museum Bremerhaven (Deutsche Auswanderer-Datenbank)',
      url: 'https://www.deutsche-auswanderer-datenbank.de/informationen-dad-engl',
      kind: 'institutional',
      usedFor: 'Bremerhaven as continental Europe’s largest emigration port, with over 7.2 million departures.',
    },
  ],
  images: [
    {
      id: 'atlantic-ellis-island-landing-station-1905',
      src: '/images/atlantic/atlantic-ellis-island-landing-station-1905.jpg',
      width: 1536,
      height: 1221,
      alt: 'Black-and-white photograph of the Ellis Island main building seen across choppy harbor water: a large brick-and-limestone hall with four domed towers, ferry boats moored at its piers in front.',
      caption:
        '“Immigrant Landing Station, N.Y.,” 1905 (original title). The Ellis Island main building seen from New York Harbor. It opened in December 1900, after an 1897 fire destroyed the first, wooden station of 1892.',
      date: '1905',
      creator: 'A. Loeffler, Tompkinsville, N.Y. (copyright inscription on the print)',
      institution: 'Library of Congress',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Immigrant_Landing_Station,_N.Y._LCCN97502077.jpg',
    },
    {
      id: 'atlantic-young-russian-jewish-woman-ellis-island',
      src: '/images/atlantic/atlantic-young-russian-jewish-woman-ellis-island.jpg',
      width: 1024,
      height: 1536,
      alt: 'Black-and-white portrait of a young woman in a headscarf and dark jacket looking directly at the camera, with the railings and arched windows of a large hall blurred behind her.',
      caption:
        '“Young Russian Jewess at Ellis Island” (original title), dated 1905 in the catalog record. A young Jewish woman from Russia, photographed by Lewis Wickes Hine, who made portraits of newly arrived immigrants at Ellis Island. Her name was not recorded.',
      date: '1905',
      creator: 'Lewis Wickes Hine (1874–1940)',
      institution:
        'New York Public Library (digital copy contributed via University of Colorado Boulder Libraries / Digital Public Library of America)',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Young_Russian_Jewess_at_Ellis_Island_-_DPLA_-_9ad370ff26f373c5ea80db0568392413.jpg',
    },
    {
      id: 'atlantic-physicians-examining-jewish-immigrants',
      src: '/images/atlantic/atlantic-physicians-examining-jewish-immigrants.jpg',
      width: 1285,
      height: 1536,
      alt: 'Black-and-white photograph of uniformed U.S. doctors examining newly arrived men, stripped to the waist, in a crowded inspection room; one doctor listens with a stethoscope while a bearded man in a dark coat waits beside an eye chart printed in Hebrew letters.',
      caption:
        '“Physicians examining a group of Jewish immigrants,” 1907 (original title). U.S. medical officers check new arrivals beside an eye chart printed in Hebrew letters. The catalog record does not name the place; Wikimedia Commons files it with Ellis Island photographs from 1907.',
      date: '1907',
      creator: 'Underwood & Underwood (copyright claimant)',
      institution: 'Library of Congress',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Physicians_examining_a_group_of_Jewish_immigrants_LCCN2012646350.jpg',
    },
    {
      id: 'atlantic-hamburg-emigrant-halls-1909',
      src: '/images/atlantic/atlantic-hamburg-emigrant-halls-1909.jpg',
      width: 1200,
      height: 855,
      alt: 'Black-and-white photograph of a vast timber-roofed dining hall packed with hundreds of emigrants, many women in headscarves, men and children, seated at long tables with plates in front of them.',
      caption:
        'Midday meal in the HAPAG emigrant halls (Auswandererhallen) in Hamburg, 1909. The complex had its own rail connection, a dining hall, a synagogue and a church for emigrants waiting to sail. The record does not identify the people shown.',
      date: '1909',
      creator: 'Johann Hinrich W. Hamann (1859–1935)',
      license: 'Public domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Auswandererhallen_der_HAPAG_1909.jpg',
    },
  ],
}

export default content
