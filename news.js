// گەنجینەی کاتی بۆ هەواڵەکان (دەتوانرێت ببەسترێتەوە بە داتابەیس لە داهاتوودا)
let newsData = [
  {
    id: 1,
    title: "سەرکەوتنی گەورەی پڕۆژەی APT Media لەسەر Vercel",
    content: "پڕۆژەی نوێی APT Media بە سەرکەوتوویی کەوتە کار و ئێستا بە شێوازێکی خێرا و مۆدێرن بەردەستە.",
    date: "ئەمڕۆ - 11:40",
    category: "ناوخۆیی"
  },
  {
    id: 2,
    title: "چارەسەرکردنی کێشەکانی API و خێرایی پڕۆژەکان",
    content: "تیمەکان توانویانە کێشەکانی پەیوەندیکردن و هێنانی زانیارییەکان لە ڕێگەی سێرڤەری لایڤەوە چاک بکەن.",
    date: "ئەمڕۆ - 10:15",
    category: "تەکنەلۆژیا"
  },
  {
    id: 3,
    title: "دەستپێکردنی خولی نوێی چالاکییە وەرزشییەکان",
    content: "پاڵەوانێتییە وەرزشییەکان بۆ ئەم ساڵ دەست پێ دەکەن و ڕکابەرییەکی بەهێز لە نێوان تیپەکاندا دەبێت.",
    date: "دوێنێ",
    category: "وەرزشی"
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ئەگەر ئەی ئای یاخود بۆت هەواڵی نوێی نارد (لە ڕێگەی POST)
  if (req.method === 'POST') {
    try {
      const { title, content, category, date } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ success: false, error: 'ناونیشان و ناوەڕۆک پێویستن' });
      }

      const newNews = {
        id: Date.now(),
        title,
        content,
        category: category || 'گشتی',
        date: date || 'ئەمڕۆ'
      };

      // خستنە ناوەوەی هەواڵە نوێیەکە بۆ سەرەتای لیستەکە (وەک فەیسبووک)
      newsData.unshift(newNews);

      return res.status(200).json({ success: true, message: 'هەواڵەکە بە سەرکەوتوویی زیاد کرا', data: newNews });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ناردنی هەواڵەکان بۆ ڕووکار (GET)
  return res.status(200).json({ success: true, data: newsData });
}
