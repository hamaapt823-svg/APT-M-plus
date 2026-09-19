// گەنجینەی یادگە بۆ هەواڵەکان (سیستمی لایڤ کە بۆت و ئەی ئای دەیگەیەنن)
let liveNewsDatabase = [
  {
    id: 1,
    title: "سەرکەوتنی گەورەی پڕۆژەی APT Media لەسەر Vercel",
    content: "پڕۆژەی نوێی APT Media بە سەرکەوتوویی کەوتە کار و ئێستا بە شێوازێکی خێرا و مۆدێرن بەردەستە.",
    date: "ئەمڕۆ - 11:40",
    category: "ناوخۆیی",
    timestamp: Date.now()
  },
  {
    id: 2,
    title: "دەستپێکردنی خولی نوێی پاڵەوانێتی یارییە ئەلیکترۆنییەکان",
    content: "پێشبڕکێ بەهێزەکان لە نێوان یاریزانە پیشەگەرەکاندا دەستی پێکرد و ڕکابەری لەسەر پلەی یەکەم بەردەوامە.",
    date: "ئەمڕۆ - 10:15",
    category: "وەرزشی",
    timestamp: Date.now() - 1000
  },
  {
    id: 3,
    title: "بڵاوبوونەوەی مۆدێلی نوێی زیرەکی دەستکرد بە توانای سەرسوڕهێنەر",
    content: "کۆمپانیا جیهانییەکان تەکنەلۆژیای نوێ ڕادەگەیەنن کە ئاسانکاری گەورە بۆ پەرەپێدەران دەکات.",
    date: "ئەمڕۆ - 09:30",
    category: "تەکنەلۆژیا",
    timestamp: Date.now() - 2000
  },
  {
    id: 4,
    title: "گۆڕانکاری لە بازاڕەکانی ئابووری و دراوە جیهانییەکان",
    content: "بازارەکانی ئابووری ڕووبەڕووی شەپۆلێکی نوێی گۆڕانکاری بوونەوە لە کاتێکدا چالاکی بازرگانی بەرز بووەوە.",
    date: "دوێنێ",
    category: "ئابووری",
    timestamp: Date.now() - 3000
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ١. ئەگەر بۆت یان ئەی ئای (AI) هەواڵێکی نوێی نارد بە ڕێگەی POST
  if (req.method === 'POST') {
    try {
      const { title, content, category, date } = req.body;

      if (!title || !content) {
        return res.status(400).json({ success: false, error: 'ناونیشان و ناوەڕۆک پێویستن' });
      }

      const newNewsItem = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        category: category || 'گشتی',
        date: date || 'ئەمڕۆ - ' + new Date().toLocaleTimeString('ckb', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };

      // خستنە سەرەتای لیستەکە (وەک فەیسبووک و پلاتفۆرمە گەورەکان)
      liveNewsDatabase.unshift(newNewsItem);

      return res.status(200).json({ 
        success: true, 
        message: 'هەواڵەکە بە سەرکەوتوویی زیاد کرا و بڵاوبوویەوە بۆ هەموو بەکارهێنەران', 
        data: newNewsItem 
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // ٢. ئەگەر ئەپەکە داواکاری هێنا (GET) بۆ پیشاندانی هەواڵەکان بە بەکارهێنەران
  liveNewsDatabase.sort((a, b) => b.timestamp - a.timestamp);
  return res.status(200).json({ success: true, data: liveNewsDatabase });
}
