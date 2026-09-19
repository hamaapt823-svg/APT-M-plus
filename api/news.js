import { Redis } from '@upstash/redis';

// بەستنەوەی ڕاستەوخۆ بە داتابەیسی Upstash Redis بۆ APT Media
const redis = new Redis({
  url: 'https://eternal-treefrog-44000.upstash.io',
  token: 'لێرە_توکنەکەی_خۆت_دابنە',
});

export default async function handler(req, res) {
  try {
    // لێرە لۆجیکی خوێندنەوە یان ناردنی هەواڵەکان دادەنرێت
    res.status(200).json({ success: true, message: 'بۆتەکەی APT Media بە سەرکەوتوویی کار دەکات!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
