'use client'

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '../logo/logo';
import { apiRequest } from '../../lib/api';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (otp.some(d => !d)) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            await apiRequest('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, code: otp.join(''), password, confirmPassword }),
            });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 text-center space-y-6">
                    <h1 className="text-xl font-bold">Invalid request</h1>
                    <p className="text-zinc-500 text-sm">Reset link is invalid. Please request a new OTP.</p>
                    <Link href="/forgotpassword" className="inline-block w-full py-3 bg-zinc-900 text-white font-bold rounded-xl">Go to forgot password</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            {success ? 'Password Updated!' : 'Reset your password'}
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            {success
                                ? 'Redirecting you to sign in...'
                                : `Enter the 6-digit OTP sent to ${email}`}
                        </p>
                    </div>
                </div>

                {success ? (
                    <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 space-y-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                            Your password has been reset successfully.
                        </p>
                        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            Go to sign in →
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-zinc-900 ml-1">6-Digit OTP</label>
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        disabled={loading}
                                        className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all disabled:opacity-50"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-900 ml-1" htmlFor="password">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-900 ml-1" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-[0.98] cursor-pointer disabled:opacity-50">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
