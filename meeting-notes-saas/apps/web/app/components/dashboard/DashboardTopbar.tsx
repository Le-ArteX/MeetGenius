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
    <header className="flex items-center justify-between px-6 border-b border-zinc-200 bg-white h-16 shrink-0">
      <div className="flex items-center gap-8 flex-1">
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
          className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold shrink-0 cursor-pointer"
          onClick={() => { router.push(props.logoHref); }} >
          {props.logo}
        </div>
      </div>
    </header>
  );
}
