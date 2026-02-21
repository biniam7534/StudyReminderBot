module.exports = (bot) => {
    bot.start((ctx) => {
        ctx.replyWithMarkdown(
            `📚 *Welcome to StudyReminderBot!*\n\n` +
            `I'm here to help you stay on track with your studies.\n\n` +
            `*Commands:*\n` +
            `/add [task] [HH:mm] - Add a new study task\n` +
            `/tasks - Show all pending tasks\n` +
            `/done [task] - Mark a task as completed\n` +
            `/today - Show today's tasks\n` +
            `/motivate - Get a motivational quote\n\n` +
            `Example: \`/add Math 18:00\``
        );
    });
};
