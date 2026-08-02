# StudyReminderBot

StudyReminderBot is a Telegram study assistant that helps students manage study tasks, schedule reminder notifications, and stay motivated with quotes. It also includes a simple Express API for task management and a frontend/admin dashboard structure.

## Features

- Add study tasks with time-based reminders
- View pending tasks and today's study plan
- Mark tasks as completed
- Receive scheduled reminders and daily summaries
- Get motivational quotes on demand
- Express API for task CRUD operations
- Frontend and admin dashboard folders for web-based interfaces

## Tech Stack

- Node.js
- Telegraf (Telegram bot framework)
- Express
- MongoDB / Mongoose
- node-cron
- Axios
- Vite + React (frontend and admin-dashboard)

## Repository Structure

- `index.js` - Root app entry point that starts the bot and Express server
- `src/bot.js` - Main bot setup, command registration, and server bootstrap
- `src/commands/` - Telegram bot command handlers
- `src/scenes/` - Wizard scene for reminder setup
- `src/services/` - Task and reminder service logic
- `src/models/Task.js` - Mongoose task schema
- `src/config/db.js` - MongoDB connection helper
- `frontend/` - React frontend app
- `admin-dashboard/` - React admin dashboard app

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB instance available
- Telegram bot token from BotFather

### Install Dependencies

From the repository root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install admin dashboard dependencies:

```bash
cd ../admin-dashboard
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```env
BOT_TOKEN=your_telegram_bot_token_here
MONGO_URI=mongodb://localhost:27017/studyreminderbot
PORT=3000
```

### Run the App

From the repository root:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The Telegram bot will start polling, and the Express server will listen on `http://localhost:3000` by default.

## Bot Commands

- `/start` - Shows welcome message and quick action keyboard
- `/setreminder` - Start a guided reminder creation flow
- `/add <title> <HH:mm>` - Add a task with a scheduled time
- `/tasks` - List pending tasks
- `/done <title>` - Mark a task as completed
- `/today` - Show today’s study plan
- `/motivate` - Send a motivational quote

Also supports quick button replies:

- `⏰ Set Reminder`
- `📅 Study Plan`
- `💡 Motivation`

## API Endpoints

The app exposes a task API under `/api`.

- `GET /api/tasks?userId=<id>` - Get pending tasks for a user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update task completion status
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/admin/dashboard` - Admin stats and recent tasks

## Reminder Behavior

- Reminder scheduler checks tasks every minute and notifies users at the matching time
- Tasks are marked with `notified: true` after sending
- A daily summary is sent at 8:00 PM with completed and remaining task counts

## Frontend and Admin Dashboard

The `frontend/` and `admin-dashboard/` directories contain Vite-based React apps. They require separate install and run steps.

Example commands:

```bash
cd frontend
npm run dev
```

```bash
cd admin-dashboard
npm run dev
```

The root Express server serves static content from `frontend` when built.

## Notes

- The bot stores tasks in MongoDB with fields for user, title, time, completion, and notification status
- The reminder service is implemented in `src/services/reminderService.js`
- Use the Telegram username or user ID as the `userId` in API requests

## License

This project is licensed under ISC.
