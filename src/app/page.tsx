import Navbar from "@/components/Navbar"
import Link from "next/link";
import { TextReveal } from "@/components/ui/cascade-text";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export default async function Home() {
  await connectDB();

  // Fetch stats securely server-side
  const totalTasks = await Task.countDocuments({ isDeleted: false });
  const inProgressTasks = await Task.countDocuments({ isDeleted: false, status: "In Progress" });
  const completedTasks = await Task.countDocuments({ isDeleted: false, status: "Done" });

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col relative">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-100 mask-radial-faded" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-16">

        {/* Top Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-slate-300 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Your Collaborative Task Manager
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-white drop-shadow-2xl">
          devChart
        </h1>

        <p className="max-w-2xl mt-8 text-lg md:text-xl text-slate-400 font-medium tracking-tight">
          An easy tool for managing your tasks and collaborating with your team. Built for speed, designed for clarity. Have a nice time building.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-8 font-semibold bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </Link>
          <Link href="/dashboard" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-8 font-semibold bg-transparent text-white border border-white/20 transition-all duration-300 hover:bg-white/5 hover:border-white/40">
            View Board
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl z-10 relative">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/20 transition-colors">
            <span className="text-4xl font-black text-white drop-shadow-md">{totalTasks}</span>
            <span className="text-sm font-medium text-slate-400 mt-2">Total Tasks</span>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/20 transition-colors">
            <span className="text-4xl font-black text-white drop-shadow-md">{inProgressTasks}</span>
            <span className="text-sm font-medium text-slate-400 mt-2">In Progress</span>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/20 transition-colors">
            <span className="text-4xl font-black text-white drop-shadow-md">{completedTasks}</span>
            <span className="text-sm font-medium text-slate-400 mt-2">Completed</span>
          </div>
        </div>
      </main>
    </div>
  );
}