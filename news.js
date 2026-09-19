export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sources = [
    { category: 'ناوخۆیی', url: 'https://www.rudaw.net/sorani/kurdistan/rss' },
    { category: 'وەرزشی', url: 'https://www.rudaw.net/sorani/sports/rss' },
    { category: 'تەکنەلۆژیا', url: 'https://www.rudaw.net/sorani/technology/rss' },
    { category: 'ئابووری', url: 'https://www.rudaw.net/sorani/business/rss' }
  ];

  let allNews = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) continue;

      const xml = await response.text();
      const items = xml.split('<item>');
      items.shift(); // سڕینەوەی سەردێڕی فایلی XML
      
      items.forEach(item => {
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
        
        if (titleMatch) {
          let title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

          let content = descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>|<[^>]+>/g, '').trim() : '';
          content = content.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

          let dateStr = dateMatch ? dateMatch[1].trim() : '';
          let timestamp = dateStr ? new Date(dateStr).getTime() : Date.now();
          
          allNews.push({
            id: linkMatch ? linkMatch[1].trim() : Math.random().toString(),
            title: title,
            content: content ? (content.substring(0, 130) + '...') : 'بێ ناوەڕۆک',
            category: source.category,
            date: dateStr ? new Date(dateStr).toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }) : 'ئەمڕۆ',
            timestamp: isNaN(timestamp) ? Date.now() : timestamp
          });
        }
      });
    } catch (err) {
      console.log('Error fetching source:', err);
    }
  }

  // ڕیزکردنی هەواڵەکان لە نوێترینەوە بۆ کۆنترین
  allNews.sort((a, b) => b.timestamp - a.timestamp);

  // ناردنی داتاکان بۆ ئەپەکە
  return res.status(200).json({ success: true, data: allNews });
}
