"use client";

// ── Types ──────────────────────────────────────────────────────────────

export interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────

export default function SearchBar(props: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      <input
        id="search-notes-input"
        type="text"
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
        placeholder={props.placeholder}
        className="w-full text-sm text-zinc-700 placeholder-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-zinc-300 transition-all"
      />
    </div>
  );
}
