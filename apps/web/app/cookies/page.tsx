'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../components/logo/logo';
import { useAuth } from '../context/AuthContext';

export default function CookiesPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <nav className="border-b border-zinc-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-xl tracking-tight text-zinc-900">MeetGenius</span>
          </Link>
          <Link 
            href={user ? "/dashboard" : "/"} 
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            {user ? "Back to Dashboard" : "Back to Home"}
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Cookie Policy</h1>
            <p className="text-zinc-500 font-medium">Last updated: May 14, 2026</p>
          </div>

          <div className="prose prose-zinc max-w-none space-y-8 text-zinc-700 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900">1. What are cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website. They help us 
                recognize your device and remember certain information about your visit, like your login session.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900">2. How we use cookies</h2>
              <p>
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-zinc-900">Essential Cookies:</strong> These are required for the website to function. We use them to keep you logged in and secure your session.</li>
                <li><strong className="text-zinc-900">Preference Cookies:</strong> These remember your choices, like whether you've accepted our cookie policy.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900">3. Authentication Cookies</h2>
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                <p className="text-sm italic">
                  Our primary cookie is <code className="bg-zinc-200 px-1.5 py-0.5 rounded text-blue-600 font-bold">access_token</code>. 
                  It is a secure, HTTP-only cookie used to identify your account and protect your data. It is never accessible 
                  to client-side scripts.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900">4. Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. However, if you limit the 
                ability of websites to set cookies, you may worsen your overall user experience, as it will no 
                longer be personalized to you. It may also stop you from saving customized settings like login information.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
