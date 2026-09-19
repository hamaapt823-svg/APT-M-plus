const Parser = require('rss-parser');

const parser = new Parser();

const sources = [
  { category: 'ناوخۆیی', url: 'https://www.rudaw.net/sorani/kurdistan/rss' },
  { category: 'وەرزشی', url: 'https://www.rudaw.net/sorani/sports/rss' },
  { category: 'ئابووری', url: 'https://www.rudaw.net/sorani/business/rss' },
  { category: 'گشتی', url: 'https://www.rudaw.net/sorani/rss' },
];

let cache = {
  data: [],
  lastFetch: 0,
};

const CACHE_DURATION = 5 * 60 * 1000;

async function fetchNews() {
  const now = Date.now();

  if (cache.data.length > 0 && now - cache.lastFetch < CACHE_DURATION) {
    return cache.data;
  }

  const allNews = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      feed.items.forEach((item) => {
        allNews.push({
          id: item.guid || item.link,
          title: item.title,
          summary: item.contentSnippet || item.content || '',
          category: source.category,
          url: item.link,
          time: item.pubDate
            ? new Date(item.pubDate).toLocaleTimeString('ckb', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          publisher: 'APT Media',
          image: item.enclosure
            ? item.enclosure.url
            : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
        });
      });
    } catch (err) {
      console.log('خەتا لە هێنانی هەواڵی: ' + source.category, err.message);
    }
  }

  allNews.sort((a, b) => new Date(b.time) - new Date(a.time));

  cache.data = allNews;
  cache.lastFetch = now;

  return allNews;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const news = await fetchNews();
    res.status(200).json(news);
  } catch (error) {
    console.error('هەڵە:', error);
    res.status(500).json({ error: 'هەڵە لە هێنانی هەواڵەکان' });
  }
};
