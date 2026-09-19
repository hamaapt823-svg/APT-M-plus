module.exports = async (req, res) => {
  // ڕێکخستنی CORS بۆ ئەوەی ڕووکارەکە بتوانێت داتاکان وەربگرێت
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sources = [
    { category: 'ناوخۆیی', url: 'https://www.rudaw.net/sorani/kurdistan/rss' },
    { category: 'وەرزشی', url: 'https://www.rudaw.net/sorani/sports/rss' },
    { category: 'ئابووری', url: 'https://www.rudaw.net/sorani/business/rss' },
    { category: 'گشتی', url: 'https://www.rudaw.net/sorani/rss' }
  ];

  let allNews = [];
  let debugErrors = [];

  for (const source of sources) {
    try {
      // بەکارهێنانی Fetch ـی ڕەسەن لەجیاتی rss-parser
      const response = await fetch(source.url, {
        headers: {
          // دانانی User-Agent بۆ ئەوەی ڕووداو بلۆکی نەکات
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        debugErrors.push(`Failed to fetch ${source.category}: ${response.status}`);
        continue;
      }

      const xml = await response.text();
      
      // جیاکردنەوەی هەواڵەکان لە فایلی XMLـەکەوە
      const items = xml.split('<item>');
      items.shift(); // سڕینەوەی بەشی سەرەتای فایلەکە
      
      items.forEach(item => {
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        
        if (titleMatch) {
          // پاککردنەوەی تێکستەکان لە تاگەکانی وەک CDATA و HTML
          let title = titleMatch[1].replace(/<!\[CDATA\[\vert{}\]\]>/g, '').trim();
          let content = descMatch ? descMatch[1].replace(/<!\[CDATA\[\vert{}\]\]>|<[^>]+>/g, '').trim() : '';
          let dateStr = dateMatch ? dateMatch[1].trim() : '';
          
          allNews.push({
            title: title,
            content: content.substring(0, 150) + '... (' + source.category + ')',
            date: dateStr,
            timestamp: dateStr ? new Date(dateStr).getTime() : 0
          });
        }
      });
    } catch (err) {
      debugErrors.push(`${source.category} Error: ${err.message}`);
    }
  }

  // ڕیزکردنی هەواڵەکان لە نوێترینەوە بۆ کۆنترین
  allNews.sort((a, b) => b.timestamp - a.timestamp);

  // ناردنی داتاکان
  if (allNews.length === 0) {
      res.status(200).json({ data: [], debug: debugErrors });
  } else {
      res.status(200).json({ data: allNews });
  }
};
