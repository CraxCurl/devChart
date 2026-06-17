import React from "react";
import { GlassCard } from "./ui/glass-card";

type TaskCardProps = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee?: string;
    dueDate?: string;
    clubTag?: string;
    isReadOnly?: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDelete: (id: string) => void;
};

const TaskCard = ({ _id, title, description, priority, assignee, dueDate, clubTag, isReadOnly, onDragStart, onDelete }: TaskCardProps) => {
    const priorityStyle =
        priority.toLowerCase() === "high"
            ? "from-rose-500/20 to-red-600/20 border-red-500/50"
            : priority.toLowerCase() === "medium"
            ? "from-amber-500/20 to-orange-600/20 border-orange-500/50"
            : "from-emerald-500/20 to-emerald-600/20 border-emerald-500/50";

    const isOverdue = dueDate && new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();

    const tagColors: Record<string, string> = {
        "App Development": "bg-blue-500/20 text-blue-300 border-blue-500/30",
        "UI/UX Design": "bg-purple-500/20 text-purple-300 border-purple-500/30",
        "Marketing & PR": "bg-pink-500/20 text-pink-300 border-pink-500/30",
        "Events & Workshops": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        "Core Committee": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        "General": "bg-slate-500/20 text-slate-300 border-slate-500/30",
    };
    const tagStyle = tagColors[clubTag || "General"] || tagColors["General"];

    return (
        <div 
            draggable={!isReadOnly}
            onDragStart={(e) => !isReadOnly && onDragStart(e, _id)}
            className={`w-full max-w-[280px] self-start shrink-0 mb-4 animate-slide-up group ${!isReadOnly ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        >
            <div className="bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-colors p-0 rounded-xl flex flex-col h-auto relative overflow-hidden shadow-lg shadow-black/40">
                {/* Top glowing gradient line */}
                <div className={`h-[3px] w-full bg-gradient-to-r ${priorityStyle} border-none z-20 relative`}></div>

                <div className="p-4 flex justify-between items-start relative z-20">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center w-full">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagStyle}`}>
                                {clubTag || "General"}
                            </span>
                            
                            {!isReadOnly && (
                                <button 
                                    onClick={() => onDelete(_id)} 
                                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/5"
                                    title="Delete Task"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-white mt-1 leading-tight">{title}</h2>
                    </div>
                </div>

                <div className="px-4 pb-4 flex flex-col gap-3 relative z-20">
                    <div className="text-sm text-slate-300 break-words line-clamp-3">
                        {description}
                    </div>
                    
                    {(assignee || dueDate) && (
                        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
                            {assignee && (
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black font-bold shadow-lg">
                                        {assignee.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-slate-300 font-medium">@{assignee}</span>
                                </div>
                            )}
                            {dueDate && (
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    {isOverdue && ' (Overdue)'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
