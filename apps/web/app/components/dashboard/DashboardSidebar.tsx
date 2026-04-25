"use client";

import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────

export interface SidebarLink {
  id: string;
  label: string;
  href: string;
  icon: "notes" | "workspaces" | "billing" | "settings";
}

export interface DashboardSidebarProps {
  links: SidebarLink[];
  activeLinkId: string;
}

// ── Component ──────────────────────────────────────────────────────────

export default function DashboardSidebar(props: DashboardSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-48 shrink-0 border-r border-zinc-200 bg-white py-6 px-4 gap-0.5">
      {props.links.map((link) => {
        const isActive = link.id === props.activeLinkId;

        return (
          <Link
            key={link.id}
            href={link.href}
            id={`sidebar-${link.id}`}
            className={`
              block px-3 py-2 rounded-md text-sm transition-colors duration-150
              ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-zinc-500 font-normal hover:text-zinc-800"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
