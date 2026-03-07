const { Scenes } = require('telegraf');
const Task = require('../models/Task');

const setReminderScene = new Scenes.WizardScene(
    'SET_REMINDER_SCENE',
    (ctx) => {
        ctx.reply('What subject do you want to study?');
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            ctx.reply('Please provide a valid subject text.');
            return;
        }
        ctx.wizard.state.subject = ctx.message.text;
        ctx.reply('At what time? (Example: 19:00)');
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            ctx.reply('Please provide a valid time.');
            return;
        }
        let timeInput = ctx.message.text.trim();

        // Basic time validation
        const timeRegex = /^([01]?[0-9]|2[0-3]):?([0-5][0-9])$/;
        if (!timeRegex.test(timeInput)) {
            ctx.reply('Invalid time format. Please use HH:MM (e.g., 19:00). At what time?');
            return;
        }

        // Format to HH:MM if user wrote e.g. 1900
        if (!timeInput.includes(':')) {
            timeInput = timeInput.slice(0, -2) + ':' + timeInput.slice(-2);
        }

        ctx.wizard.state.time = timeInput;

        // Save to database
        try {
            const newTask = new Task({
                userId: ctx.from.id.toString(),
                title: ctx.wizard.state.subject,
                time: ctx.wizard.state.time,
                completed: false
            });
            await newTask.save();
            ctx.reply(`Reminder Set! I'll notify you at ${ctx.wizard.state.time}.`);
        } catch (error) {
            console.error('Error saving task:', error);
            ctx.reply('Sorry, there was an error saving your reminder. Please try again.');
        }

        return ctx.scene.leave();
    }
);

module.exports = setReminderScene;
