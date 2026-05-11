"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "./searchBar";

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ctaButton = props.ctaLabel ? (
    <button
      onClick={props.onCtaClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors whitespace-nowrap cursor-pointer">
      {props.ctaLabel}
    </button>
  ) : null;

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
              {props.workspaceName}
              <svg className={`w-3.5 h-3.5 text-zinc-400 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && props.workspaces && props.workspaces.length > 0 && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Switch Workspace
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {props.workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        props.onWorkspaceSelect?.(ws);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        props.workspaceName === ws.name 
                          ? "bg-zinc-50 text-zinc-900 font-bold" 
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {props.workspaceName === ws.name && (
                        <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Manage Workspaces
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {(props.workspaceName || props.ctaLabel) && (
          <div className="h-6 w-px bg-zinc-200 mx-1 hidden lg:block" />
        )}

        {props.ctaHref ? (
          <Link href={props.ctaHref}>
            {ctaButton}
          </Link>
        ) : (
          ctaButton
        )}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer hidden sm:flex overflow-hidden"
          onClick={() => { router.push(props.logoHref); }} >
          {props.logo}
        </div>
      </div>
    </header>
  );
}
