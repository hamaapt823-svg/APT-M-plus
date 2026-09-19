let liveNewsDatabase = [
  {
    id: 1,
    title: "سەرکەوتنی گەورەی پڕۆژەی APT Media لەسەر Vercel",
    content: "پڕۆژەی نوێی APT Media بە سەرکەوتوویی کەوتە کار و ئێستا بە شێوازێکی خێرا و مۆدێرن بەردەستە بۆ هەمووان.",
    date: "ئەمڕۆ - 11:40",
    category: "ناوخۆیی",
    timestamp: Date.now()
  },
  {
    id: 2,
    title: "دەستپێکردنی خولی نوێی پاڵەوانێتی یارییە ئەلیکترۆنییەکان لە هەرێم",
    content: "پێشبڕکێ بەهێزەکان لە نێوان یاریزانە پیشەگەرەکاندا دەستی پێکرد و ڕکابەری لەسەر پلەی یەکەم گەیشتە لوتکە.",
    date: "ئەمڕۆ - 10:15",
    category: "وەرزشی",
    timestamp: Date.now() - 1000
  },
  {
    id: 3,
    title: "بڵاوبوونەوەی مۆدێلی نوێی زیرەکی دەستکرد بە توانای سەرسوڕهێنەر",
    content: "کۆمپانیا جیهانییەکان تەکنەلۆژیای نوێ ڕادەگەیەنن کە ئاسانکاری گەورە بۆ پەرەپێدەران و بەکارهێنەران دەکات.",
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
  },
  {
    id: 5,
    title: "پەرەپێدانی ژێرخانی خزمەتگوزارییە ئۆنلاینەکان لە شارەکانی کوردستان",
    content: "هەنگاوی نوێ بنراوە بۆ باشترکردنی خێرایی ئینتەرنێت و خزمەتگوزارییە دیجیتالییەکان بۆ هاووڵاتیان.",
    date: "دوێنێ",
    category: "ناوخۆیی",
    timestamp: Date.now() - 4000
  },
  {
    id: 6,
    title: "ڕاهێنەری یانەکە پێکهاتەی نوێ بۆ یاری داهاتوو ڕادەگەیەنێت",
    content: "لە کۆنگرەیەکی ڕۆژنامەوانیدا باسی لە ئامادەکارییەکان و ستراتیژی تیپەکە کرا بۆ بردنەوەی جامەکە.",
    date: "پێرێ",
    category: "وەرزشی",
    timestamp: Date.now() - 5000
  },
  {
    id: 7,
    title: "چۆنیەتی بەکارهێنانی ئامرازەکانی ئەی ئای لە دروستکردنی وێب و پڕۆگرام",
    content: "ئێستا گەشەپێدەران دەتوانن لە ڕێگەی زیرەکی دەستکردەوە کۆدی خاوێن و خێرا بنووسن بە کەمترین کات.",
    date: "پێرێ",
    category: "تەکنەلۆژیا",
    timestamp: Date.now() - 6000
  },
  {
    id: 8,
    title: "بازاڕی کار و هەلی نوێ بۆ گەنجان لە بواری تەکنەلۆژیادا",
    content: "چەندین دەرفەتی کار لە ڕێگەی پلاتفۆرمە ئۆنلاینەکانەوە بۆ گەنجان فەراهەم کراوە لە ناوخۆی وڵات.",
    date: "پێرێ",
    category: "ئابووری",
    timestamp: Date.now() - 7000
  },
  {
    id: 9,
    title: "کۆنفڕانسی نێودەوڵەتی بۆ پەرەپێدانی پڕۆژە دیجیتالییەکان بەڕێوە دەچێت",
    content: "چەندین شارەزا لە بواری تەکنەلۆژیا کۆبوونەوە بۆ تاوتوێکردنی داهاتووی پلاتفۆرمە کوردییەکان.",
    date: "پێنچ ڕۆژ لەمەوبەر",
    category: "تەکنەلۆژیا",
    timestamp: Date.now() - 8000
  },
  {
    id: 10,
    title: "دەستپێکی خولی نوێی تۆپی پێی ناوخۆیی بە بەشداری تیپە بەناوبانگەکان",
    content: "رکابەرییەکی توند لە نێوان یانەکاندا دەستی پێکرد و هاندەرانێکی زۆر ڕوویان لە یاریگاکان کرد.",
    date: "هەفتەی پێشوو",
    category: "وەرزشی",
    timestamp: Date.now() - 9000
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
