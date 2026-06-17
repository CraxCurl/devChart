"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GradientInput } from "@/components/ui/gradient-input";
import { GlowButton } from "@/components/ui/glow-button";

export default function OtpLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // 1: Email, 2: OTP
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  React.useEffect(() => {
    // Trigger fade to black shortly after the page loads
    const timer = setTimeout(() => setIsFadingOut(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMessage("A 6-digit code has been sent to your email.");
      } else {
        setError(data.message || "Failed to send code.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFadingOut(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // Wait 1.5 seconds for the fade-out animation to finish before redirecting
        setTimeout(() => {
          window.location.href = "/overview";
        }, 1500);
      } else {
        setError(data.message || "Invalid or expired code.");
        setIsFadingOut(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
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
            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white glow-text">Secure Login</h1>
            <p className="text-[1.4rem] text-white/70 font-light">Passwordless via Email OTP</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm text-center">
                {message}
                <p className="text-xs mt-1 opacity-80">Make sure to check your spam folder.</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-3 relative">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center placeholder:text-white/30"
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
                    Or use{" "}
                    <Link href="/login" className="underline text-white/60 hover:text-white/80 transition-colors">
                      Password Login
                    </Link>
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 relative">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full backdrop-blur-[1px] bg-transparent text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center tracking-[0.5em] placeholder:tracking-normal placeholder:text-white/30"
                    maxLength={6}
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
                  <span className="text-xs mt-1">
                    Didn't see it? Check your spam/junk folder.
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="underline text-white/60 hover:text-white/80 transition-colors"
                  >
                    Change Email Address
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-white/40 leading-relaxed">
                <span className="text-white/70 font-semibold">Note:</span> Currently in Beta. We are proceeding without Club Head approval for now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
