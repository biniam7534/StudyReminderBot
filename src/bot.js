require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const initReminderService = require('./services/reminderService');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/tasks', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
        const tasks = await Task.find({ userId, completed: false }).sort({ time: 1 });
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { userId, title, time } = req.body;
        if (!userId || !title || !time) return res.status(400).json({ success: false, message: 'Missing fields' });
        const newTask = new Task({ userId, title, time });
        await newTask.save();
        res.json({ success: true, task: newTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ success: true, message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin API endpoints
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ completed: false });
        const completedTasks = await Task.countDocuments({ completed: true });

        // Group by userId to get total users
        const users = await Task.distinct('userId');
        const totalUsers = users.length;

        // Get recent tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            stats: {
                totalTasks,
                pendingTasks,
                completedTasks,
                totalUsers
            },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

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

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🌍 Express dashboard server running on http://localhost:${PORT}`);
        });

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
