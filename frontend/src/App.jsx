import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Search,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const API_BASE = '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('studyUserId') || '');
  const [isLogged, setIsLogged] = useState(!!userId);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/tasks?userId=${userId}`);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogged) {
      fetchTasks();
      localStorage.setItem('studyUserId', userId);
    }
  }, [isLogged]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle || !newTime) return;

    try {
      const res = await axios.post(`${API_BASE}/tasks`, {
        userId,
        title: newTitle,
        time: newTime
      });
      if (res.data.success) {
        setTasks([...tasks, res.data.task]);
        setNewTitle('');
        setNewTime('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const res = await axios.patch(`${API_BASE}/tasks/${taskId}`, {
        completed: !currentStatus
      });
      if (res.data.success) {
        setTasks(tasks.map(t => t._id === taskId ? res.data.task : t));
        if (!currentStatus) {
          // If we just completed it, maybe refresh to filter it out if you only want pending
          // For now let's keep it in list
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await axios.delete(`${API_BASE}/tasks/${taskId}`);
      if (res.data.success) {
        setTasks(tasks.filter(t => t._id !== taskId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLogged) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-indigo-50">
        <div className="w-full max-w-md glass-panel p-10 animate-slide-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <GraduationCap size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-center mb-8">Enter your Telegram ID to access your study reminders.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1">Telegram User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setIsLogged(true)}
              disabled={!userId}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              Get Started
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">
            Don't know your ID? Find it in the Bot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">StudyBot</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 text-slate-500 text-sm">
            <Search size={16} />
            <input type="text" placeholder="Search tasks..." className="bg-transparent outline-none w-32 focus:w-48 transition-all" />
          </div>
          <button
            onClick={() => { setIsLogged(false); setUserId(''); localStorage.removeItem('studyUserId'); }}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Switch Account
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2">My Study List</h2>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                <Calendar size={14} />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-sm">{tasks.filter(t => !t.completed).length} pending tasks</span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="stat-pill">
              <span className="bg-emerald-500 w-2 h-2 rounded-full inline-block mr-2"></span>
              75% Progress
            </div>
          </div>
        </header>

        {/* Add Task Form */}
        <section className="glass-panel p-6 mb-10 border-indigo-100 bg-indigo-50/30">
          <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What are we studying today?"
                className="w-full px-5 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
            <div className="w-full md:w-40 flex items-center bg-white rounded-xl border border-slate-200 px-4">
              <Clock size={18} className="text-slate-400 mr-2" />
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="HH:mm"
                className="w-full py-3 outline-none text-sm"
              />
            </div>
            <button type="submit" className="btn-primary py-3 flex items-center justify-center gap-2">
              <Plus size={20} />
              Add Task
            </button>
          </form>
        </section>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading your schedule...</div>
          ) : tasks.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <ClipboardList size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No study tasks yet</h3>
              <p className="text-slate-400 max-w-xs mt-2">Add your first task above or via the Telegram bot!</p>
            </div>
          ) : (
            tasks.sort((a, b) => a.completed - b.completed).map((task) => (
              <div key={task._id} className={`task-card group ${task.completed ? 'opacity-50' : ''} animate-slide-in`}>
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleTask(task._id, task.completed)}
                    className={`transition-colors flex-shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-600'}`}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex flex-col">
                    <span className={`font-bold text-lg leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      At {task.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <style>{`
        .stat-pill {
          @apply px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-bold shadow-sm flex items-center;
        }
      `}</style>
    </div>
  );
}

export default App;
