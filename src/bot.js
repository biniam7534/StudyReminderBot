const { Telegraf } = require('telegraf');
const connectDB = require('./config/db');
const initReminderService = require('./services/reminderService');
require('dotenv').config();

if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN === 'your_telegram_bot_token_here') {
    console.error('Error: BOT_TOKEN is missing or not set in .env file.');
    console.log('Please get a token from @BotFather and add it to your .env file.');
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to Database
connectDB();

// Load Commands
require('./commands/start')(bot);
require('./commands/add')(bot);
require('./commands/tasks')(bot);
require('./commands/done')(bot);
require('./commands/today')(bot);
require('./commands/motivate')(bot);

// Initialize Reminder Service
initReminderService(bot);

// Error handling for Telegram updates
bot.catch((err, ctx) => {
    console.error(`Telegraf error for ${ctx.updateType}:`, err);
});

// Launch Bot
bot.launch()
    .then(() => {
        console.log('StudyReminderBot is online! 🚀');
    })
    .catch((err) => {
        console.error('Failed to launch StudyReminderBot:', err.message);
        if (err.message.includes('401')) {
            console.error('Check if your BOT_TOKEN is valid.');
        }
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

