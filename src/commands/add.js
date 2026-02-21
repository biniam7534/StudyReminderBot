const taskService = require('../services/taskService');

module.exports = (bot) => {
    bot.command('add', async (ctx) => {
        const input = ctx.message.text.split(' ').slice(1);
        if (input.length < 2) {
            return ctx.reply('Please provide both task title and time. Example: /add Math 18:00');
        }

        const time = input.pop(); // Last element should be time
        const title = input.join(' '); // Everything else is the title

        // Basic time validation (HH:mm)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            return ctx.reply('Invalid time format. Please use HH:mm (e.g., 18:00)');
        }

        try {
            await taskService.addTask(ctx.from.id.toString(), title, time);
            ctx.reply(`✅ Task added: *${title}* at *${time}*`, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error(error);
            ctx.reply('Failed to add task. Please try again.');
        }
    });
};
