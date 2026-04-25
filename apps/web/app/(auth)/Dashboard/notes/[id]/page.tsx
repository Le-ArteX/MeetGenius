"use client";

import Link from "next/link";
import { use } from "react";

// Stub note data — replace with real data fetching later
const NOTES: Record<string, { title: string; description: string; date: string; actionCount: number; body: string }> = {
  "1": {
    title: "Weekly Standup",
    description: "Discussed Q1 targets, sprint velocity......",
    date: "Jan 12",
    actionCount: 3,
    body: "Team discussed Q1 OKRs and current sprint velocity. Action items assigned to each member. Next standup scheduled for Jan 19.",
  },
  "2": {
    title: "Client Call - Acme",
    description: "Client requested dashboard redesign......",
    date: "Jan 10",
    actionCount: 5,
    body: "Acme requested a full redesign of their analytics dashboard. Key feedback: simpler navigation, more data at a glance. Follow-up call scheduled for Jan 17.",
  },
  "3": {
    title: "Design Review",
    description: "Approved new dashboard mockups......",
    date: "Jan 8",
    actionCount: 2,
    body: "New dashboard mockups reviewed and approved by the team. Minor tweaks to color palette requested. Final assets due Jan 12.",
  },
  "4": {
    title: "Sprint Planning",
    description: "Selected 14 story points for sprint......",
    date: "Jan 6",
    actionCount: 8,
    body: "Sprint 7 planning complete. 14 story points committed across 6 tickets. Blockers identified in the auth flow — needs investigation before Thursday.",
  },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function NotePage({ params }: Props) {
  const { id } = use(params);
  const note = NOTES[id];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center h-14 px-6 border-b border-zinc-200 bg-white">
        <Link
          href="/Dashboard"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Notes
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        {note ? (
          <>
            {/* Meta */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-zinc-400">{note.date}</span>
              <span className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
                {note.actionCount} action{note.actionCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{note.title}</h1>

            {/* Description */}
            <p className="text-sm text-amber-600 mb-8">{note.description}</p>

            {/* Divider */}
            <div className="border-t border-zinc-100 mb-8" />

            {/* Body */}
            <p className="text-sm text-zinc-600 leading-relaxed">{note.body}</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-zinc-400 text-sm mb-4">Note not found.</p>
            <Link href="/Dashboard" className="text-sm text-blue-600 hover:underline">
              Go back to Notes
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
