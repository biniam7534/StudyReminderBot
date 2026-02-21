const Task = require('../models/Task');

const taskService = {
    async addTask(userId, title, time) {
        const newTask = new Task({
            userId,
            title,
            time,
        });
        return await newTask.save();
    },

    async getPendingTasks(userId) {
        return await Task.find({ userId, completed: false }).sort({ time: 1 });
    },

    async getTodayTasks(userId) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        // Shows all pending tasks OR tasks completed today
        return await Task.find({
            userId,
            $or: [
                { completed: false },
                { completed: true, updatedAt: { $gte: start } }
            ]
        }).sort({ time: 1 });
    },

    async markAsDone(userId, taskTitle) {
        return await Task.findOneAndUpdate(
            { userId, title: new RegExp(`^${taskTitle}$`, 'i'), completed: false },
            { completed: true },
            { new: true }
        );
    },

    async getStats(userId) {
        const completed = await Task.countDocuments({ userId, completed: true });
        const pending = await Task.countDocuments({ userId, completed: false });
        return { completed, pending };
    }
};

module.exports = taskService;
