let liveNewsDatabase = [
  {
    id: 1,
    title: "سیستمی خۆکاری APT Media دەستی بە کار کرد",
    content: "ئێستا پلاتفۆرمەکە بە شێوەیەکی لایڤ لە ڕێگەی تەلەگرامەوە نوێ دەبێتەوە.",
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

  // ئەگەر داواکاری لە تەلەگرامەوە یان لە ڕێگەی POSTـەوە هات
  if (req.method === 'POST') {
    try {
      let title, content, category;

      // پشکنین بۆ ئەوەی ئایا داتاکە لە تەلەگرامەوە هاتووە یان ڕاستەوخۆ
      if (req.body.message) {
        const text = req.body.message.text || '';
        title = text.split('\n')[0] || 'هەواڵی نوێ';
        content = text;
        category = 'گشتی';
      } else {
        title = req.body.title;
        content = req.body.content;
        category = req.body.category || 'گشتی';
      }

      if (!content) {
        return res.status(400).json({ success: false, error: 'ناوەڕۆک پێویستە' });
      }

      const newNewsItem = {
        id: Date.now(),
        title: (title || 'هەواڵی لایڤ').trim(),
        content: content.trim(),
        category: category,
        date: 'ئەمڕۆ - ' + new Date().toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };

      liveNewsDatabase.unshift(newNewsItem);

      return res.status(200).json({ 
        success: true, 
        message: 'هەواڵەکە بە سەرکەوتوویی زیاد کرا', 
        data: newNewsItem 
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  liveNewsDatabase.sort((a, b) => b.timestamp - a.timestamp);
  return res.status(200).json({ success: true, data: liveNewsDatabase });
}
