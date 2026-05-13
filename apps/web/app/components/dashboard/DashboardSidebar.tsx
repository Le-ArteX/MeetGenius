"use client";

import Link from "next/link";

export interface SidebarLink {
  id: string;
  label: string;
  href: string;
  icon: "notes" | "workspaces" | "billing" | "settings" | "logout";
}

export interface DashboardSidebarProps {
  links: SidebarLink[];
  activeLinkId: string;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarIcon({ icon, className }: { icon: SidebarLink["icon"]; className?: string }) {
  const cls = className ?? "w-4 h-4";
  switch (icon) {
    case "notes":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "workspaces":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case "billing":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "settings":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "logout":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      );
  }
}

export default function DashboardSidebar({ links, activeLinkId, user, isOpen, onClose }: DashboardSidebarProps) {
  console.log("[Sidebar] isOpen state changed:", isOpen);

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={[
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[9999] w-72 bg-white border-r border-zinc-200 py-8 px-6 transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 md:flex md:flex-col shrink-0",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:opacity-100 md:translate-x-0"
        ].join(" ")}>
        <div className="flex flex-col gap-2 flex-1">
          {links.map((link) => {
            const isActive = link.id === activeLinkId;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={onClose}
                className={[
                  "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150",
                  isActive
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
                ].join(" ")}>
                <SidebarIcon icon={link.icon} className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="pt-6 mt-4 border-t border-zinc-100 flex flex-col gap-5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-md">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-white font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase() || "M"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-zinc-900 truncate leading-tight">{user?.name || "Mursalin Leon"}</p>
              <p className="text-[11px] font-medium text-zinc-400 truncate">{user?.email || "mursalinleon2295@gmail.com"}</p>
            </div>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-bold text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150">
            <SidebarIcon icon="logout" className="w-4 h-4 text-zinc-400 group-hover:text-red-500" />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  );
}
