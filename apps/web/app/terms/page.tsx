'use client'

import React from 'react';
import Link from 'next/link';
import Logo from '../components/logo/logo';
import Footer from '../components/footer/footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 px-6 flex justify-between items-center">
                <Link href="/">
                    <Logo />
                </Link>
                <Link href="/login" className="text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                    Sign in
                </Link>
            </nav>

            <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-zinc-900 mb-8">Terms of Service</h1>
                <div className="prose prose-zinc max-w-none space-y-6 text-zinc-600 leading-relaxed">
                    <p className="text-lg">Last updated: May 10, 2026</p>
                    <p>
                        By using MeetGenius, you agree to the following terms and conditions. Please read them carefully before using our platform.
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900 pt-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our service, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900 pt-4">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily use MeetGenius for personal or commercial meeting note-taking purposes. You may not attempt to decompile or reverse engineer any software contained on our website.
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900 pt-4">3. Disclaimer</h2>
                    <p>
                        Our AI-generated summaries are provided "as is". While we strive for accuracy, we do not guarantee that the AI will perfectly capture every detail of your meetings.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
