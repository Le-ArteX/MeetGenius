"use client";

import React, { useRef, useEffect } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: any;
  onCopyLink: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export default function ShareDropdown({ isOpen, onClose, note, onCopyLink, anchorRef }: ShareModalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const downloadCSV = () => {
    const headers = ["Title", "Date", "Summary", "Key Decisions"];
    const row = [
      note.title,
      new Date(note.createdAt).toLocaleDateString(),
      note.summary || "",
      note.keyDecision || ""
    ];
    
    const csvContent = [
      headers.join(","),
      row.map(field => `"${field.replace(/"/g, '""')}"`).join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${note.title.replace(/\s+/g, '_')}_summary.csv`);
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-zinc-100 py-2 z-[10002] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="px-4 py-2 mb-1">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Share & Export</p>
      </div>

      <button
        onClick={() => {
          onCopyLink();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors text-left group"
      >
        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
          <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900">Copy Link</p>
          <p className="text-[11px] text-zinc-500">Quick share URL</p>
        </div>
      </button>

      <div className="h-px bg-zinc-100 my-1 mx-4" />

      <button
        onClick={handlePrint}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors text-left group"
      >
        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900">Export as PDF</p>
          <p className="text-[11px] text-zinc-500">Document version</p>
        </div>
      </button>

      <button
        onClick={downloadCSV}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors text-left group"
      >
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900">Export as CSV</p>
          <p className="text-[11px] text-zinc-500">Excel / Google Sheets</p>
        </div>
      </button>
    </div>
  );
}
