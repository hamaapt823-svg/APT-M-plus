const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Parser = require('rss-parser');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const parser = new Parser();

// Gemini API Configuration - کلیدەکەی خۆت لێرە دابنێ
const ai = new GoogleGenAI({ apiKey: "AIzaSy_YOUR_GEMINI_API_KEY_HERE" });

// سەرچاوەکانی هەواڵ (RSS Feeds)
const newsSources = [
  'https://www.awene.com/rss',
  'https://www.rudaw.net/sorani/rss'
];

let processedLinks = new Set();

wss.on('connection', (ws) => {
  console.log('کۆڵبەرێکی نوێ پەیوەست بوو');
});

function broadcastNews(newsData) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newsData));
    }
  });
}

// فەنکشنی پوختەکردن بە Gemini AI
async function processWithAI(title, content) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ئەم هەواڵەی خوارەوە بە زمانی کوردی سۆرانی لە یەک ڕستەی کورتی زانیاریبەخشدا پوخت بکەرەوە:\nنیشانە: ${title}\nدەق: ${content}`,
    });
    return response.text.trim();
  } catch (err) {
    return title;
  }
}

// پشکنینی ڕاستەوخۆی سەرچاوەکان
async function fetchLatestNews() {
  for (const url of newsSources) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items.slice(0, 3)) {
        if (!processedLinks.has(item.link)) {
          processedLinks.add(item.link);

          const summary = await processWithAI(item.title, item.contentSnippet || item.content || "");

          const liveNews = {
            title: item.title,
            summary: summary,
            link: item.link,
            time: new Date().toLocaleTimeString('ckb-IQ')
          };

          broadcastNews(liveNews);
        }
      }
    } catch (e) {
      console.log('کێشە لە وەگرتنی هەواڵ لە:', url);
    }
  }
}

// پشکنین هەموو ٣ چرکەیەک جارێک
setInterval(fetchLatestNews, 3000);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`سێرڤەر چالاک بوو لەسەر پۆڕتی ${PORT}`);
});
