import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://eternal-treefrog-44000.upstash.io',
  token: 'AavgAAIgcDFmOGE0ZTU2YzYyZmI0NWEyYWYxYTI0MzBlNmI4MzM1YQ',
})

export default async function handler(req, res) {
  // کاتێک نامەیەک یان شتێک لە تیلیگرامەوە دەگاتە سایتەکە
  if (req.method === 'POST') {
    const update = req.body;
    
    // پشکنین بۆ ئەوەی دڵنیا بین نامەکە یان تێکستەکە هی کەناڵ یان چاتەکەیە
    const messageText = update.message?.text || update.channel_post?.text;

    if (messageText) {
      // ڕاستەوخۆ لە داتابەیس پاشەکەوتی دەکەین
      await redis.lpush('news_list', JSON.stringify({ 
        text: messageText, 
        date: new Date() 
      }));
    }

    return res.status(200).json({ success: true });
  }

  // بۆ نیشاندان و خوێندنەوەی هەموو شتەکان لە ئەپەکەتدا
  try {
    const news = await redis.lrange('news_list', 0, -1);
    const parsedNews = news.map(item => JSON.parse(item));
    
    return res.status(200).json({ success: true, data: parsedNews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
