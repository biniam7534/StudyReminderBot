module.exports = (bot) => {
    bot.on('text', (ctx) => {
        const text = ctx.message.text.toLowerCase();

        // Check if the text is a command that was misspelled or not recognized
        if (text.startsWith('/')) {
            return ctx.reply("Sorry, I didn't recognize that command. Type /start to see available commands.");
        }

        // Basic Auto-Reply Logic for Questions/Phrases
        if (text.includes('hello') || text.includes('hi')) {
            return ctx.reply("Hello there! 👋 I'm StudyReminderBot. How can I help you study today?");
        } else if (text.includes('how are you')) {
            return ctx.reply("I'm just a bot, but I'm ready and excited to help you manage your study tasks! 🚀");
        } else if (text.includes('what can you do') || text.includes('help')) {
            return ctx.reply(
                "I can help you schedule and manage study tasks, remind you of your tasks, and keep you motivated! 📚\n\n" +
                "Try sending me:\n" +
                "/add Study Math 15:30\n" +
                "/tasks\n" +
                "/motivate"
            );
        } else if (text.includes('thank you') || text.includes('thanks')) {
            return ctx.reply("You're welcome! Keep up the great studying work. 💪");
        } else if (text.includes('?')) {
            return ctx.reply("That's a great question! While I don't know the exact answer to everything yet, I can definitely help you organize your time to study for it! 🤓 Have you tried adding a study task for this topic?");
        } else {
            // General fallback response
            return ctx.reply(
                "I received your message! If you're trying to give me a command, make sure to use a forward slash like /add or /tasks.\n\n" +
                "For more information, type /start to see what I can do!"
            );
        }
    });
};
