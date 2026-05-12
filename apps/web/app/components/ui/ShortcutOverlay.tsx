"use client";

import { useState, useEffect } from "react";
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut";

interface Shortcut {
  label: string;
  keys: string[];
  action?: string;
}

const SHORTCUTS: Shortcut[] = [
  { label: "Show shortcuts", keys: ["Ctrl", "/"] },
  { label: "Search / Command palette", keys: ["Ctrl", "K"] },
  { label: "Create new note", keys: ["Ctrl", "N"] },
  { label: "Go to settings", keys: ["Ctrl", ","] },
  { label: "Switch Workspace", keys: ["Alt", "1-9"] },
  { label: "Close modal", keys: ["Esc"] },
];

export const ShortcutOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle on Ctrl + /
  useKeyboardShortcut({ key: "/", ctrlKey: true }, () => {
    setIsOpen((prev) => !prev);
  });

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-md overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-2xl rounded-2xl p-6 transform animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Keyboard Shortcuts</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {SHORTCUTS.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between group">
              <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                {shortcut.label}
              </span>
              <div className="flex gap-1.5">
                {shortcut.keys.map((key, ki) => (
                  <kbd 
                    key={ki}
                    className="inline-flex items-center justify-center min-w-[24px] px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-[0_1px_0_rgba(0,0,0,0.1)]"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] text-center text-zinc-400 uppercase tracking-widest">
            Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">ESC</kbd> to dismiss
          </p>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>
  );
};
