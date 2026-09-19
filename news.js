const Parser = require('rss-parser');
const parser = new Parser();

const sources = [
  { category: 'ناوخۆیی', url: 'https://www.rudaw.net/sorani/kurdistan/rss' },
  { category: 'وەرزشی', url: 'https://www.rudaw.net/sorani/sports/rss' },
  { category: 'تەکنەلۆژیا', url: 'https://www.rudaw.net/sorani/technology/rss' },
  { category: 'ئابووری', url: 'https://www.rudaw.net/sorani/business/rss' }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let allNews = [];

  try {
    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.url);
        feed.items.forEach(item => {
          allNews.push({
            id: item.guid || item.link,
            title: item.title,
            content: item.contentSnippet || item.content || 'بێ ناوەڕۆک',
            category: source.category,
            date: item.pubDate ? new Date(item.pubDate).toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }) : 'ئەمڕۆ',
            timestamp: item.pubDate ? new Date(item.pubDate).getTime() : Date.now()
          });
        });
      } catch (err) {
        console.log(`خەتا لە بەشی ${source.category}`);
      }
    }

    // ڕیزکردنی هەواڵەکان لە نوێترینەوە بۆ کۆنترین
    allNews.sort((a, b) => b.timestamp - a.timestamp);

    return res.status(200).json({ success: true, data: allNews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
