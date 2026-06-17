"use client";

import Navbar from '@/components/Navbar'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { GradientInput } from '@/components/ui/gradient-input';
import { GlowButton } from '@/components/ui/glow-button';
import { CalendarWithTimePickerInline } from '@/components/ui/calendar-with-time-picker-inline';

const CreateTask = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("low");
    const [clubTag, setClubTag] = useState("General");
    const [assignee, setAssignee] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [createdBy, setCreatedBy] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description, priority, clubTag, assignee, dueDate: dueDate ? dueDate.toISOString() : "", createdBy: createdBy || "Anonymous" }),
            });

            if (!response.ok) throw new Error("Failed to create task");

            router.push("/dashboard");

        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <div className="flex flex-col items-center pt-16 px-4">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 glow-text">New Task</h1>
                    <p className="text-slate-400">Add a new actionable item to your club board.</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-2xl glass-panel p-8 flex flex-col gap-6 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GradientInput
                            label="Task Title"
                            required
                            type="text"
                            placeholder="e.g. Design new club logo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <GradientInput
                            as="select"
                            label="Club Tag"
                            value={clubTag}
                            onChange={(e) => setClubTag(e.target.value)}
                            className="[&>option]:bg-slate-900"
                        >
                            <option value="General">General</option>
                            <option value="App Development">App Development</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Marketing & PR">Marketing & PR</option>
                            <option value="Events & Workshops">Events & Workshops</option>
                            <option value="Core Committee">Core Committee</option>
                        </GradientInput>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GradientInput
                            label="Your Name (Creator)"
                            required
                            type="text"
                            placeholder="e.g. John Doe"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                        />
                        <div className="w-full group relative">
                            <label className="block text-sm font-medium text-white/60 mb-2">Due Date (Optional)</label>
                            
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent opacity-0 rounded-xl blur transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none" />
                                <button 
                                    type="button"
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    className={`relative w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 px-5 focus:outline-none focus:border-white/30 transition-colors flex justify-between items-center ${dueDate ? 'text-white' : 'text-white/20'}`}
                                >
                                    {dueDate ? dueDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "Select a date and time"}
                                    <svg className={`w-4 h-4 ${dueDate ? 'text-white' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </button>
                            </div>

                            {isCalendarOpen && (
                                <div className="absolute top-[88px] left-0 z-50 bg-[#050505] p-2 rounded-2xl border border-white/10 shadow-2xl">
                                    <div className="flex justify-between items-center mb-2 px-2">
                                        <span className="text-xs font-semibold text-slate-400">Pick Date & Time</span>
                                        <button type="button" onClick={() => setIsCalendarOpen(false)} className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <CalendarWithTimePickerInline 
                                        value={dueDate}
                                        onChange={setDueDate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <GradientInput
                        as="textarea"
                        label="Description"
                        required
                        placeholder="Provide detailed instructions or context..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[120px] resize-y"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GradientInput
                            as="select"
                            label="Priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="[&>option]:bg-slate-900"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </GradientInput>

                        <GradientInput
                            label="Assignee (Optional)"
                            type="text"
                            placeholder="@username"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <GlowButton type="submit" isLoading={isSubmitting} variant="primary" className="w-full md:w-auto">
                            Create Assignment
                        </GlowButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTask