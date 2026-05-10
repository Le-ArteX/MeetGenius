'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '../logo/logo';
import { apiRequest } from '../../lib/api';

function OTPVerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(59);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const code = otp.join('');
        
        try {
            const response = await apiRequest('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email, code }),
            });
            
            // Store token and redirect
            if (response.access_token) {
                localStorage.setItem('accessToken', response.access_token);
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError(null);
        try {
            // We can reuse the register endpoint or a specific resend endpoint if available
            // For now, let's just reset the timer
            setTimer(59);
        } catch (err: any) {
            setError("Failed to resend code");
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 text-center space-y-4">
                    <h1 className="text-xl font-bold">Invalid session</h1>
                    <p className="text-zinc-500">Please go back and register again.</p>
                    <Link href="/register" className="text-blue-600 font-bold">Go to register</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Logo />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Verify your email</h1>
                        <p className="text-zinc-500 text-sm">
                            We've sent a 6-digit code to <span className="font-bold text-zinc-900">{email}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between gap-2 sm:gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={loading}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all disabled:opacity-50"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading || otp.some(d => !d)}
                            className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Verifying..." : "Verify Account"}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-zinc-500">
                                Didn't receive the code?{' '}
                                {timer > 0 ? (
                                    <span className="text-zinc-900 font-bold">Resend in {timer}s</span>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={handleResend}
                                        className="text-blue-600 font-bold hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <Link
                        href="/login"
                        className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OTPVerification() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPVerificationContent />
        </Suspense>
    );
}
