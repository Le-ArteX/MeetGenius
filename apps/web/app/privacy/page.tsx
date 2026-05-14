'use client'

import React from 'react';
import Link from 'next/link';
import Logo from '../components/logo/logo';
import Footer from '../components/footer/footer';

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-bold text-zinc-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-zinc max-w-none space-y-6 text-zinc-600 leading-relaxed">
                    <p className="text-lg">Last updated: May 10, 2026</p>
                    <p>
                        At MeetGenius, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our AI meeting notes service.
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900 pt-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as your name, email address, and the content of your meeting transcripts when you use our AI processing features.
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900 pt-4">2. How We Use Your Information</h2>
                    <p>
                        We use your information to provide and improve our services, including using AI to generate summaries, action items, and key decisions from your meetings.
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-900 pt-4">3. Data Security</h2>
                    <p>
                        We implement industry-standard security measures to protect your data. Your transcripts are processed securely and we do not sell your personal information to third parties.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
