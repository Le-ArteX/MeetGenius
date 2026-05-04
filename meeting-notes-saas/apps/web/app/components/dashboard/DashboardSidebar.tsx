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
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      );
  }
}

export default function DashboardSidebar({ links, activeLinkId }: DashboardSidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 py-8 px-6"
      style={{ borderRight: "1px solid #e4e4e7", backgroundColor: "#ffffff" }}>
      <div className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = link.id === activeLinkId;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={[
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-zinc-100 text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
              ].join(" ")}>
              <SidebarIcon icon={link.icon} className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="pt-4 mt-4 border-t border-zinc-100">
        <Link
          href="/"
          className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 transition-all duration-150">
          <SidebarIcon icon="logout" className="w-5 h-5 text-red-500" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
