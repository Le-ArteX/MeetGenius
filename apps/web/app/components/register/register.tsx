'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../logo/logo';
import { apiRequest } from '../../lib/api';

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, confirmPassword }),
            });
            
            // Success - redirect to verification page with email in query
            router.push(`/verify?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Link href="/landingPage">
                        <Logo />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Create your account</h1>
                        <p className="text-zinc-500 text-sm">Sign up to get started with MeetGenius</p>
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
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 ml-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 ml-1" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 mb-4 disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors hover:shadow-xl shadow-zinc-900/10 active:scale-[0.98] cursor-pointer disabled:opacity-50">
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <Link
                        href="/login"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
