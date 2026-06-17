"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getUserSession } from "@/app/actions";

type Task = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee?: string;
    dueDate?: string;
    clubTag?: string;
    createdAt?: string;
};

export default function Overview() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{name: string, email: string} | null>(null);

    useEffect(() => {
        getUserSession().then(setUser);
        
        async function fetchTasks() {
            try {
                const response = await fetch("/api/tasks?all=true");
                const data = await response.json();
                if (response.ok && Array.isArray(data)) {
                    setTasks(data);
                }
            } catch (e) {
                console.error("Error fetching tasks", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTasks();
    }, []);

    // Derived stats (excluding soft-deleted)
    const activeTasksList = tasks.filter(t => !t.isDeleted);
    const totalTasks = activeTasksList.length;
    const inProgress = activeTasksList.filter(t => t.status === "In Progress").length;
    const completed = activeTasksList.filter(t => t.status === "Done" || t.status === "completed").length;
    
    // Construct Activity Feed
    type ActivityEvent = {
        id: string;
        task: Task;
        type: 'created' | 'deleted';
        date: Date;
        user: string;
    };

    const activityFeed: ActivityEvent[] = [];
    tasks.forEach(t => {
        // Add creation event
        if (t.createdAt) {
            activityFeed.push({
                id: `${t._id}-created`,
                task: t,
                type: 'created',
                date: new Date(t.createdAt),
                user: t.createdBy || 'Anonymous'
            });
        }
        // Add deletion event if deleted
        if (t.isDeleted && t.deletedAt) {
            activityFeed.push({
                id: `${t._id}-deleted`,
                task: t,
                type: 'deleted',
                date: new Date(t.deletedAt),
                user: t.deletedBy || 'Anonymous'
            });
        }
    });

    // Sort descending by date and take top 5
    activityFeed.sort((a, b) => b.date.getTime() - a.date.getTime());
    const recentActivity = activityFeed.slice(0, 5);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
            <Navbar />

            <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-24 z-10 relative flex flex-col gap-10">

                {/* Header Section */}
                <div className="animate-fade-in flex flex-col gap-3">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white glow-text flex items-center gap-4 flex-wrap">
                        Command Center
                        {user && (
                            <span className="text-sm font-medium bg-white/10 text-white/80 px-4 py-1.5 rounded-full border border-white/10 shadow-lg tracking-normal">
                                Logged in as <span className="text-white font-bold">{user.name}</span>
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-400 text-lg">Here's what's happening across your club boards.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 animate-slide-up">

                        {/* Main Content: Stats and Recent Tasks */}
                        <div className="flex-1 flex flex-col gap-8">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl shadow-black/50 hover:border-white/20 hover:bg-[#151515] transition-all group">
                                    <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">Active Tasks</span>
                                    <span className="text-4xl font-black mt-2 text-white">{totalTasks - completed}</span>
                                </div>
                                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl shadow-black/50 hover:border-white/20 hover:bg-[#151515] transition-all group">
                                    <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">In Progress</span>
                                    <span className="text-4xl font-black mt-2 text-white">{inProgress}</span>
                                </div>
                                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl shadow-black/50 hover:border-white/20 hover:bg-[#151515] transition-all group">
                                    <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">Completed</span>
                                    <span className="text-4xl font-black mt-2 text-white">{completed}</span>
                                </div>
                            </div>

                            {/* Recent Tasks */}
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/60 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Recent Activity
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {recentActivity.length === 0 ? (
                                        <div className="text-center py-10 text-slate-500">No recent activity. Create a task to get started!</div>
                                    ) : (
                                        recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-white/20 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'created' ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-400'}`}>
                                                        {activity.type === 'created' ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-200">
                                                            {activity.task.title}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {activity.type === 'created' ? 'Added' : 'Deleted'} by <span className="font-medium text-slate-300">{activity.user}</span> • {activity.date.toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Quick Actions */}
                        <div className="w-full lg:w-80 flex flex-col gap-6">
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/60 flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-white mb-2">Quick Actions</h3>

                                <Link href="/create-task" className="group flex items-center justify-between p-4 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <span className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        </span>
                                        Create New Task
                                    </span>
                                </Link>

                                <Link href="/dashboard" className="group flex items-center justify-between p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 text-white font-semibold hover:border-white/30 hover:bg-[#222] transition-colors">
                                    <span className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                                        </span>
                                        Open Kanban Board
                                    </span>
                                    <svg className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
