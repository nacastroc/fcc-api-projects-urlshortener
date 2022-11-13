require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Shortened URLs
const shortenedUrls = []

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res, next) {
  const urlObject = new URL(req.body.url);
  const url = req.body.url;
  dns.lookup(urlObject.hostname, function (error, address, family) {
    if (error) res.json({ error: 'invalid url' })
    if (!shortenedUrls.includes(url))
      shortenedUrls.push(url)
    res.json({ original_url: url, short_url: shortenedUrls.indexOf(url) })
  })
})

app.get('/api/shorturl/:index', function (req, res, next) {
  res.redirect(shortenedUrls[req.params.index])
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
