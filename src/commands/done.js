const taskService = require('../services/taskService');

module.exports = (bot) => {
    bot.command('done', async (ctx) => {
        const title = ctx.message.text.split(' ').slice(1).join(' ');
        if (!title) {
            return ctx.reply('Please specify the task title. Example: /done Math');
        }

        try {
            const task = await taskService.markAsDone(ctx.from.id.toString(), title);
            if (!task) {
                return ctx.reply(`Could not find a pending task named "${title}".`);
            }
            ctx.reply(`✅ Marked as completed: *${task.title}*!`, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error(error);
            ctx.reply('Failed to update task.');
        }
    });
};
