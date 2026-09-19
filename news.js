export default async function handler(req, res) {
  // ڕێگەدان بە CORS بۆ ئەوەی وێبگەڕ بڵۆکی نەکات
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  const { cat = 'all' } = req.query;

  const feeds = {
    all: 'https://www.rudaw.net/sorani/rss',
    local: 'https://www.rudaw.net/sorani/kurdistan/rss',
    sports: 'https://www.rudaw.net/sorani/sports/rss',
    economy: 'https://www.rudaw.net/sorani/business/rss'
  };

  const targetUrl = feeds[cat] || feeds.all;

  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetUrl)}`);
    const data = await response.json();

    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const news = data.items.map((item) => ({
        title: item.title,
        link: item.link,
        img: item.thumbnail || (item.enclosure ? item.enclosure.link : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'),
        date: new Date(item.pubDate).toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }),
        source: 'APT Live'
      }));
      return res.status(200).json(news);
    } else {
      throw new Error('فەیڵ بوو لە هێنانی RSS');
    }
  } catch (error) {
    // هەواڵی بەکئەپ ئەگەر ئینتەرنێت پچڕا یان RSS خاو بوو
    const fallbackNews = [
      {
        title: 'کەشناسی هەرێم: شەپۆلێکی بارانبارین و بەفر زۆربەی ناوچەکان دەگرێتەوە.',
        link: 'https://www.rudaw.net',
        img: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800',
        date: 'ئێستا',
        source: 'APT News'
      },
      {
        title: 'بەرزبوونەوەی نرخەکانی زێڕ و نەوت لە بازاڕە جیهانییەکاندا.',
        link: 'https://www.rudaw.net',
        img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        date: 'پێش ٥ خولەک',
        source: 'APT Economy'
      },
      {
        title: 'یارییەکانی قۆناغی داهاتووی خولی پاڵەوانەکان بەڕێوەدەچێت.',
        link: 'https://www.rudaw.net',
        img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
        date: 'پێش ١٠ خولەک',
        source: 'APT Sport'
      }
    ];
    return res.status(200).json(fallbackNews);
  }
}
