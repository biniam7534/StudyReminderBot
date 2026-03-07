const taskService = require('../services/taskService');

module.exports = (bot) => {
    const todayHandler = async (ctx) => {
        try {
            const tasks = await taskService.getTodayTasks(ctx.from.id.toString());
            if (tasks.length === 0) {
                return ctx.reply('No tasks scheduled for today yet. Use /add to create one!');
            }

            let response = '*Today\'s Study Plan:*\n';

            tasks.forEach((task, index) => {
                // Convert 24hr time (e.g., "14:00") to 12hr time (e.g., "2:00 PM")
                let [hours, minutes] = task.time.split(':');
                hours = parseInt(hours, 10);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                const formattedTime = `${hours}:${minutes} ${ampm}`;

                response += `${index + 1}. ${task.title} — ${formattedTime}\n`;
            });

            ctx.replyWithMarkdown(response);
        } catch (error) {
            console.error(error);
            ctx.reply('Failed to fetch today\'s tasks.');
        }
    };

    bot.command('today', todayHandler);
    bot.hears('📅 Study Plan', todayHandler);
};
