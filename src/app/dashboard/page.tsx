"use client";

import Navbar from "@/components/Navbar"
import TaskCard from "@/components/TaskCard";
import React, { useState, useEffect } from "react";
import { TextReveal } from "@/components/ui/cascade-text";
import { GradientInput } from "@/components/ui/gradient-input";

import { getAuthStatus } from "@/app/actions";

type Task = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee?: string;
    dueDate?: string;
    clubTag?: string;
    isDeleted?: boolean;
    deletedBy?: string;
    deletedAt?: string;
};

const COLUMNS = ["To Do", "In Progress", "Done"];

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [trashTasks, setTrashTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // For delete prompt
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [deleteUserName, setDeleteUserName] = useState("");

    async function fetchTasks() {
        try {
            const response = await fetch("/api/tasks");
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                const mappedData = data.map((t: any) => ({
                    ...t,
                    status: t.status || (t.completed ? "Done" : "To Do"),
                    clubTag: t.clubTag || "General"
                }));
                setTasks(mappedData);
            } else {
                console.error("Failed to fetch tasks:", data);
            }
        } catch (e) {
            console.error("Error fetching tasks", e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAuthStatus().then(status => setIsLoggedIn(status));
        fetchTasks();
    }, []);

    const onDragStart = (e: React.DragEvent, id: string) => {
        if (!isLoggedIn) return;
        e.dataTransfer.setData("taskId", id);
    };

    const onDragOver = (e: React.DragEvent) => {
        if (!isLoggedIn) return;
        e.preventDefault();
    };

    const onDrop = async (e: React.DragEvent, newStatus: string) => {
        if (!isLoggedIn) return;
        e.preventDefault();
        const id = e.dataTransfer.getData("taskId");
        if (!id) return;

        // Optimistically update UI
        setTasks((prev) =>
            prev.map((t) => t._id === id ? { ...t, status: newStatus } : t)
        );

        // Update Backend
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error("Failed to update status", error);
            fetchTasks();
        }
    };

    const handleDelete = (id: string) => {
        if (!isLoggedIn) return;
        setTaskToDelete(id);
        setDeleteUserName(""); // Reset input
    };

    const confirmDelete = async () => {
        if (!taskToDelete || !isLoggedIn) return;
        if (!deleteUserName.trim()) {
            alert("Please enter a name to proceed.");
            return;
        }

        const id = taskToDelete;
        const userName = deleteUserName.trim();
        setTaskToDelete(null);

        setTasks((prev) => prev.filter(t => t._id !== id));

        try {
            await fetch(`/api/tasks/${id}?user=${encodeURIComponent(userName)}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete task", error);
            fetchTasks();
        }
    };

    const fetchTrashTasks = async () => {
        if (!isLoggedIn) return;
        try {
            const response = await fetch("/api/tasks?trash=true");
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setTrashTasks(data);
            }
        } catch (e) {
            console.error("Error fetching trash", e);
        }
    };

    const openTrashModal = () => {
        if (!isLoggedIn) return;
        setIsTrashModalOpen(true);
        fetchTrashTasks();
    };

    const handleRestore = async (id: string) => {
        if (!isLoggedIn) return;
        setTrashTasks((prev) => prev.filter(t => t._id !== id));
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDeleted: false, deletedBy: null, deletedAt: null })
            });
            fetchTasks();
        } catch (e) {
            console.error("Failed to restore", e);
            fetchTrashTasks();
        }
    };

    const handleHardDelete = async (id: string) => {
        if (!isLoggedIn) return;
        if (!confirm("Are you sure you want to permanently delete this task?")) return;
        setTrashTasks((prev) => prev.filter(t => t._id !== id));
        try {
            await fetch(`/api/tasks/${id}?hard=true`, { method: 'DELETE' });
        } catch (e) {
            console.error("Failed to hard delete", e);
            fetchTrashTasks();
        }
    };

    const emptyTrash = async () => {
        if (!isLoggedIn) return;
        if (!confirm("Are you sure you want to permanently delete ALL tasks in the Recycle Bin? This cannot be undone.")) return;

        const tasksToDelete = [...trashTasks];
        setTrashTasks([]);

        try {
            for (const task of tasksToDelete) {
                await fetch(`/api/tasks/${task._id}?hard=true`, { method: 'DELETE' });
            }
        } catch (e) {
            console.error("Failed to empty trash", e);
            fetchTrashTasks();
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.clubTag && t.clubTag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-24 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-5xl md:text-[3.5rem] font-black tracking-tighter text-white drop-shadow-md">
                            Club Board
                        </h1>
                        <p className="text-slate-400 text-base mt-2">
                            {isLoggedIn ? "Manage and track your team's progress" : "Viewing in Read-Only mode"}
                        </p>
                    </div>
                    <div className="w-full md:w-80 relative group mt-4 md:mt-0">
                        <div className="absolute inset-y-0 left-0 pl-3 z-20 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks, assignees, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {COLUMNS.map((column) => {
                            const colTasks = filteredTasks.filter(t => t.status === column);
                            return (
                                <div
                                    key={column}
                                    onDragOver={isLoggedIn ? onDragOver : undefined}
                                    onDrop={isLoggedIn ? (e) => onDrop(e, column) : undefined}
                                    className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-col h-[calc(100vh-280px)] min-h-[500px] animate-fade-in"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            {column === "To Do" && <span className="w-2 h-2 rounded-full bg-slate-400"></span>}
                                            {column === "In Progress" && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>}
                                            {column === "Done" && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                                            {column}
                                        </h2>
                                        <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                                            {colTasks.length}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-4 items-center flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                        {colTasks.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full opacity-50">
                                                <svg className="w-8 h-8 mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                                <p className="text-xs font-semibold text-slate-500">{isLoggedIn ? "Drop tasks here" : "No tasks here"}</p>
                                            </div>
                                        ) : (
                                            colTasks.map((task) => (
                                                <TaskCard
                                                    key={task._id}
                                                    {...task}
                                                    isReadOnly={!isLoggedIn}
                                                    onDragStart={onDragStart}
                                                    onDelete={handleDelete}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Floating Dustbin */}
            {isLoggedIn && (
                <button
                    onClick={openTrashModal}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 hover:scale-105 transition-all shadow-xl shadow-black/50 z-40 group"
                >
                    <svg className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            )}

            {/* Trash Modal */}
            {isTrashModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/50 animate-slide-up">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Recycle Bin
                            </h2>
                            <div className="flex items-center gap-4">
                                {trashTasks.length > 0 && (
                                    <button onClick={emptyTrash} className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors">
                                        Empty Trash
                                    </button>
                                )}
                                <button onClick={() => setIsTrashModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                            {trashTasks.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">Trash is empty</div>
                            ) : (
                                trashTasks.map(task => (
                                    <div key={task._id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-slate-200">{task.title}</h3>
                                            <p className="text-xs text-slate-500 mt-1">Deleted by: <span className="text-slate-300 font-medium">{task.deletedBy || 'Anonymous'}</span> on {task.deletedAt ? new Date(task.deletedAt).toLocaleDateString() : 'Unknown'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleRestore(task._id)} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/20 transition-colors">Restore</button>
                                            <button onClick={() => handleHardDelete(task._id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors">Delete Forever</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Name Prompt Modal for Deletion */}
            {taskToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl shadow-black/50 animate-slide-up">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Delete Task</h2>
                            <p className="text-sm text-slate-400 mt-1">Please enter your name to authorize this deletion.</p>
                        </div>
                        <div className="p-6">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Your Name"
                                value={deleteUserName}
                                onChange={(e) => setDeleteUserName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && confirmDelete()}
                                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#0a0a0a] rounded-b-2xl">
                            <button onClick={() => setTaskToDelete(null)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}