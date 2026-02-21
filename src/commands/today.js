const taskService = require('../services/taskService');

module.exports = (bot) => {
    bot.command('today', async (ctx) => {
        try {
            const tasks = await taskService.getTodayTasks(ctx.from.id.toString());
            if (tasks.length === 0) {
                return ctx.reply('No tasks scheduled for today yet. Use /add to create one!');
            }

            let response = '📅 *Today\'s Schedule:*\n\n';
            tasks.forEach((task, index) => {
                const status = task.completed ? '✅' : '⏳';
                response += `${status} *${task.title}* - ${task.time}\n`;
            });

            ctx.replyWithMarkdown(response);
        } catch (error) {
            console.error(error);
            ctx.reply('Failed to fetch today\'s tasks.');
        }
    });
};
