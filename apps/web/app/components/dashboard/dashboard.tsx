"use client";

import DashboardTopbar, { type DashboardTopbarProps } from "./DashboardTopbar";
import DashboardSidebar, { type DashboardSidebarProps } from "./DashboardSidebar";
import SearchBar, { type SearchBarProps } from "./searchBar";
import NoteCard, { type NoteCardProps } from "./noteCard";

// ── Types ──────────────────────────────────────────────────────────────

export interface DashboardProps {
  topbar: DashboardTopbarProps;
  sidebar: DashboardSidebarProps;
  search: SearchBarProps;
  pageTitle: string;
  notes: NoteCardProps[];
  emptyStateMessage?: string;
}

// ── Re-exports for convenience ─────────────────────────────────────────

export type { DashboardTopbarProps } from "./DashboardTopbar";
export type { DashboardSidebarProps, SidebarLink } from "./DashboardSidebar";
export type { SearchBarProps } from "./searchBar";
export type { NoteCardProps } from "./noteCard";

// ── Component ──────────────────────────────────────────────────────────

export default function Dashboard(props: DashboardProps) {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <DashboardTopbar {...props.topbar} />

      {/* ── Body: sidebar + main ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar {...props.sidebar} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {props.pageTitle}
              </h1>
            </div>

            {/* Notes list */}
            {props.notes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {props.notes.map((note) => (
                  <NoteCard key={note.id} {...note} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400">
                  {props.emptyStateMessage ?? "No notes yet. Create your first note!"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
