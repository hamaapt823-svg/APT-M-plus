// فایلی api/news.js بۆ پلاتفۆرمی APT Media
let persistentDatabase = [
  {
    id: 1,
    title: "سیستمی خۆکاری APT Media کارا شد",
    content: "ئێستا پەیوەندی لەگەڵ تەلەگرام سەرکەوتوو بوو و پلاتفۆرمەکە ئامادەیە.",
    date: "ئەمڕۆ",
    category: "ناوخۆیی",
    timestamp: Date.now()
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ئەگەر پەیامێک لە تەلەگرامەوە هات (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;
      let text = '';
      
      if (body && body.message && body.message.text) {
        text = body.message.text;
      } else if (body && body.text) {
        text = body.text;
      }

      if (!text) {
        return res.status(200).json({ success: true, message: 'پەیامەکە بەتاڵ بوو بەڵام وەرگیرا' });
      }

      // دابەشکردنی تێکستەکە بۆ ناونیشان و ناوەڕۆک
      const lines = text.split('\n');
      const title = lines[0] || 'هەواڵی نوێ لە تەلەگرام';
      const content = lines.slice(1).join('\n') || text;

      const newItem = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        category: 'ناوخۆیی',
        date: new Date().toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };

      persistentDatabase.unshift(newItem);

      return res.status(200).json({ 
        success: true, 
        message: 'هەواڵەکە بە سەرکەوتوویی زیاد کرا بۆ سایتەکە',
        data: newItem 
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // ناردنی لیستی هەواڵەکان بۆ فڕۆنتەند (GET)
  persistentDatabase.sort((a, b) => b.timestamp - a.timestamp);
  
  return res.status(200).json({
    success: true,
    articles: persistentDatabase.map(item => ({
      title: item.title,
      url: '#',
      summary: item.content,
      published: item.date,
      source: 'APT Media Telegram'
    })),
    data: persistentDatabase
  });
}
