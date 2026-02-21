const cron = require('node-cron');
const Task = require('../models/Task');

const initReminderService = (bot) => {
    // Check every minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        try {
            const tasksToNotify = await Task.find({
                time: currentTime,
                completed: false,
                notified: false
            });

            for (const task of tasksToNotify) {
                await bot.telegram.sendMessage(task.userId, `⏰ REMINDER: It's time to study: *${task.title}*!`, { parse_mode: 'Markdown' });
                task.notified = true;
                await task.save();
            }
        } catch (error) {
            console.error('Error in reminder service:', error);
        }
    });

    // Daily summary at 8 PM
    cron.schedule('0 20 * * *', async () => {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            // Find all unique users who have any pending tasks or completed tasks today
            const users = await Task.distinct('userId');
            for (const userId of users) {
                try {
                    const stats = await Task.aggregate([
                        {
                            $match: {
                                userId,
                                $or: [
                                    { completed: false },
                                    { completed: true, updatedAt: { $gte: startOfDay } }
                                ]
                            }
                        },
                        { $group: { _id: '$completed', count: { $sum: 1 } } }
                    ]);

                    let completed = 0;
                    let pending = 0;
                    stats.forEach(s => {
                        if (s._id === true) completed = s.count;
                        if (s._id === false) pending = s.count;
                    });

                    if (completed > 0 || pending > 0) {
                        await bot.telegram.sendMessage(userId, `📊 *Daily Study Summary*\nTasks completed today: ${completed}\nRemaining tasks: ${pending}\nKeep up the hard work! 💪`, { parse_mode: 'Markdown' });
                    }
                } catch (userError) {
                    console.error(`Error sending summary to user ${userId}:`, userError.message);
                }
            }
        } catch (error) {
            console.error('Error in daily summary service:', error);
        }
    });
};

module.exports = initReminderService;
