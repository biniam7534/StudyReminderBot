// Telegram Web App init
const tg = window.Telegram.WebApp;
const submitBtn = document.getElementById('submit-btn');
const statusMsg = document.getElementById('status-message');
const taskList = document.getElementById('task-list');

// Initialize view Based on Telegram User Data
tg.expand();
let telegramUserId = null;

if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    telegramUserId = user.id;
    document.getElementById('username').textContent = user.first_name || 'Student';
    // User avatar might be restricted by privacy but if provided by tg, we can use it
    if (user.photo_url) {
        document.getElementById('user-avatar').src = user.photo_url;
    }
    submitBtn.disabled = false;
    fetchTasks();
} else {
    // For local testing outside Telegram
    document.getElementById('username').textContent = 'Test User';
    telegramUserId = '123456789'; // Fake user ID
    submitBtn.disabled = false;
    fetchTasks();
}

async function fetchTasks() {
    try {
        const response = await fetch(`/api/tasks?userId=${telegramUserId}`);
        const data = await response.json();

        if (data.success && data.tasks && data.tasks.length > 0) {
            taskList.innerHTML = '';
            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="task-info">
                        <span class="title">${task.title}</span>
                        <span class="time">⏰ ${task.time}</span>
                    </div>
                    <div class="task-status"></div>
                `;
                taskList.appendChild(li);
            });
        } else {
            taskList.innerHTML = '<li class="empty-state">No active reminders found.</li>';
        }
    } catch (err) {
        console.error('Error fetching tasks', err);
    }
}

document.getElementById('add-task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const title = document.getElementById('task-title').value;
    const time = document.getElementById('task-time').value;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: telegramUserId,
                title: title,
                time: time
            })
        });

        const result = await response.json();
        if (result.success) {
            statusMsg.textContent = 'Task added successfully! The bot will remind you.';
            statusMsg.className = 'status success';
            document.getElementById('task-title').value = '';
            document.getElementById('task-time').value = '';

            // Provide Haptic feedback
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
            fetchTasks();
        } else {
            statusMsg.textContent = 'Error adding task: ' + (result.message || 'Unknown error');
            statusMsg.className = 'status error';
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('error');
            }
        }
    } catch (err) {
        statusMsg.textContent = 'Network error. Try again later.';
        statusMsg.className = 'status error';
    } finally {
        statusMsg.classList.remove('hidden');
        submitBtn.disabled = false;

        setTimeout(() => {
            statusMsg.classList.add('hidden');
        }, 5000);
    }
});
