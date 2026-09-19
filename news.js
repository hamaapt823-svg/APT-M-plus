export default async function handler(req, res) {
  // چارەسەرکردنی کێشەی CORS
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

  try {
    // هێنانی هەواڵ لە سەرچاوەی ڕاستەقینە (نموونە: BBC News RSS)
    const rssUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    // بەکارهێنانی Regex بۆ دەرهێنانی زانیاری هەواڵەکان لە RSS
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    // لیستێک لە ڤیدیۆی کورت و کوالێتی بەرز بۆ دروستکردنی کەشوهەوای TikTok
    const sampleVideos = [
      "https://assets.mixkit.co/videos/preview/mixkit-news-anchor-talking-on-camera-42891-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-world-map-animation-with-connections-41559-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-press-conference-with-microphones-and-cameras-42887-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphones-with-green-screens-41549-large.mp4"
    ];

    let count = 0;
    while ((match = itemRegex.exec(xmlText)) !== null && count < 10) {
      const itemContent = match[1];
      const title = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || itemContent.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const description = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || itemContent.match(/<description>(.*?)<\/description>/)?.[1] || '';
      const pubDate = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString();

      if (title) {
        items.push({
          id: `news-${Date.now()}-${count}`,
          title: title.trim(),
          summary: description.trim().replace(/<[^>]*>?/gm, ''), // پاککردنەوەی tagەکانی HTML
          source: 'APT Media Live',
          time: new Date(pubDate).toLocaleTimeString('ckb-IQ', { hour: '2-digit', minute: '2-digit' }),
          videoUrl: sampleVideos[count % sampleVideos.length]
        });
        count++;
      }
    }

    // ئەگەر بە هەر هۆیەک RSSەڵەکە خاو بوو، داتا کاتییەکان دەنێرێت تا شاشەکە ڕەش نەبێت
    if (items.length === 0) {
      items.push({
        id: 'fallback-1',
        title: 'بەخێر بێن بۆ APT Media - سەرچاوەی هەواڵە زیندوەکان',
        summary: 'نوێترین هەواڵەکانی جیهان بە شێوازی کورتە-ڤیدیۆ لێرە ببینە.',
        source: 'APT Media',
        time: 'ئێستا',
        videoUrl: sampleVideos[0]
      });
    }

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    // کاتێک هەڵەیەک ڕووبدات، وەڵامێک دەنێرێت تا ئەپەکە بەتەواوی نەوەستێت
    res.status(500).json({
      success: false,
      message: 'هەڵە لە هێنانی هەواڵەکان',
      error: error.message
    });
  }
}
