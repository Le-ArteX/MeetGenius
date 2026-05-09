'use client'

import React from 'react';
import Link from 'next/link';
import Logo from '../components/logo/logo';
import Footer from '../components/footer/footer';

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 px-6 flex justify-between items-center">
                <Link href="/landingPage">
                    <Logo />
                </Link>
                <Link href="/register" className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                    Join the Team
                </Link>
            </nav>

            <main className="flex-1 max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-zinc-900 mb-4 tracking-tight">Join MeetGenius</h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Help us build the future of AI-powered collaboration. We're looking for passionate people to join our remote-first team.
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-8">Open Positions</h2>
                    
                    {/* Placeholder Job 1 */}
                    <div className="p-8 rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Senior AI Engineer</h3>
                                <p className="text-zinc-500">Remote • Full-time • Engineering</p>
                            </div>
                            <button className="px-6 py-2 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Placeholder Job 2 */}
                    <div className="p-8 rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Product Designer</h3>
                                <p className="text-zinc-500">Remote • Full-time • Design</p>
                            </div>
                            <button className="px-6 py-2 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Placeholder Job 3 */}
                    <div className="p-8 rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Frontend Developer (React)</h3>
                                <p className="text-zinc-500">Remote • Full-time • Engineering</p>
                            </div>
                            <button className="px-6 py-2 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 pt-12 mb-8">Internships</h2>

                    {/* Internship 1 */}
                    <div className="p-8 rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">AI Research Intern</h3>
                                <p className="text-zinc-500">Remote • Summer 2026 • Engineering</p>
                            </div>
                            <button className="px-6 py-2 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Internship 2 */}
                    <div className="p-8 rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Marketing Intern</h3>
                                <p className="text-zinc-500">Remote • Summer 2026 • Growth</p>
                            </div>
                            <button className="px-6 py-2 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
