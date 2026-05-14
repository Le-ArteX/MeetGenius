'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);


    if (parts.length > 1) {
      router.replace(`/${parts[0]}`);
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
