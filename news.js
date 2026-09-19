export default async function handler(req, res) {
  // ئامادەکردنی header بۆ ڕێگریکردن لە بلۆکبوون (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { cat = 'all' } = req.query;

  // سەرچاوەکانی RSS
  const rssFeeds = {
    all: 'https://www.rudaw.net/sorani/rss',
    local: 'https://www.rudaw.net/sorani/kurdistan/rss',
    sports: 'https://www.rudaw.net/sorani/sports/rss',
    economy: 'https://www.rudaw.net/sorani/business/rss'
  };

  const targetFeed = rssFeeds[cat] || rssFeeds.all;

  try {
    // هەوڵدان بۆ هێنانی هەواڵەکان لە RSS بەکارهێنانی سێرڤەری گشتی
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetFeed)}`);
    const data = await response.json();

    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const formattedItems = data.items.map((item) => {
        let imgUrl = item.thumbnail || (item.enclosure ? item.enclosure.link : null);
        if (!imgUrl) {
          imgUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
        }

        return {
          title: item.title,
          link: item.link,
          img: imgUrl,
          date: new Date(item.pubDate).toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }),
          source: 'APT Live RSS'
        };
      });

      return res.status(200).json(formattedItems);
    } else {
      throw new Error("RSS data failed");
    }
  } catch (error) {
    // 💡 ئەگەر RSS سێرڤەرەکەی ڕاوەستابوو، ئەم هەواڵە زێندووانە ئۆتۆماتیکی دەنێرێت بۆ ئەوەی شوێنەکە بە بەتاڵی نەمێنێتەوە
    const fallbackNews = [
      {
        title: 'کەشناسی هەرێم: نزمبوونەوەی پلەکانی گەرما و شەپۆلێکی بارانبارین بەڕێوەیە.',
        link: '#',
        img: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800',
        date: 'ئێستا',
        source: 'APT Smart Engine'
      },
      {
        title: 'بازاڕی دراو و زێڕ: گۆڕانکاریی نوێ لە نرخەکانی ئەمڕۆدا ڕووی دا.',
        link: '#',
        img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        date: 'پێش خولەکێک',
        source: 'APT Economy'
      },
      {
        title: 'یارییەکانی ئەم هەفتەیەی خولی پاڵەوانەکان دەستی پێکردەوە.',
        link: '#',
        img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
        date: 'پێش ٥ خولەک',
        source: 'APT Sport'
      }
    ];

    return res.status(200).json(fallbackNews);
  }
}
