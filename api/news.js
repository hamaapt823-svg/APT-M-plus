module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // هەواڵی ڕاستەقینە و ئامادەکراو بۆ پڕۆژەی APT Media
  const newsData = [
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
    },
    {
      id: 4,
      title: "پەرەپێدانی زیاتری خزمەتگوزارییە ئۆنلاینەکان",
      content: "بڕیارە لە ئاییندەیەکی نزیکدا چەندین بەشی نوێ بۆ ئاسانکاری بەکارهێنەران زیاد بکرێن.",
      date: "دوێنێ",
      category: "گشتی"
    }
  ];

  res.status(200).json({ data: newsData });
};
