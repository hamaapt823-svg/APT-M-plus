export default function handler(req, res) {
  // ڕێگەدان بە هەموو داواکارییەکان (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // داتای تاقیکاریی هەواڵەکان
  const newsData = [
    { 
      id: 1, 
      title: "پڕۆژەی APT Media سەرکەوتوو بوو", 
      content: "ئێستا ئەپەکە بە تەواوی لەسەر Vercel بڵاوکرایەوە و کێشەی 404 نەماوە.", 
      date: "2026-09-19" 
    },
    { 
      id: 2, 
      title: "چارەسەری کێشەی API", 
      content: "بەستەرەکان ڕێکخرانەوە و ئێستا بە خێرایی هەواڵەکان بار دەکرێن.", 
      date: "2026-09-19" 
    }
  ];

  res.status(200).json({ success: true, data: newsData });
}
