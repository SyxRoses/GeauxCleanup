import React, { useState, useEffect } from 'react';
import {
    CloudSun,
    TrendingUp,
    Clock,
    MapPin,
    Plus,
    Megaphone,
    Truck,
    DollarSign,
    ChevronRight,
    MoreHorizontal,
    Bell,
    Search,
    Filter,
    X,
    CheckCircle2,
    Circle,
    AlertCircle,
    MoreVertical,
    Calendar,
    ClipboardList,
    Layout,
    LogOut,
    User,
    Mail,
    Phone,
    Trash2
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { Booking, AdminTask } from '../../types';
import { supabase } from '../../lib/supabase';

interface AdminDashboardProps {
    onBack: () => void;
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onLogout }) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // State for interactivity
    const [isDispatchOpen, setDispatchOpen] = useState(false);
    const [isNewBookingOpen, setNewBookingOpen] = useState(false);
    const [isBroadcastOpen, setBroadcastOpen] = useState(false);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Real Data State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [adminTasks, setAdminTasks] = useState<AdminTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState(0);
    const [activeCrews, setActiveCrews] = useState(8); // Mock for now
    const [userName, setUserName] = useState('Owner');

    // New Task Form State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

    // Drag and Drop State
    const [draggedTask, setDraggedTask] = useState<AdminTask | null>(null);

    useEffect(() => {
        fetchData();
        fetchUser();

        // Real-time Subscriptions
        const unsubscribeTasks = supabaseService.subscribeToTable('admin_tasks', (payload) => {
            if (payload.eventType === 'INSERT') {
                setAdminTasks(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
                setAdminTasks(prev => prev.map(task => task.id === payload.new.id ? payload.new : task));
            } else if (payload.eventType === 'DELETE') {
                setAdminTasks(prev => prev.filter(task => task.id !== payload.old.id));
            }
        });

        const unsubscribeBookings = supabaseService.subscribeToTable('bookings', () => {
            // For bookings, we re-fetch to ensure we get the joined 'services' data
            // which isn't included in the raw realtime payload
            supabaseService.getActiveBookings().then(data => setBookings(data));
        });

        return () => {
            unsubscribeTasks();
            unsubscribeBookings();
        };
    }, []);

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.user_metadata.full_name) {
            setUserName(user.user_metadata.full_name.split(' ')[0]);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsData, tasksData] = await Promise.all([
                supabaseService.getActiveBookings(),
                supabaseService.getAdminTasks()
            ]);

            setBookings(bookingsData);
            setAdminTasks(tasksData);

            // Calculate revenue (simple sum of all active bookings for demo purposes)
            const totalRevenue = bookingsData.reduce((sum, booking) => sum + Number(booking.total_price), 0);
            setRevenue(totalRevenue);

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        if (!newTaskTitle.trim()) return;

        try {
            const newTask = await supabaseService.createAdminTask({
                title: newTaskTitle,
                priority: newTaskPriority,
                status: 'todo'
            });
            setAdminTasks([newTask, ...adminTasks]);
            setNewTaskTitle('');
            setTaskModalOpen(false);
            showToast('Task created successfully');
        } catch (error) {
            console.error('Error creating task:', error);
            showToast('Failed to create task');
        }
    };

    const handleToggleTask = async (task: AdminTask) => {
        try {
            const newStatus = task.status === 'done' ? 'todo' : 'done';
            const updatedTask = await supabaseService.updateAdminTask(task.id, { status: newStatus });
            setAdminTasks(adminTasks.map(t => t.id === task.id ? updatedTask : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await supabaseService.deleteAdminTask(id);
            setAdminTasks(adminTasks.filter(t => t.id !== id));
            showToast('Task deleted');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (task: AdminTask) => {
        setDraggedTask(task);
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow drop
    };

    const handleDrop = async (newStatus: 'todo' | 'in_progress' | 'done') => {
        if (!draggedTask) return;

        try {
            const updatedTask = await supabaseService.updateAdminTask(draggedTask.id, { status: newStatus });
            setAdminTasks(adminTasks.map(t => t.id === draggedTask.id ? updatedTask : t));
            showToast(`Task moved to ${newStatus === 'todo' ? 'To Do' : newStatus === 'in_progress' ? 'In Progress' : 'Done'}`);
        } catch (error) {
            console.error('Error updating task status:', error);
            showToast('Failed to move task');
        }
        setDraggedTask(null);
    };

    const handlePayroll = () => {
        showToast("Payroll report generated successfully. Sent to billing.");
    };

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Filter leads (pending bookings)
    const leads = bookings.filter(b => b.status === 'pending');

    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans p-6 md:p-8 relative">

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up">
                    <div className="bg-zinc-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3">
                        <CheckCircle2 size={18} className="text-green-400" />
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={onBack}>
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Admin<span className="text-gray-400">Panel</span></span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        Exit Dashboard
                    </button>
                    <button onClick={onLogout} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center">
                        <LogOut size={16} className="mr-1" />
                        Sign Out
                    </button>
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm relative cursor-pointer hover:bg-gray-50">
                        <Bell size={16} className="text-gray-600" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-black"></div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto pb-20">

                {/* 1. Welcome Card (Top Left) */}
                <div className="col-span-12 md:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-48 relative overflow-hidden">
                    <div className="z-10">
                        <h1 className="text-2xl font-bold text-zinc-900">Good morning, <br />{userName}.</h1>
                        <p className="text-zinc-500 text-sm mt-2 font-medium">{today}</p>
                    </div>

                    <div className="flex items-center justify-between z-10 border-t border-gray-50 pt-4 mt-2">
                        <div className="flex items-center text-zinc-600 text-sm font-medium">
                            <CloudSun size={18} className="mr-2" />
                            <span>72° Sunny</span>
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Orleans, LA</span>
                    </div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full blur-3xl opacity-60"></div>
                </div>

                {/* 2. Business Pulse Metrics (Top Right) */}
                <div className="col-span-12 md:col-span-8 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm h-48 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-zinc-900 text-lg">Business Pulse</h3>
                        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-8 h-full items-center">
                        <div className="flex flex-col border-r border-gray-50 pr-4">
                            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-1">Total Revenue</span>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-zinc-900">${revenue.toLocaleString()}</span>
                                <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center">
                                    <TrendingUp size={10} className="mr-1" /> +12%
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col border-r border-gray-50 pr-4 pl-4">
                            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-1">Active Crews</span>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-zinc-900">{activeCrews}</span>
                                <span className="text-xl text-zinc-400 font-medium">/12</span>
                            </div>
                        </div>
                        <div className="flex flex-col pl-4">
                            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-1">Pending Leads</span>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-zinc-900">
                                    {leads.length}
                                </span>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Task Board (Kanban) - MOVED TO CENTER LEFT */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm min-h-[420px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-zinc-900 text-lg">Task Board</h3>
                        <div className="flex space-x-2 text-xs font-medium text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">All Priorities</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[320px]">
                        {/* To Do Column */}
                        <div
                            className="bg-gray-50 rounded-xl p-3 flex flex-col transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop('todo')}
                        >
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div> To Do
                            </h4>
                            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                                {adminTasks.filter(t => t.status === 'todo').map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task)}
                                        onDragEnd={handleDragEnd}
                                        className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all ${draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'
                                            }`}
                                    >
                                        <div className={`text-xs font-bold mb-1 ${task.priority === 'high' ? 'text-red-600' : 'text-blue-600'}`}>{task.priority}</div>
                                        <p className="text-sm font-medium text-zinc-800">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div
                            className="bg-gray-50 rounded-xl p-3 flex flex-col transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop('in_progress')}
                        >
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div> In Progress
                            </h4>
                            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                                {adminTasks.filter(t => t.status === 'in_progress').map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task)}
                                        onDragEnd={handleDragEnd}
                                        className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all ${draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'
                                            }`}
                                    >
                                        <div className={`text-xs font-bold mb-1 ${task.priority === 'high' ? 'text-red-600' : 'text-orange-600'}`}>{task.priority}</div>
                                        <p className="text-sm font-medium text-zinc-800">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Done Column */}
                        <div
                            className="bg-gray-50 rounded-xl p-3 flex flex-col transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop('done')}
                        >
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Done
                            </h4>
                            <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                                {adminTasks.filter(t => t.status === 'done').map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task)}
                                        onDragEnd={handleDragEnd}
                                        className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all ${draggedTask?.id === task.id ? 'opacity-30' : 'opacity-60'
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-gray-500 mb-1">{task.priority}</div>
                                        <p className="text-sm font-medium text-zinc-800 line-through">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Live Schedule (Center Right) */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm h-[420px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-zinc-900 text-lg">Live Schedule</h3>
                        <span className="bg-zinc-100 text-zinc-600 text-xs font-bold px-2 py-1 rounded">Today</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center items-center h-full text-gray-400">Loading schedule...</div>
                        ) : bookings.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-400">No bookings scheduled</div>
                        ) : (
                            bookings.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="group flex items-start p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center mr-4 pt-1">
                                        <span className="text-xs font-bold text-zinc-900">{formatTime(booking.scheduled_at)}</span>
                                        <div className="h-full w-px bg-gray-100 my-1 group-last:hidden"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-900">{booking.customer_name || 'Unknown Customer'}</h4>
                                        <div className="text-xs text-zinc-500 mb-2">
                                            {booking.services?.name || 'Cleaning Service'} • {booking.cleaner_id ? 'Assigned' : 'Unassigned'}
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${booking.status === 'in_progress' ? 'bg-green-50 text-green-700' :
                                            booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 mt-2" />
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => setDispatchOpen(true)}
                        className="w-full mt-4 py-2 text-sm font-medium text-zinc-500 hover:text-black border-t border-gray-50 transition-colors"
                    >
                        View Full Dispatch Board
                    </button>
                </div>

                {/* 5. Daily Tasks List - MOVED TO ROW 3 LEFT */}
                <div className="col-span-12 md:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-zinc-900 text-lg">Daily Tasks</h3>
                        <button
                            onClick={() => setTaskModalOpen(true)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                        {adminTasks.filter(t => t.status !== 'done').length === 0 && (
                            <div className="text-center text-gray-400 py-8 text-sm">No pending tasks</div>
                        )}
                        {adminTasks.filter(t => t.status !== 'done').map((task) => (
                            <div
                                key={task.id}
                                onClick={() => handleToggleTask(task)}
                                className="group flex items-start p-3 rounded-xl transition-all cursor-pointer border bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                            >
                                <div className="mt-0.5 mr-3 text-gray-300 group-hover:text-green-500 transition-colors">
                                    <Circle size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-zinc-900">{task.title}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mt-1 inline-block ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteTask(task.id, e)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Quick Actions (Bottom) - MOVED TO ROW 3 RIGHT */}
                <div className="col-span-12 md:col-span-8 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-zinc-900 text-lg mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <button
                            onClick={() => setNewBookingOpen(true)}
                            className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-black hover:text-white hover:border-black transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-gray-800 group-hover:text-blue-400">
                                <Plus size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-sm">New Booking</div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-400">Create job</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setBroadcastOpen(true)}
                            className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-black hover:text-white hover:border-black transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3 group-hover:bg-gray-800 group-hover:text-purple-400">
                                <Megaphone size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Broadcast</div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-400">Message all crews</div>
                            </div>
                        </button>

                        <button className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-black hover:text-white hover:border-black transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3 group-hover:bg-gray-800 group-hover:text-orange-400">
                                <Truck size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Manage Fleet</div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-400">Track & assign</div>
                            </div>
                        </button>

                        <button
                            onClick={handlePayroll}
                            className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-black hover:text-white hover:border-black transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3 group-hover:bg-gray-800 group-hover:text-green-400">
                                <DollarSign size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Payroll</div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-400">Run payouts</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 7. CRM / Potential Leads Section (NEW) - REMAINS BOTTOM */}
                <div className="col-span-12 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-zinc-900 text-lg">Potential Leads (CRM)</h3>
                            <p className="text-sm text-gray-500">Manage quote requests and potential clients</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                <Filter size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 rounded-lg">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-lg">Customer</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Service Interest</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Requested</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                                            No pending leads found.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.slice(0, 5).map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                                        {lead.customer_name ? lead.customer_name.charAt(0) : 'U'}
                                                    </div>
                                                    <div className="font-bold text-sm text-zinc-900">{lead.customer_name || 'Unknown'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Mail size={12} className="mr-1.5" />
                                                        {lead.customer_email}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Phone size={12} className="mr-1.5" />
                                                        {lead.customer_phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-zinc-700">{lead.services?.name || 'Cleaning'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(lead.scheduled_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                                    New Lead
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded">
                                                        <Phone size={16} />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded">
                                                        <Mail size={16} />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {leads.length > 5 && (
                            <div className="p-4 border-t border-gray-100 text-center">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View All Leads</button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- MODALS --- */}

            {/* 1. Create Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">New Task</h3>
                            <button onClick={() => setTaskModalOpen(false)}><X size={20} className="text-gray-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="e.g. Call client..."
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <button
                                onClick={handleCreateTask}
                                className="w-full bg-black text-white font-medium py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Full Dispatch Board Modal */}
            {isDispatchOpen && (
                <div className="fixed inset-0 z-50 bg-white animate-fade-in flex flex-col">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900">Dispatch Board</h2>
                            <p className="text-gray-500 text-sm">Real-time job tracking and assignment</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search bookings..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                            </div>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <Filter size={18} className="text-gray-600" />
                            </button>
                            <button onClick={() => setDispatchOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-8 bg-gray-50">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500">{booking.id}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-zinc-900">{formatTime(booking.scheduled_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-zinc-900">{booking.customer_name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-400">{booking.address}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{booking.services?.name || 'Service'}</td>
                                            <td className="px-6 py-4">
                                                {booking.cleaner_id ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        Assigned
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 flex items-center">
                                                        <AlertCircle size={10} className="mr-1" /> Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${booking.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                                    booking.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-50 text-blue-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-zinc-900 text-right">${booking.total_price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-black">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. New Booking Modal */}
            {isNewBookingOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">New Manual Booking</h3>
                            <button onClick={() => setNewBookingOpen(false)}><X size={20} className="text-gray-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg" placeholder="Select date" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg" placeholder="09:00 AM" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                    <option>Standard Clean</option>
                                    <option>Deep Clean</option>
                                    <option>Move-In/Out</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setNewBookingOpen(false)}
                                className="w-full bg-black text-white font-medium py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors"
                            >
                                Create Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Broadcast Modal */}
            {isBroadcastOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg flex items-center">
                                <Megaphone size={18} className="mr-2 text-purple-600" />
                                Fleet Broadcast
                            </h3>
                            <button onClick={() => setBroadcastOpen(false)}><X size={20} className="text-gray-500" /></button>
                        </div>
                        <div className="p-6">
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-800 mb-4">
                                This message will be sent to <b>12 active crews</b> via SMS and App Push Notification.
                            </div>
                            <textarea
                                className="w-full border border-gray-300 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                                placeholder="Type your announcement here..."
                            ></textarea>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setBroadcastOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setBroadcastOpen(false)}
                                    className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                                >
                                    Send Broadcast
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};