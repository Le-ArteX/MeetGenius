'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't made a choice yet
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Add a slight delay so it doesn't pop up aggressively the exact millisecond the page loads
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:max-w-3xl md:mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-6 text-white flex flex-col sm:flex-row gap-6 items-center justify-between animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
        <div className="space-y-1.5 flex-1">
          <h3 className="font-bold text-lg flex items-center gap-2">
            🍪 We value your privacy
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            MeetGenius uses essential cookies to securely maintain your session and keep you logged in. We do not use third-party tracking cookies.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-medium text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-zinc-900 hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-[0.97] cursor-pointer"
          >
            Allow Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
