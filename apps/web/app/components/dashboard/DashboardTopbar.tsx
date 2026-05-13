"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "./searchBar";
import Logo from "../logo/logo";

export interface WorkspaceItem {
  id: string;
  name: string;
}

export interface DashboardTopbarProps {
  logoText: string;
  logoHref: string;
  workspaceName?: string;
  workspaces?: WorkspaceItem[];
  onWorkspaceSelect?: (workspace: WorkspaceItem) => void;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  onSearch?: (value: string) => void;
  logo?: React.ReactNode;
  brandLogo?: React.ReactNode;
  onMenuClick?: () => void;
}

export default function DashboardTopbar(props: DashboardTopbarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 border-b border-zinc-200 bg-white h-16 shrink-0 relative z-40">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={() => props.onMenuClick?.()}
          className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 md:hidden cursor-pointer flex items-center justify-center active:bg-zinc-100 rounded-lg"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href={props.logoHref} className="flex items-center gap-2.5 shrink-0">
          {props.brandLogo || (
            <span className="text-lg font-bold text-zinc-900 tracking-tight">
              {props.logoText}
            </span>
          )}
        </Link>

        {props.onSearch && (
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar onSearch={props.onSearch} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {props.workspaceName && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <span className="max-w-[120px] truncate">{props.workspaceName}</span>
              <svg className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-zinc-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                <div className="px-4 py-2 border-b border-zinc-100">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Select Workspace</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {props.workspaces?.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        props.onWorkspaceSelect?.(ws);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors cursor-pointer ${props.workspaceName === ws.name
                          ? "bg-zinc-50 text-zinc-900 font-bold"
                          : "text-zinc-600 hover:bg-zinc-50"
                        }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {props.workspaceName === ws.name && (
                        <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-100 px-2">
                  <Link
                    href="/dashboard/workspaces"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Manage Workspaces
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {(props.ctaLabel || props.ctaHref) && (
          <Link
            href={props.ctaHref || "#"}
            onClick={(e) => {
              if (props.onCtaClick) {
                e.preventDefault();
                props.onCtaClick();
              }
            }}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-95"
          >
            {props.ctaLabel}
          </Link>
        )}

        <Link href="/dashboard" className="ml-2 hover:opacity-80 transition-opacity">
          <Logo showText={false} iconSize="w-9 h-9" />
        </Link>
      </div>
    </header>
  );
}
