import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://eternal-treefrog-44000.upstash.io',
  token: 'AavgAAIgcDFmOGE0ZTU2YzYyZmI0NWEyYWYxYTI0MzBlNmI4MzM1YQ',
})

export default async function handler(req, res) {
  // تەنها ڕێگە بە نامە و زانیاری ڕاستەقینە دەدات بێتە ژوورەوە
  if (req.method === 'POST') {
    const update = req.body;
    
    // خوێندنەوەی تێکستی نامەکە یان پۆستی کەناڵ بە ڕوونی
    const messageText = update.message?.text || update.channel_post?.text;

    if (messageText) {
      await redis.lpush('news_list', JSON.stringify({ 
        text: messageText, 
        date: new Date().toISOString() 
      }));
    }

    return.status(200).json({ success: true });
  }

  // نیشاندانی هەموو هەواڵ و نامەکان لە ئەپەکەتدا
  try {
    const news = await redis.lrange('news_list', 0, -1);
    const parsedNews = news.map(item => JSON.parse(item));
    
    return res.status(200).json({ success: true, data: parsedNews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
