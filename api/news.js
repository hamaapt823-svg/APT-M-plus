import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://eternal-treefrog-44000.upstash.io',
  token: 'AavgAAIgcDFmOGE0ZTU2YzYyZmI0NWEyYWYxYTI0MzBlNmI4MzM1YQ',
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const update = req.body;
    const messageText = update.message?.text || update.channel_post?.text;

    if (messageText) {
      // لێرەدا نامە نوێیەکە لە سەرەتای لیستەکەدا زیاد دەکەین
      await redis.lpush('news_list', JSON.stringify({ 
        text: messageText, 
        date: new Date().toISOString() 
      }));
    }

    return res.status(200).json({ success: true });
  }

  try {
    const news = await redis.lrange('news_list', 0, -1);
    const parsedNews = news.map(item => JSON.parse(item));
    
    return res.status(200).json({ success: true, data: parsedNews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
