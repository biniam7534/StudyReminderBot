const taskService = require('../services/taskService');

module.exports = (bot) => {
    bot.command('tasks', async (ctx) => {
        try {
            const tasks = await taskService.getPendingTasks(ctx.from.id.toString());
            if (tasks.length === 0) {
                return ctx.reply('You have no pending tasks! Great job! 🎉');
            }

            let response = '📋 *Your Pending Tasks:*\n\n';
            tasks.forEach((task, index) => {
                response += `${index + 1}. *${task.title}* - ${task.time}\n`;
            });

            ctx.replyWithMarkdown(response);
        } catch (error) {
            console.error(error);
            ctx.reply('Failed to fetch tasks.');
        }
    });
};
