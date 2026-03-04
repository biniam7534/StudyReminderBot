import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    CheckCircle,
    Clock,
    ClipboardList,
    RefreshCw,
    LayoutDashboard,
    Search,
    Bell,
    Settings,
    MoreVertical
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <h3 className="text-3xl font-bold mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

function App() {
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        totalUsers: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
            if (response.data.success) {
                setStats(response.data.stats);
                setRecentTasks(response.data.recentTasks);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col hidden lg:flex">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                        <ClipboardList className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">StudyBot Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary-900/40 text-primary-400 rounded-xl font-medium">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-slate-200 rounded-xl font-medium transition-colors">
                        <Users size={20} />
                        Users
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-slate-200 rounded-xl font-medium transition-colors">
                        <ClipboardList size={20} />
                        All Tasks
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-slate-200 rounded-xl font-medium transition-colors">
                        <Bell size={20} />
                        Notifications
                    </a>
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-slate-200 rounded-xl font-medium transition-colors">
                        <Settings size={20} />
                        Settings
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-slate-400">Overview of bot activity and user tasks</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all w-full md:w-64"
                            />
                        </div>
                        <button
                            onClick={fetchData}
                            className={`p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors ${loading ? 'animate-spin-slow' : ''}`}
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={Users}
                        color="bg-blue-600"
                    />
                    <StatCard
                        title="Total Tasks"
                        value={stats.totalTasks}
                        icon={ClipboardList}
                        color="bg-purple-600"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pendingTasks}
                        icon={Clock}
                        color="bg-amber-600"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedTasks}
                        icon={CheckCircle}
                        color="bg-emerald-600"
                    />
                </div>

                {/* Recent Tasks */}
                <section className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">View all</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-800">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Task Title</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">User ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Scheduled Time</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Created</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentTasks.map((task) => (
                                    <tr key={task._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium">{task.title}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{task.userId}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-500" />
                                                {task.time}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.completed
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {task.completed ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreVertical size={18} className="text-slate-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && recentTasks.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No tasks found in the database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
