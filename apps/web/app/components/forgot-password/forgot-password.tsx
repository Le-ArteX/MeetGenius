'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../logo/logo';
import { apiRequest } from '../../lib/api';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await apiRequest('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Reset Password</h1>
                        <p className="text-zinc-500 text-sm">
                            Enter your email to receive a 6-digit OTP to reset your password
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 ml-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 active:scale-[0.98] cursor-pointer disabled:opacity-50">
                        {loading ? 'Sending OTP...' : 'Send Reset OTP'}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center pt-2">
                    <Link
                        href="/login"
                        className={`text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
