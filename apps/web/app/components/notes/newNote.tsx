"use client";

import React, { useState } from "react";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function NewNote() {
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const wordCount = transcript.trim() === "" ? 0 : transcript.trim().split(/\s+/).length;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      setError("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTranscript(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!transcript.trim()) return;
    // Analysis logic here
    console.log("Analyzing...");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetingMind"
        logoHref="/dashboard"
        workspaceName="My Workspace"
        ctaLabel="+ Note"
        logo={<Logo />}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar links={sidebarLinks} activeLinkId="notes" />
        <main className="flex-1 overflow-y-auto px-12 py-10 bg-zinc-50/10">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-xl font-semibold text-zinc-900">New meeting note</h1>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="card p-5">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Paste your transcript
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={16}
                placeholder="[00:00] John: Let us get started with the standup..."
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-xs font-mono bg-zinc-50 placeholder:text-zinc-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-400">{wordCount} words</span>
                  <label className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                    Upload .txt file
                    <input type="file" accept=".txt" className="hidden" onChange={handleFile} />
                  </label>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!transcript.trim()}
                  className="px-5 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyze with AI
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
