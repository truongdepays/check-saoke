const express = require('express');
const app = express();
const port = 3000;
const { search } = require('./services/search');
const { bot } = require('./services/telegram');

app.get('/', async (req, res) => {
  const result = await search(req.query.q);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});