import type { ChapterContent } from '../../types'

const content: ChapterContent = {
  chapterText: {
    subtitle: 'Where the Russian Empire allowed its Jews to live',
    dateRange: '1772–1917',
    summary:
      'Between 1772 and 1795, Russia, Prussia and Austria split up Poland–Lithuania, and Russia ended up with a huge Jewish population that soon became the largest in the world. Starting in 1791, Russia only let Jews live permanently in its western provinces. This area was called the Pale of Settlement, and it stretched from the Baltic Sea to the Black Sea. Jewish towns inside the Pale became crowded and poor, and after 1881 new laws and violence made life even harder. The Pale lasted until it was abolished in 1917.',
  },

  stories: [
    {
      placeId: 'pale-of-settlement',
      theme: 'The Pale of Settlement: where Jews were allowed to live',
      period: '1791 to 1917',
      whatHappened: [
        'Between 1772 and 1795, Russia, Prussia and Austria divided up the Polish–Lithuanian Commonwealth in three partitions. With the land it took, Russia now had the largest Jewish population in the world. In 1790, merchants in Moscow complained about Jewish competitors from Belarus, and Catherine the Great’s government sent the Jewish traders away. In 1791 it decided that Jews could live in the lands taken from Poland and in the new lands along the Black Sea, but not in the Russian interior. Laws in 1804 and 1835 made these provinces official as the Pale.',
        'The Pale was huge, more than twice the size of France. It ran from the Lithuanian and Belarusian provinces down through Ukraine to Bessarabia and Crimea. There were still limits inside it. In the first half of the 1800s, Jews were banned from Kiev, Nikolaev and Sevastopol. Russian Poland, the kingdom around Warsaw, had its own rules and was not officially part of the Pale. The Jewish population grew about five times larger during the 1800s, so too many people were competing in small trade and crafts like tailoring, and poverty spread.',
        'In 1827, Tsar Nicholas I made Jews serve in the army in person. Jewish communities had to supply recruits aged 12 to 25, while everyone else supplied men aged 18 to 35. Service lasted 25 years, and boys were sent to military schools first. After Tsar Alexander II was assassinated in 1881, pogroms spread across the southwestern provinces in 1881–82. Most of the damage was to Jewish property. Then the May Laws of 1882 banned Jews from newly settling in villages. During World War I, expulsions broke the Pale down, and the Provisional Government officially abolished it in 1917.',
      ],
      whyItMatters:
        'For over a hundred years, the Pale controlled where most Jews in the Russian Empire were allowed to live. Inside it, a crowded, Yiddish-speaking world grew up, with small towns, religious schools, Hasidic courts and new political movements. Historians disagree about how much the Pale itself caused the poverty there. Either way, poverty, restrictions and the shock of the 1881–82 pogroms led to a huge wave of emigration. Between 1881 and 1914, about 2 million Jews left the Russian Empire, most of them for America, and some historians put the number as high as 3 million.',
      documentaryConnection:
        'Episode 4 doesn’t give any dates for the Pale. Schama explains that when the Polish–Lithuanian kingdom was carved up at the end of the 18th century, most Jews ended up under Russian rule. Russian merchants saw them as competition, so Russia expelled Jews from the major cities and confined them to the Pale, “stretching from the Baltic to the Black Sea.” He mentions that Jews were banned from certain cities, professions and universities and from owning land, and that boys as young as 12 were drafted into the army for up to 25 years. The May Laws are not mentioned.',
      keyFacts: [
        {
          label: 'Partitions of Poland–Lithuania',
          value: '1772, 1793 and 1795',
          sourceId: 'yivo-russian-empire',
        },
        {
          label: 'Residence limits first decided, under Catherine the Great',
          value: '1791',
          sourceId: 'ej-pale-of-settlement',
        },
        {
          label: 'Provinces fixed by law',
          value: 'Statutes of 1804 and 1835',
          sourceId: 'yivo-pale-of-settlement',
        },
        {
          label: 'Jews in the Russian Empire, 1897 census (incl. Russian Poland; just over 4% of the population)',
          value: '5,198,401',
          sourceId: 'yivo-russian-empire',
        },
        {
          label: 'Jews of European Russia living legally outside the Pale, before World War I',
          value: 'About 6%',
          sourceId: 'yivo-population-and-migration-before-wwi',
        },
        {
          label: 'Formally abolished by the Provisional Government, 20 March (2 April)',
          value: '1917',
          sourceId: 'yivo-pale-of-settlement',
        },
      ],
      imageIds: [
        'pale-map-1884-jewish-population',
        'pale-olyka-street-1912',
        'pale-mogilev-shulhoyf-1913',
        'pale-kiev-1881-engraving',
        'pale-map-jewish-encyclopedia-1905',
      ],
      sourceIds: [
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
        'yivo-pale-of-settlement',
        'ej-pale-of-settlement',
        'yivo-russian-empire',
        'yivo-military-service-in-russia',
        'yivo-pogroms',
        'yivo-population-and-migration-before-wwi',
      ],
      needsVerification: [
        'Emigration totals are different in different YIVO articles. Mark Kupovetsky says about 2 million Jews left the Russian Empire in 1881–1914, Michael Stanislawski says about 3 million for the same years, and Eli Lederhendler counts about 1.6 million Jews from the Russian Empire (including Poland) arriving in the United States in 1881–1914 (see Chapter 4).',
        'The May Laws: YIVO dates them to 1882, which is what this card uses, but the Encyclopaedia Judaica calls them the “Temporary (May) Laws” of 1881.',
        'When World War I actually ended the Pale: the Encyclopaedia Judaica says August 1915, when refugees were allowed into towns in the interior, but YIVO’s Russian Empire article says summer 1916. That is why the card just says “World War I.”',
      ],
    },
  ],

  sources: [
    {
      id: 'ej-pale-of-settlement',
      title: 'Modern Jewish History: The Pale of Settlement',
      publisher: 'Encyclopaedia Judaica (2007), reproduced by the Jewish Virtual Library',
      url: 'https://jewishvirtuallibrary.org/the-pale-of-settlement',
      kind: 'encyclopedia',
      usedFor:
        'The 1791 decision under Catherine the Great, the Pale’s reach from the Baltic to the Black Sea, and Jewish life inside it: towns, Yiddish, religious schools, Hasidic courts and new political movements.',
    },
    {
      id: 'yivo-military-service-in-russia',
      title: 'Military Service in Russia',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Yohanan Petrovsky-Shtern)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Military_Service_in_Russia',
      kind: 'encyclopedia',
      usedFor:
        'The 1827 conscription statute of Nicholas I, Jewish recruit ages of 12 to 25 (others 18 to 35), 25 years of service, and the cantonist schools for boys.',
    },
  ],

  images: [
    {
      id: 'pale-map-1884-jewish-population',
      src: '/images/pale/pale-map-1884-jewish-population.jpg',
      width: 1262,
      height: 1400,
      alt: 'A colored Russian map of the western and south-western provinces of the Russian Empire, from the Baltic coast down to the Black Sea and Crimea. A large region along the western border is shaded in reds and pinks, darker where Jews made up a larger share of the population; provinces to the east, around Kaluga, Orel, Kursk and Tambov, are left uncolored. A legend at lower left gives percentage bands from 1% or less up to over 35%.',
      caption:
        'Map of the south-western provinces of European Russia showing the percentage of Jewish population by district within the Pale of Jewish Settlement, compiled by V. Alenitsyn, editor of the Central Statistical Committee of the Russian Empire. The provinces of Russian Poland at the left edge are left unshaded. Historical map, c. 1884.',
      date: '1884 (date as given on the Commons record)',
      creator: 'Central Statistical Committee of the Russian Empire (compiled by V. Alenitsyn)',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pale-of-settlement-1884.jpg',
    },
    {
      id: 'pale-olyka-street-1912',
      src: '/images/pale/pale-olyka-street-1912.jpg',
      width: 1031,
      height: 728,
      alt: 'A black-and-white photograph of an unpaved, muddy street in a small town. Low plastered houses with steep wooden-shingle roofs line the right side; a crowd of men in caps and long coats stands with horse-drawn carts in the middle distance. In the foreground a woman in a headscarf holds a small child beside another child, and a man and a boy stand watching the camera.',
      caption:
        'A street in Olyka, Dubno district, Volhynia Province (today in Ukraine), a small town inside the Pale of Settlement. Historical photograph by Solomon Yudovin, 1912.',
      date: '1912',
      creator: 'Solomon Yudovin',
      institution: 'Russian Museum of Ethnography, St Petersburg',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Street_in_Olyka.jpg',
    },
    {
      id: 'pale-mogilev-shulhoyf-1913',
      src: '/images/pale/pale-mogilev-shulhoyf-1913.jpg',
      width: 1514,
      height: 1032,
      alt: 'A sepia photograph of an open, unpaved square in a town. On the left stands a large dark wooden building with a very steep metal roof and arched windows, behind a tall plank fence; a row of children and a few adults stand in front of the fence. On the right is a plastered two-story building, and a church-like tower with a dome rises behind it.',
      caption:
        'The Školišča (synagogue courtyard) quarter of Mogilev (Mahilioŭ), Mogilev Province, in today’s Belarus; the Commons record names the Cold Synagogue here. Historical photograph by Solomon Yudovin, 1913.',
      date: '1913',
      creator: 'Solomon Yudovin',
      institution: 'Russian Museum of Ethnography, St Petersburg (REM 4997-28/2)',
      license: 'Public domain',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Mahilo%C5%AD,_%C5%A0koli%C5%A1%C4%8Da._%D0%9C%D0%B0%D0%B3%D1%96%D0%BB%D1%91%D1%9E,_%D0%A8%D0%BA%D0%BE%D0%BB%D1%96%D1%88%D1%87%D0%B0_(S._Judovin,_1913).jpg',
    },
    {
      id: 'pale-kiev-1881-engraving',
      src: '/images/pale/pale-kiev-1881-engraving.jpg',
      width: 1400,
      height: 889,
      alt: 'A detailed black-and-white engraving of a crowded open square in front of a walled church with several domes. Jewish men in long coats and women in headscarves sit or stand among bundles, baskets and bedding; some hold their heads in their hands, one person lies on the ground covered by a cloth, and a group of bearded men talk with townsmen in top hats. Soldiers with rifles stand on a rooftop in the background.',
      caption:
        '“Kiev (Russia): the expulsion of the Slavic Jews; Jewish families abandoning their homes” (Spanish title, translated). Engraving by Tomás Carlos Capuz in the Spanish magazine La Ilustración Española y Americana, 22 June 1881, about six weeks after the Kiev pogrom of spring 1881. A foreign magazine’s interpretation, not an eyewitness record. Jews needed special permission to live in the city of Kiev itself.',
      date: 'Published 22 June 1881',
      creator: 'Tomás Carlos Capuz (engraver)',
      institution: 'La Ilustración Española y Americana (publisher), vol. XXV, no. 23, p. 408',
      license: 'Public domain',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:1881-06-22,_La_Ilustraci%C3%B3n_Espa%C3%B1ola_y_Americana,_Kieff_(Rusia),_La_expulsi%C3%B3n_de_los_jud%C3%ADos_eslavos,_familias_israelitas_abandonando_sus_hogares_(cropped).jpg',
    },
    {
      id: 'pale-map-jewish-encyclopedia-1905',
      src: '/images/pale/pale-map-jewish-encyclopedia-1905.jpg',
      width: 1209,
      height: 1600,
      alt: 'A black-and-white printed map titled ‘Map of Western Russia showing the Jewish Pale of Settlement’. Provinces from Kovno and Vilna in the north to Kherson, Bessarabia and Taurida on the Black Sea are shaded in gray patterns by the percentage of Jews living there; Warsaw and Grodno provinces are shaded darkest. A table at lower left lists each province with its percentage, from Poltava at 4.02% to Warsaw at 18.12%.',
      caption:
        'Map of Western Russia showing the Jewish Pale of Settlement and the percentage of Jews in each province, from The Jewish Encyclopedia, vol. 10, article “Russia” (New York: Funk & Wagnalls, 1905). The map also shades the provinces of Russian Poland (around Warsaw), which had separate rules and were not formally part of the Pale. Percentages are the encyclopedia’s own figures. Historical map.',
      date: '1905',
      creator:
        'Not specified in source (The Jewish Encyclopedia, article “Russia” by Herman Rosenthal, J. G. Lipman, Vasili Rosenthal, L. Wygodsky, M. Mysh and Abraham Galante)',
      institution: 'The Jewish Encyclopedia (Funk & Wagnalls, publisher)',
      license: 'Public domain',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Map_showing_the_percentage_of_Jews_in_the_Pale_of_Settlement_and_Congress_Poland,_The_Jewish_Encyclopedia_(1905).jpg',
    },
  ],
}

export default content
