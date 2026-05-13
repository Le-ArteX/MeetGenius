'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[calc(100%-2rem)] sm:w-[380px]">
      <div className="bg-[#0A0A0A] border border-white/[0.08] shadow-2xl rounded-xl p-5 text-zinc-100 flex flex-col gap-4 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm tracking-tight">
            We use cookies
          </h3>
          <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
            We use essential cookies to maintain your session securely. By continuing to use our platform, you agree to our use of cookies.
            <Link href="/privacy" className="text-zinc-200 hover:text-white underline underline-offset-2 ml-1 transition-colors">
              Read policy
            </Link>.
          </p>
        </div>
        <div className="flex gap-2 w-full pt-1">
          <button
            onClick={handleDecline}
            className="flex-1 px-4 py-2 rounded-lg font-semibold text-[13px] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 rounded-lg font-semibold text-[13px] bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
