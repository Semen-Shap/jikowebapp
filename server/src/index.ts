import { Telegraf } from 'telegraf';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
dotenv.config(
    { path: path.resolve(__dirname, '../../frontend/.env') }
);

const token = process.env.REACT_APP_TOKEN;

if (!token) {
    throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
