import type { ChapterContent } from '../../types'

const content: ChapterContent = {
  chapterText: {
    subtitle: 'Hasidic faith in Uman, restless arguments in Odesa',
    dateRange: '1700s–1905',
    summary:
      'Faith and new ideas pulled the Jews of the Pale in different directions. Hasidism, a joyful and mystical movement, spread across the region. PBS’s description of Episode 4 mentions Uman, where Rabbi Nachman of Breslov died in 1810 and where thousands of pilgrims still gather every Rosh Hashanah, but the narration discusses Hasidism through the town of Satanov instead. On the Black Sea, the booming port of Odesa (historically Odessa) became a center of modern Jewish life, where writers, students and workers argued over socialism, Jewish nationalism and what it meant to be Jewish.',
  },

  stories: [
    {
      placeId: 'uman',
      theme: 'Hasidism and Rabbi Nachman of Breslov',
      period: 'Late 1700s to today',
      whatHappened: [
        'Hasidism was a religious revival that began in the 1700s in Podolia, in the south-east of the Polish–Lithuanian Commonwealth (today part of Ukraine). It grew around the Baal Shem Tov (died 1760), the “Master of the Good Name.” Each Hasidic group gathered around a tzaddik, or rebbe: a holy man followed for his spiritual power, not for an official post. By the 1800s Hasidism had spread across Eastern Europe and won followers from every class.',
        'Rabbi Nachman (1772–1810) was the Baal Shem Tov’s great-grandson. He saw the search for God as a painful struggle and taught his followers to pour out their hearts to God in private, spoken prayer. He also told fantastic stories full of hidden meanings. Many other rebbes saw him as controversial. A few months before he died of tuberculosis in 1810, he moved to Uman. He said he wanted to pray for the souls of the Jews massacred there in 1768.',
        'Nachman left no heir, and his followers never chose another rebbe. They are named after the town of Bratslav, which they pronounce “Breslov.” His disciple Natan Sternhartz turned their yearly Rosh Hashanah gathering into a pilgrimage to Nachman’s grave. Soviet campaigns against religion in the 1930s drove the group underground, and during World War II the Nazis murdered some 17,000 of Uman’s Jews. Since the 1960s, pilgrims have returned. In 2004, more than 10,000 came for Rosh Hashanah.',
      ],
      whyItMatters:
        'Uman shows how faith and community can outlast the people who created them. Hasidism gave ordinary Jews a warm, emotional way to reach God, led by rebbes they trusted. Nachman’s followers kept his memory alive through Soviet persecution and the Holocaust, and they still return to his grave. Today his grave is the most developed Jewish pilgrimage site in Eastern Europe.',
      documentaryConnection:
        'Episode 4 presents Hasidism as a mass movement of joy and fervor. Schama says, “Hasidism urges direct communion with God through joyous bouts of singing and dancing and ecstatic trance-like prayer.” The narration traces its roots to Satanov (today Sataniv), another Ukrainian town, and to the Baal Shem Tov and the tzaddiks who followed him. PBS’s episode description says the program travels to Uman, where Hasidim chant and sing at Rabbi Nachman’s tomb, but the available transcript never names Uman or Nachman. The Uman history here is additional context.',
      keyFacts: [
        { label: 'Rabbi Nachman', value: '1772–1810', sourceId: 'yivo-bratslav-hasidism' },
        { label: 'Moved to Uman, months before his death', value: '1810', sourceId: 'yivo-uman' },
        { label: 'Jews in Uman, 1897', value: '17,945 (59% of the town)', sourceId: 'yivo-uman' },
        { label: 'Rosh Hashanah pilgrims, 2004', value: 'More than 10,000', sourceId: 'yivo-uman' },
      ],
      imageIds: ['faith-ideas-uman-old-cemetery-selichot', 'faith-ideas-uman-tomb-rabbi-nachman'],
      sourceIds: [
        'yivo-hasidism-historical-overview',
        'yivo-nahman-of-bratslav',
        'yivo-bratslav-hasidism',
        'yivo-uman',
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
      ],
    },
    {
      placeId: 'odesa',
      theme: 'Modern Jewish ideas: socialism, Zionism and identity',
      period: 'Early 1800s to 1905',
      whatHappened: [
        'Odesa (historically spelled Odessa) was founded in 1794 on the Black Sea and grew fast as the Russian Empire’s leading grain port. Jews poured in. By 1897 the city had 139,984 Jews, about a third of its people and the second-largest Jewish community in the empire after Warsaw. Jewish firms came to control most of its grain exports, yet around 1900 about one-third of the city’s Jews registered for Passover charity.',
        'Odesa was far from the old centers of Jewish learning and open to new ideas. It opened a modern Jewish school for boys in 1826 and one for girls in 1835, and its synagogues modernized early. Yiddish theater took root here. Traditional Jews had a saying that the fires of hell burned seven miles around Odessa. Around 1900, it was home to writers and thinkers such as Ahad Ha-Am, Simon Dubnow and Hayim Nahman Bialik.',
        'People argued hard about the Jewish future. In 1881 a wave of pogroms swept the southern Pale and reached Odesa too. Many young Jews joined radical circles; the city’s Social Democratic committee, founded in 1894, was mostly Jewish artisans and workers. Others turned to Jewish nationalism. The Odesa doctor Leon (Leo) Pinsker answered the pogroms with Autoemancipation (1882) and became head of the Lovers of Zion (Hovevei Zion), which backed Jewish farm settlements in Palestine. In 1905 a pogrom in Odesa killed about 300 Jews, including more than 50 members of Jewish self-defense groups.',
      ],
      whyItMatters:
        'Odesa was a testing ground for a big modern question: how to be Jewish outside the old shtetl world. Answers ranged from socialism to liberal Russian life to Jewish nationalism. The Lovers of Zion fed into the Zionist movement founded in 1897, and Odesa’s port was a main departure point for Jews moving to Palestine. Still, most educated Jews in the city stayed liberal and skeptical of nationalism.',
      documentaryConnection:
        'Episode 4 calls Odessa the port at the bottom of the Pale that drew restless Jews from the early 1800s, a city of boulevards, theaters and progressive schools. Schama says its Jews asked “how to be Jewish in the modern world without resorting to Hasidic miracles in the sky.” He follows them into socialism, the 1881 pogroms, a Guardian report on the 1905 Odessa pogrom, and Dr. Leo Pinsker’s Lovers of Zion. The narration jumps from 1905 to the Lovers of Zion, but the movement began in the early 1880s.',
      keyFacts: [
        { label: 'City founded', value: '1794', sourceId: 'yivo-odessa' },
        { label: 'Jews in Odesa, 1897', value: '139,984 (34.6% of the city)', sourceId: 'yivo-odessa' },
        { label: 'Grain exports by Jewish-owned firms, early 1900s', value: '89%', sourceId: 'yivo-odessa' },
        { label: 'Pinsker’s Autoemancipation', value: '1882', sourceId: 'yivo-pinsker' },
      ],
      imageIds: [
        'faith-ideas-odessa-port-photochrom',
        'faith-ideas-leon-pinsker-portrait',
        'faith-ideas-odessa-brody-synagogue',
      ],
      sourceIds: [
        'yivo-odessa',
        'yivo-pinsker',
        'yivo-hibat-tsiyon',
        'pbs-episode-4',
        'pbs-wisconsin-episode-4',
      ],
      needsVerification: [
        'How badly the 1881 pogrom hit Odesa: the episode lists Odessa among the cities attacked, and YIVO says local authorities mostly thwarted the violence there, while other accounts describe days of looting of Jewish homes and shops.',
      ],
    },
  ],

  sources: [
    {
      id: 'yivo-hasidism-historical-overview',
      title: 'Hasidism: Historical Overview',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (David Assaf)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Hasidism/Historical_Overview',
      kind: 'encyclopedia',
      usedFor: 'Origins of Hasidism in Podolia, the Baal Shem Tov, and the role of the tsadik or rebbe.',
    },
    {
      id: 'yivo-nahman-of-bratslav',
      title: 'Naḥman of Bratslav',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Arthur Green)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Nahman_of_Bratslav',
      kind: 'encyclopedia',
      usedFor: 'Nachman’s descent from the Baal Shem Tov, his teachings and stories, his death in Uman and his grave as a pilgrimage site.',
    },
    {
      id: 'yivo-bratslav-hasidism',
      title: 'Bratslav Hasidism',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Ada Rapoport-Albert)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Bratslav_Hasidism',
      kind: 'encyclopedia',
      usedFor: 'Nachman’s dates, the lack of a successor rebbe, and Natan Sternhartz’s Rosh Hashanah pilgrimage to Uman.',
    },
    {
      id: 'yivo-uman',
      title: 'Uman',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (ChaeRan Freeze)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Uman',
      kind: 'encyclopedia',
      usedFor: 'The 1768 massacre, Nachman’s move to Uman, population figures, Soviet and Nazi persecution, and the modern pilgrimage.',
    },
    {
      id: 'yivo-odessa',
      title: 'Odessa',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Steven J. Zipperstein)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Odessa',
      kind: 'encyclopedia',
      usedFor: 'Odesa’s founding, Jewish population, grain trade, modern schools, writers, radical politics, Hovevei Zion and the 1905 pogrom.',
    },
    {
      id: 'yivo-pinsker',
      title: 'Pinsker, Simḥah and Lev',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Evyatar Friesel)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Pinsker_Simhah_and_Lev',
      kind: 'encyclopedia',
      usedFor: 'Leon Pinsker’s life dates, his medical career in Odesa, Autoemancipation (1882) and his leadership of Hovevei Zion.',
    },
    {
      id: 'yivo-hibat-tsiyon',
      title: 'Ḥibat Tsiyon',
      publisher: 'YIVO Encyclopedia of Jews in Eastern Europe (Michael Stanislawski)',
      url: 'https://encyclopedia.yivo.org/article.aspx/Hibat_Tsiyon',
      kind: 'encyclopedia',
      usedFor: 'The Lovers of Zion movement of the early 1880s, its settlements in Palestine, and its link to the Zionist movement of 1897.',
    },
  ],

  images: [
    {
      id: 'faith-ideas-uman-old-cemetery-selichot',
      src: '/images/faith-ideas/faith-ideas-uman-old-cemetery-selichot.jpg',
      width: 991,
      height: 788,
      alt: 'Faded mounted black-and-white photograph of a crowd of men and boys in dark coats and caps standing in tall grass in an old cemetery on a hillside. A small white building with a shingled roof stands at right, and the low houses of a town, with two larger buildings, spread across the slope behind them. A line of Hebrew text is printed along the bottom of the mount.',
      caption:
        'Visitors in the old Jewish cemetery of Uman during the days of Selichot (the penitential prayers before Rosh Hashanah), with the town behind them. The small white building is the structure over the grave of Rabbi Nachman of Breslov. Photograph, between 1890 and 1914.',
      date: 'between 1890 and 1914',
      creator: 'Unknown',
      institution: 'Private collection',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Uman._Grave_of_Rabbi_Nachman_-06.jpg',
    },
    {
      id: 'faith-ideas-uman-tomb-rabbi-nachman',
      src: '/images/faith-ideas/faith-ideas-uman-tomb-rabbi-nachman.jpg',
      width: 783,
      height: 686,
      alt: 'Black-and-white photograph of a small whitewashed building with a steep wooden-shingle roof standing among tall grass and old gravestones. Through its open doorway a man in a cap sits reading. A handwritten Hebrew caption runs along the bottom of the mount.',
      caption:
        'The small building over the grave of Rabbi Nachman of Breslov in the old Jewish cemetery of Uman, with a man reading inside the doorway. Photograph, late 19th century (dated 1890 on its Wikimedia Commons record).',
      date: 'c. 1890',
      creator: 'Unknown',
      institution: 'National Library of Israel (Archive of Mordechai Martin Buber)',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Uman._Grave_of_Rabbi_Nachman_-04.jpg',
    },
    {
      id: 'faith-ideas-odessa-port-photochrom',
      src: '/images/faith-ideas/faith-ideas-odessa-port-photochrom.jpg',
      width: 1400,
      height: 1042,
      alt: 'Hand-colored photochrom print of a busy harbor. Steamships and sailing ships crowd the water, a long elevated railway trestle lined with freight wagons runs along the quay, and warehouses with red and brown roofs and horse-drawn carts fill the foreground. The print is labeled ‘Odessa. Le Port Practique’ in French and Russian.',
      caption:
        'The Practical Harbour at Odessa, Russian Empire (today Odesa, Ukraine), with steamships, sailing ships and railway freight wagons. Odessa was the Russian Empire’s leading grain-exporting port. Photochrom print, between 1890 and 1900.',
      date: 'between 1890 and 1900',
      creator: 'Photochrom Print Collection (photographer not recorded)',
      institution: 'Library of Congress',
      license: 'Public domain',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:The_Port_Practique,_Odessa,_Russia,_(i.e.,_Ukraine)-LCCN2001697471.jpg',
    },
    {
      id: 'faith-ideas-leon-pinsker-portrait',
      src: '/images/faith-ideas/faith-ideas-leon-pinsker-portrait.jpg',
      width: 892,
      height: 1400,
      alt: 'Sepia portrait postcard of an older man with a long full beard, swept-back hair and a dark coat, set in an oval frame. Below the oval are the words ‘Dr. L. Pinsker’ in Latin letters and his name in Hebrew letters, with a Hebrew publisher’s line and the number 22 at the bottom.',
      caption:
        'Dr. Leon (Yehudah Leib) Pinsker (1821–1891), the Odessa physician who wrote Autoemancipation (1882) and led the Lovers of Zion (Hovevei Zion). Portrait postcard; the portrait was made before 1891.',
      date: 'before 1891 (portrait); postcard printing undated',
      creator: 'Unknown',
      institution: 'Lowcountry Digital Library',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pinsker.jpg',
    },
    {
      id: 'faith-ideas-odessa-brody-synagogue',
      src: '/images/faith-ideas/faith-ideas-odessa-brody-synagogue.jpg',
      width: 683,
      height: 555,
      alt: 'Sepia halftone illustration of a large two-story brick building in a Gothic revival style, with pointed arched windows, a round window in a gable, and small domed turrets on the roof. Bare young trees line the pavement in front, and a few figures stand in the street.',
      caption:
        'The Brody Synagogue in Odessa (today Odesa, Ukraine). Jewish families from Brody, in Galicia, were at the core of the city’s early Jewish elite; they oversaw its synagogue life and opened its first modern Jewish school. In 1925 the building was turned into a workers’ club. Illustration captioned “Brody Synagogue” in the Odessa article of the Russian-language Jewish Encyclopedia (Brockhaus and Efron), 1906–1913.',
      date: 'before 1906 (published 1906–1913)',
      creator: 'Unknown (published in the Brockhaus and Efron Jewish Encyclopedia)',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Brockhaus_and_Efron_Jewish_Encyclopedia_e12_054-0.jpg',
    },
  ],
}

export default content
