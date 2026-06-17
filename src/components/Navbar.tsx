"use client";

import Link from "next/link"
import { TextReveal } from "@/components/ui/cascade-text";
import { useEffect, useState } from "react";
import { getAuthStatus, logoutAction } from "@/app/actions";

export default function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        getAuthStatus().then(status => setIsLoggedIn(status));
    }, []);

    async function handleLogout(e: React.FormEvent) {
        e.preventDefault();
        await logoutAction();
    }

    return (
        <>
            <div className="sticky top-6 z-50 flex justify-center w-full animate-fade-in pointer-events-none px-2 sm:px-4">
                <nav className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-12 lg:gap-24 h-16 px-2 sm:px-3 pr-2 sm:pr-3 pl-4 sm:pl-6 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Link href={isLoggedIn ? "/overview" : "/"} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-300">
                            dC
                        </div>
                        <TextReveal 
                            text="devChart" 
                            as="span"
                            className="text-xl font-bold text-white tracking-tight"
                            hoverColor="#ffffff"
                        />
                    </Link>
                    
                    <div className="flex items-center gap-2 sm:gap-4">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard">
                                    <button className="text-sm sm:text-base font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5">
                                        Board
                                    </button>
                                </Link>
                                <Link href="/create-task">
                                    <button className="text-sm sm:text-base font-semibold bg-slate-200 hover:bg-white text-black transition-all duration-300 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] transform hover:-translate-y-0.5">
                                        + New Task
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <button className="text-sm sm:text-base font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="text-sm sm:text-base font-semibold bg-white text-black hover:bg-slate-200 transition-all duration-300 px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] transform hover:-translate-y-0.5">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Floating Top-Right Logout Button */}
            {isLoggedIn && (
                <div className="fixed top-8 right-8 z-50 animate-fade-in pointer-events-auto">
                    <form onSubmit={handleLogout}>
                        <button 
                            type="submit" 
                            className="text-sm font-medium text-white/40 hover:text-red-400 transition-all duration-300 flex items-center gap-2 group px-4 py-2 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                            title="Sign out"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}