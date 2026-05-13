'use client'

import React from 'react';
import Link from 'next/link';
import Logo from '../components/logo/logo';
import Footer from '../components/footer/footer';

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 px-6 flex justify-between items-center">
                <Link href="/">
                    <Logo />
                </Link>
                <div className="flex gap-6 items-center">
                    <Link href="/login" className="text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                        Sign in
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="flex-1 max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-zinc-900 mb-4 tracking-tight">Our Blog</h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Tips, tricks, and insights on how to make your meetings more productive with AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-zinc-100 rounded-3xl mb-6 overflow-hidden border border-zinc-200">
                            <div className="w-full h-full bg-linear-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
                                <span className="text-zinc-400 font-medium">Post Image</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-blue-600 transition-colors">
                            5 Ways AI is Changing Team Collaboration
                        </h2>
                        <p className="text-zinc-600 line-clamp-2">
                            Discover how artificial intelligence is helping teams stay aligned and productive without the manual work of taking notes...
                        </p>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-zinc-100 rounded-3xl mb-6 overflow-hidden border border-zinc-200">
                            <div className="w-full h-full bg-linear-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                                <span className="text-zinc-400 font-medium">Post Image</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-blue-600 transition-colors">
                            The Future of Meetings: Less Talking, More Doing
                        </h2>
                        <p className="text-zinc-600 line-clamp-2">
                            Learn why short, AI-summarized meetings are becoming the new standard for high-growth tech companies...
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
