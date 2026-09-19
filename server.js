const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();
app.use(cors()); // ڕێگریکردن لە کێشەی CORS

// سەرچاوەکانی هەواڵ (دەتوانی سۆرسی زیاتریش بنووسیت)
const sources = [
    { category: 'ناوخۆیی', url: 'https://www.rudaw.net/sorani/kurdistan/rss' },
    { category: 'وەرزشی', url: 'https://www.rudaw.net/sorani/sports/rss' },
    { category: 'ئابووری', url: 'https://www.rudaw.net/sorani/business/rss' },
    { category: 'گشتی', url: 'https://www.rudaw.net/sorani/rss' }
];

let liveNewsDatabase = [];

// فەنکشن بۆ هێنانی هەواڵە نوێیەکان لە سەرچاوەکانەوە
async function fetchNewsFromSources() {
    let newArticles = [];
    for (let source of sources) {
        try {
            let feed = await parser.parseURL(source.url);
            feed.items.forEach(item => {
                newArticles.push({
                    id: item.guid || item.link,
                    title: item.title,
                    category: source.category,
                    link: item.link,
                    time: new Date(item.pubDate).toLocaleTimeString('ckb', {hour: '2-digit', minute:'2-digit'}),
                    publisher: 'APT Media Bot',
                    image: item.enclosure ? item.enclosure.url : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'
                });
            });
        } catch (err) {
            console.log("خەتا لە هێنانی هەواڵی: " + source.category);
        }
    }
    
    if(newArticles.length > 0) {
        liveNewsDatabase = newArticles;
        console.log(`[${new Date().toLocaleTimeString()}] هەواڵەکان بە سەرکەوتوویی نوێکرانەوە!`);
    }
}

// هەر ٣٠ چڕکە جارێک بە شێوەی ئۆتۆماتیکی هەواڵی نوێ دەهێنێت
setInterval(fetchNewsFromSources, 30000);
fetchNewsFromSources(); // یەکەمجار دەستپێکردن

// API Endpoint بۆ ئەوەی ڕووکارەکە (HTML) هەواڵەکانی لێ ببات
app.get('/api/news', (req, res) => {
    res.json(liveNewsDatabase);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`سێرڤەر لەسەر پۆرت کار دەکات: ${PORT}`));
