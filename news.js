export default async function handler(req, res) {
  // شوێنی CORS بۆ ئەوەی کێشەی بلۆکبوون دروست نەبێت
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { cat } = req.query;

  // سەرچاوە ڕاستەوخۆکان
  const feeds = {
    all: 'https://www.kurdistan24.net/ckb/rss',
    local: 'https://www.kurdistan24.net/ckb/rss/kurdistan',
    world: 'https://www.kurdistan24.net/ckb/rss/world',
    sports: 'https://www.kurdistan24.net/ckb/rss/sport',
    economy: 'https://www.kurdistan24.net/ckb/rss/economy'
  };

  const targetFeed = feeds[cat] || feeds.all;

  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetFeed)}`);
    const data = await response.json();

    if (data.status === 'ok') {
      const formattedItems = data.items.map(item => ({
        title: item.title,
        link: item.link,
        // وێنەی هەواڵ
        img: item.thumbnail || item.enclosure?.link || '',
        // پوختە و کورتەی تەواوی هەواڵەکە
        description: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' : 'هیچ پوختەیەک بەردەست نییە.',
        date: item.pubDate,
        source: 'هەواڵی خێرا'
      }));

      return res.status(200).json({ status: 'success', articles: formattedItems });
    } else {
      return res.status(500).json({ status: 'error', message: 'کێشە لە ڕاکێشانی هەواڵەکان دروستبوو' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
