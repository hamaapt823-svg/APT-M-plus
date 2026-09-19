import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://eternal-treefrog-44000.upstash.io',
  token: 'AavgAAIgcDFmOGE0ZTU2YzYyZmI0NWEyYWYxYTI0MzBlNmI4MzM1YQ',
})

export default async function handler(req, res) {
  try {
    // دەتوانیت لێرەدا داتاکانی هەواڵ لە داتابەیس بخوێنیتەوە یان بنووسیت
    await redis.set("foo", "bar");
    const value = await redis.get("foo");

    res.status(200).json({ 
      success: true, 
      message: 'داتابەیسەکە بە سەرکەوتوویی بەستراوەتەوە!',
      data: value 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
