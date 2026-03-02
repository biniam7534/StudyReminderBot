require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const connectDB = require('./config/db');
const initReminderService = require('./services/reminderService');

// ==========================================
// 1. Environment & Config Validation
// ==========================================
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN || BOT_TOKEN === 'your_telegram_bot_token_here') {
    console.error('❌ [FATAL ERROR]: BOT_TOKEN is missing or invalid in the .env file.');
    console.error('👉 Please get a valid token from @BotFather on Telegram and update your .env file.');
    process.exit(1);
}

// ==========================================
// 2. Initialize Bot Instance
// ==========================================
const bot = new Telegraf(BOT_TOKEN);

// ==========================================
// 3. Global Middleware
// ==========================================
// Session management (useful for multi-step conversations)
bot.use(session());

// Request logging middleware for debugging and analytics
bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    if (ctx.message && ctx.message.text) {
        console.log(`[LOG] 📩 Received: "${ctx.message.text}" from @${ctx.from?.username || 'user'} | ⏱️ ${ms}ms`);
    } else if (ctx.callbackQuery) {
        console.log(`[LOG] 🖱️ Clicked: "${ctx.callbackQuery.data}" by @${ctx.from?.username || 'user'} | ⏱️ ${ms}ms`);
    }
});

// ==========================================
// 4. Command Registration
// ==========================================
/**
 * Register all bot commands and actions.
 * Separating logic into modular files ensures clean architecture.
 */
const registerCommands = () => {
    try {
        require('./commands/start')(bot);
        require('./commands/add')(bot);
        require('./commands/tasks')(bot);
        require('./commands/done')(bot);
        require('./commands/today')(bot);
        require('./commands/motivate')(bot);
        console.log('✅ All bot commands loaded successfully.');
    } catch (err) {
        console.error('❌ [ERROR] Failed to load commands:', err.message);
    }
};

// ==========================================
// 5. App Initialization & Bootstrapping
// ==========================================
const startApp = async () => {
    try {
        console.log('⏳ Bootstrapping StudyReminderBot...');

        // Connect to MongoDB
        await connectDB();
        console.log('✅ Database connection established.');

        // Initialize cron jobs and scheduled reminders
        initReminderService(bot);
        console.log('✅ Reminder service initialized.');

        // Load commands
        registerCommands();

        // Launch Telegram polling
        await bot.launch();
        console.log('\n🚀 ========================================== 🚀');
        console.log('   StudyReminderBot is officially ONLINE!');
        console.log('   Listening for events and reminders...');
        console.log('🚀 ========================================== 🚀\n');

    } catch (err) {
        console.error('❌ [CRITICAL ERROR] Failed to start application:', err.message);
        if (err.message.includes('401')) {
            console.error('👉 Hint: Check if your BOT_TOKEN is valid and active.');
        }
        process.exit(1);
    }
};

// ==========================================
// 6. Global Error Handling
// ==========================================
bot.catch((err, ctx) => {
    console.error(`❌ [TELEGRAF ERROR] for update ${ctx.update.update_id}:`, err);
    // Optionally alert admins here
});

// ==========================================
// 7. Graceful Shutdown Management
// ==========================================
const stopBot = (signal) => {
    console.log(`\n🛑 [SHUTDOWN] Received ${signal}. Stopping bot gracefully...`);
    bot.stop(signal);
    process.exit(0);
};

process.once('SIGINT', () => stopBot('SIGINT'));
process.once('SIGTERM', () => stopBot('SIGTERM'));

// Ignite the application!
startApp();
