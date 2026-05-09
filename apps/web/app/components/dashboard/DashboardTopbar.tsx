"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "./searchBar";
import Logo from "../logo/logo";

export interface DashboardTopbarProps {
  logoText: string;
  logoHref: string;
  workspaceName?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  onSearch?: (value: string) => void;
  logo?: React.ReactNode;
  onMenuClick?: () => void;
}


export default function DashboardTopbar(props: DashboardTopbarProps) {
  const router = useRouter();

  const ctaButton = props.ctaLabel ? (
    <button
      onClick={props.onCtaClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors whitespace-nowrap cursor-pointer">
      {props.ctaLabel}
    </button>
  ) : null;

  return (
    <header className="flex items-center justify-between px-6 border-b border-zinc-200 bg-white h-16 shrink-0 relative z-30">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => {
            console.log("Hamburger clicked!");
            console.log("Menu button clicked");
            props.onMenuClick?.();
          }}
          className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 md:hidden cursor-pointer flex items-center justify-center active:bg-zinc-100 rounded-lg"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href={props.logoHref} className="text-lg font-bold text-zinc-900 tracking-tight shrink-0">
          {props.logoText}
        </Link>

        {props.onSearch && (
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar onSearch={props.onSearch} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {props.workspaceName && (
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-700 font-medium hover:bg-zinc-50 transition-colors">
            {props.workspaceName}
            <svg className="w-3.5 h-3.5 text-zinc-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
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
          className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold shrink-0 cursor-pointer hidden sm:flex"
          onClick={() => { router.push(props.logoHref); }} >
          {props.logo}
        </div>
      </div>
    </header>
  );
}
