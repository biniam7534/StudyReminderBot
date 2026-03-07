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
    MoreVertical,
    Trash2,
    ToggleLeft,
    ToggleRight,
    ArrowLeft,
    Activity,
    UserCheck,
    AlertCircle
} from 'lucide-react';

const API_BASE_URL = '/api';

// ==========================================
// Stat Card Component
// ==========================================
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="stat-card">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <h3 className="text-3xl font-bold mt-1">{value}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

// ==========================================
// Connection Status Badge
// ==========================================
const ConnectionStatus = ({ connected }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${connected
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
        {connected ? 'API Connected' : 'Disconnected'}
    </div>
);

// ==========================================
// Main App
// ==========================================
function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        totalUsers: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiConnected, setApiConnected] = useState(false);
    const [taskFilter, setTaskFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // ---- Health Check ----
    const checkHealth = async () => {
        try {
            await axios.get(`${API_BASE_URL}/health`);
            setApiConnected(true);
        } catch {
            setApiConnected(false);
        }
    };

    // ---- Fetch Dashboard Data ----
    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
            if (response.data.success) {
                setStats(response.data.stats);
                setRecentTasks(response.data.recentTasks);
            }
            setApiConnected(true);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setApiConnected(false);
        } finally {
            setLoading(false);
        }
    };

    // ---- Fetch All Tasks ----
    const fetchAllTasks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (taskFilter !== 'all') params.status = taskFilter;
            const response = await axios.get(`${API_BASE_URL}/admin/tasks`, { params });
            if (response.data.success) {
                setAllTasks(response.data.tasks);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // ---- Fetch Users ----
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/users`);
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // ---- Admin Actions ----
    const deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/tasks/${taskId}`);
            // Refresh current view
            if (currentPage === 'dashboard') fetchDashboard();
            if (currentPage === 'tasks') fetchAllTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const toggleTask = async (taskId, currentStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}/admin/tasks/${taskId}`, { completed: !currentStatus });
            if (currentPage === 'dashboard') fetchDashboard();
            if (currentPage === 'tasks') fetchAllTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    // ---- Effects ----
    useEffect(() => {
        checkHealth();
        fetchDashboard();
        const interval = setInterval(() => {
            if (currentPage === 'dashboard') fetchDashboard();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentPage === 'tasks') fetchAllTasks();
        if (currentPage === 'users') fetchUsers();
        if (currentPage === 'dashboard') fetchDashboard();
    }, [currentPage, taskFilter]);

    // ---- Filter tasks by search ----
    const filteredRecentTasks = recentTasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userId.includes(searchQuery)
    );

    const filteredAllTasks = allTasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userId.includes(searchQuery)
    );

    // ---- Navigation Items ----
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'tasks', label: 'All Tasks', icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* ============ Sidebar ============ */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col hidden lg:flex">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <ClipboardList className="text-white" size={22} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">StudyBot Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentPage === item.id
                                ? 'bg-indigo-900/40 text-indigo-400'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800 space-y-3">
                    <ConnectionStatus connected={apiConnected} />
                </div>
            </aside>

            {/* ============ Main Content ============ */}
            <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold capitalize">{currentPage === 'dashboard' ? 'Admin Dashboard' : currentPage}</h1>
                        <p className="text-slate-400">
                            {currentPage === 'dashboard' && 'Overview of bot activity and user tasks'}
                            {currentPage === 'users' && 'All registered bot users and their statistics'}
                            {currentPage === 'tasks' && 'Manage all tasks across all users'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks or users..."
                                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all w-full md:w-64"
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (currentPage === 'dashboard') fetchDashboard();
                                if (currentPage === 'tasks') fetchAllTasks();
                                if (currentPage === 'users') fetchUsers();
                            }}
                            className={`p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors ${loading ? 'animate-spin-slow' : ''}`}
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </header>

                {/* ============ Dashboard Page ============ */}
                {currentPage === 'dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-600" />
                            <StatCard title="Total Tasks" value={stats.totalTasks} icon={ClipboardList} color="bg-purple-600" />
                            <StatCard title="Pending" value={stats.pendingTasks} icon={Clock} color="bg-amber-600" />
                            <StatCard title="Completed" value={stats.completedTasks} icon={CheckCircle} color="bg-emerald-600" />
                        </div>

                        {/* Completion Rate */}
                        {stats.totalTasks > 0 && (
                            <div className="glass-card p-6 mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-lg">Completion Rate</h3>
                                    <span className="text-2xl font-bold text-indigo-400">
                                        {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                                        style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Recent Tasks Table */}
                        <section className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Recent Activity</h2>
                                <button
                                    onClick={() => setCurrentPage('tasks')}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                >
                                    View all →
                                </button>
                            </div>
                            <TaskTable
                                tasks={filteredRecentTasks}
                                loading={loading}
                                onDelete={deleteTask}
                                onToggle={toggleTask}
                            />
                        </section>
                    </>
                )}

                {/* ============ All Tasks Page ============ */}
                {currentPage === 'tasks' && (
                    <>
                        {/* Filter Tabs */}
                        <div className="flex gap-2 mb-6">
                            {['all', 'pending', 'completed'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setTaskFilter(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${taskFilter === filter
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <section className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-xl font-bold">
                                    {taskFilter === 'all' ? 'All Tasks' : `${taskFilter.charAt(0).toUpperCase() + taskFilter.slice(1)} Tasks`}
                                    <span className="text-slate-500 text-base ml-2">({filteredAllTasks.length})</span>
                                </h2>
                            </div>
                            <TaskTable
                                tasks={filteredAllTasks}
                                loading={loading}
                                onDelete={deleteTask}
                                onToggle={toggleTask}
                            />
                        </section>
                    </>
                )}

                {/* ============ Users Page ============ */}
                {currentPage === 'users' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full py-20 text-center text-slate-500">Loading users...</div>
                        ) : users.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-500">
                                <Users size={48} className="mx-auto mb-4 text-slate-700" />
                                <p className="text-lg font-medium">No users yet</p>
                                <p className="text-sm">Users will appear once they interact with the bot</p>
                            </div>
                        ) : (
                            users
                                .filter(u => u.userId.includes(searchQuery))
                                .map(user => (
                                    <div key={user.userId} className="glass-card p-6 hover:bg-slate-800/60 transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
                                                <UserCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">User {user.userId}</p>
                                                <p className="text-xs text-slate-500">
                                                    Telegram ID: {user.userId}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                                                <p className="text-lg font-bold">{user.totalTasks}</p>
                                                <p className="text-xs text-slate-500">Total</p>
                                            </div>
                                            <div className="text-center p-3 bg-emerald-500/10 rounded-xl">
                                                <p className="text-lg font-bold text-emerald-400">{user.completed}</p>
                                                <p className="text-xs text-slate-500">Done</p>
                                            </div>
                                            <div className="text-center p-3 bg-amber-500/10 rounded-xl">
                                                <p className="text-lg font-bold text-amber-400">{user.pending}</p>
                                                <p className="text-xs text-slate-500">Pending</p>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${user.totalTasks > 0 ? (user.completed / user.totalTasks) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {user.lastActive && `Last active: ${new Date(user.lastActive).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

// ==========================================
// Reusable Task Table Component
// ==========================================
function TaskTable({ tasks, loading, onDelete, onToggle }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800">
                        <th className="px-6 py-4 text-sm font-semibold text-slate-400">Task Title</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-400">User ID</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-400">Scheduled</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-400">Created</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                                Loading...
                            </td>
                        </tr>
                    ) : tasks.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                <AlertCircle className="mx-auto mb-2" size={24} />
                                No tasks found.
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task._id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 font-medium">{task.title}</td>
                                <td className="px-6 py-4 text-slate-400 text-sm font-mono">{task.userId}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-2 text-sm">
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
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onToggle(task._id, task.completed)}
                                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                            title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                                        >
                                            {task.completed
                                                ? <ToggleRight size={18} className="text-emerald-400" />
                                                : <ToggleLeft size={18} className="text-slate-500" />
                                            }
                                        </button>
                                        <button
                                            onClick={() => onDelete(task._id)}
                                            className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Delete task"
                                        >
                                            <Trash2 size={18} className="text-red-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default App;
