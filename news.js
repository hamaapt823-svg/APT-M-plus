export default async function handler(req, res) {
  // چارەسەرکردنی کێشەی CORS بۆ ئەوەی بلۆک نەبێت
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { cat } = req.query;

  // سەرچاوەکانی هەواڵ (دەتوانی لینکی زیاتر زیادی بکەیت)
  const feeds = {
    all: 'https://www.rudaw.net/sorani/rss',
    local: 'https://www.rudaw.net/sorani/kurdistan/rss',
    sports: 'https://www.rudaw.net/sorani/sports/rss',
    economy: 'https://www.rudaw.net/sorani/business/rss'
  };

  const targetFeed = feeds[cat] || feeds.all;

  try {
    // بەکارهێنانی api.rss2json لە لایەن سێرڤەرەوە
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetFeed)}`);
    const data = await response.json();

    if (data.status === 'ok') {
      const formattedItems = data.items.map((item) => {
        // دۆزینەوەی وێنە لە ناو هەواڵەکەدا
        let imgUrl = item.thumbnail || (item.enclosure ? item.enclosure.link : null);
        
        if (!imgUrl) {
          imgUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
        }

        return {
          title: item.title,
          link: item.link,
          img: imgUrl,
          description: item.description ? item.description.replace(/<[^>]*>?/gm, '') : '',
          date: new Date(item.pubDate).toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }),
          source: 'APT Live'
        };
      });

      return res.status(200).json(formattedItems);
    } else {
      return res.status(500).json({ error: 'کێشە لە هێنانی داتا هەیە' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
