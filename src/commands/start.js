const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.start((ctx) => {
        ctx.reply(
            `Welcome to Study Reminder Bot!\nUse /setreminder to schedule your study time.`,
            Markup.keyboard([
                ['⏰ Set Reminder', '📅 Study Plan', '💡 Motivation']
            ]).resize()
        );
    });

    bot.command('setreminder', (ctx) => {
        ctx.scene.enter('SET_REMINDER_SCENE');
    });

    bot.hears('⏰ Set Reminder', (ctx) => {
        ctx.scene.enter('SET_REMINDER_SCENE');
    });

    bot.hears('📅 Study Plan', (ctx, next) => next());
    bot.hears('💡 Motivation', (ctx, next) => next());
};
