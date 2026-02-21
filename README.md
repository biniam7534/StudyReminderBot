# StudyReminderBot 🎓

A Telegram bot designed to help students manage their study tasks and stay motivated.

## 🚀 Features
- **Task Management**: Add study tasks with specific reminder times.
- **Daily Schedule**: View tasks scheduled for today.
- **Reminders**: Automatic notifications when it's time to study.
- **Motivation**: Get inspiring quotes on demand.
- **Daily Summaries**: Automatic progress report at 8 PM.

## 🛠 Tech Stack
- **Node.js**: Runtime environment.
- **Telegraf**: Telegram Bot Framework.
- **MongoDB**: Database for storing tasks.
- **node-cron**: For scheduling reminders and summaries.

## 📦 Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your credentials:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   MONGO_URI=mongodb://localhost:27017/studyreminderbot
   ```
4. Start the bot:
   ```bash
   npm start
   ```

## 🤖 Commands
- `/start` - Welcome message and instructions.
- `/add [task] [HH:mm]` - Add a new study task (e.g., `/add Math 18:00`).
- `/tasks` - Show all pending tasks.
- `/done [task]` - Mark a task as completed.
- `/today` - Show today's study schedule.
- `/motivate` - Receive a random motivational quote.
