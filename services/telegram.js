const TelegramBot = require('node-telegram-bot-api');
const { search } = require('../services/search');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: true,
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Hello, welcome to the bot! Please send your search query after press enter');
  } else {
    const result = await search(messageText);
    let message = '';
    if (result.length === 0) {
      message = 'No results found';
    } else {
      result.forEach((item) => {
        message += `${item.date}\n<b>${item.balance}</b>\n${item.description}\n\n`;
      });
    }
    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }
});

module.exports = {
  bot,
};