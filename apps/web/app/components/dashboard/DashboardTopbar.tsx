"use client";

import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
}

export interface UserProfile {
  initials: string;
  avatarUrl?: string;
  name: string;
}

export interface DashboardTopbarProps {
  logoText: string;
  logoHref: string;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onWorkspaceChange?: (id: string) => void;
  ctaLabel: string;
  onCtaClick?: () => void;
  user: UserProfile;
}

// ── Component ──────────────────────────────────────────────────────────

export default function DashboardTopbar(props: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 border-b border-zinc-200 bg-white">
      {/* Left – Brand name */}
      <Link href={props.logoHref} className="text-base font-bold tracking-tight text-zinc-900">
        {props.logoText}
      </Link>

      {/* Centre – Workspace selector */}
      <div className="hidden sm:flex items-center">
        <div className="relative">
          <select
            id="workspace-select"
            value={props.activeWorkspaceId}
            onChange={(e) => props.onWorkspaceChange?.(e.target.value)}
            className="appearance-none text-sm text-zinc-700 font-medium bg-white border border-zinc-300 rounded-md pl-3 pr-8 py-1.5 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
          >
            {props.workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Right – CTA + avatar */}
      <div className="flex items-center gap-3">
        <button
          id="new-note-btn"
          onClick={props.onCtaClick}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-zinc-900 px-4 py-1.5 rounded-lg hover:bg-zinc-700 active:scale-[0.97] transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {props.ctaLabel}
        </button>

        {/* Avatar */}
        <button
          id="user-avatar-btn"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:ring-2 hover:ring-zinc-400/40 transition-all"
          title={props.user.name}
        >
          {props.user.avatarUrl ? (
            <img
              src={props.user.avatarUrl}
              alt={props.user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            props.user.initials
          )}
        </button>
      </div>
    </header>
  );
}
