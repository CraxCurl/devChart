"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  React.useEffect(() => {
    // Trigger fade to black shortly after the page loads
    const timer = setTimeout(() => setIsFadingOut(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFadingOut(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Wait 1.5 seconds for the fade-out animation to finish before redirecting
        setTimeout(() => {
          window.location.href = "/overview";
        }, 1500);
      } else {
        setError(data.message || "Failed to log in");
        setIsFadingOut(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsFadingOut(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col transition-colors duration-1000">
      {/* Background Elements */}
      <div className={`fixed inset-0 bg-dot-grid pointer-events-none mask-radial-faded z-0 transition-opacity duration-[1500ms] ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`} />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.04] rounded-full blur-[120px] pointer-events-none z-0 transition-opacity duration-[1500ms] ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`} />

      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 py-12">
        <div className="w-full max-w-sm animate-fade-in text-center space-y-6 mt-16">
          <div className="space-y-1">
            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white glow-text">Welcome Back</h1>
            <p className="text-[1.4rem] text-white/70 font-light">Log in to access your Club Board</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 relative">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center placeholder:text-white/30"
              />
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center placeholder:text-white/30"
                  minLength={8}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <span className="relative w-full h-full block overflow-hidden">
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">→</span>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">→</span>
                    </span>
                  )}
                </button>
              </div>
              
              <div className="text-sm text-white/40 pt-2 flex flex-col gap-2">
                <span>
                  Don't have an account?{" "}
                  <Link href="/register" className="underline text-white/60 hover:text-white/80 transition-colors">
                    Sign up
                  </Link>
                </span>
                <span>
                  Or use{" "}
                  <Link href="/otp-login" className="underline text-white/60 hover:text-white/80 transition-colors">
                    Passwordless Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
