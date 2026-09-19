const express = require('express');
const cors = require('cors');
const newsHandler = require('./api/news');

const app = express();
app.use(cors());

app.get('/api/news', newsHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`سێرڤەر کار دەکات لەسەر پۆرت: ${PORT}`));
