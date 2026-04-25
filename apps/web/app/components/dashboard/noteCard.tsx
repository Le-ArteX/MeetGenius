import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────

export interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  actionCount: number;
  href: string;
}

// ── Component ──────────────────────────────────────────────────────────

export default function NoteCard(props: NoteCardProps) {
  return (
    <Link
      href={props.href}
      id={`note-card-${props.id}`}
      className="group block border border-zinc-200 rounded-lg bg-white px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
    >
      {/* Title */}
      <h3 className="text-[15px] font-semibold text-zinc-900 truncate">
        {props.title}
      </h3>

      {/* Description */}
      <p className="mt-0.5 text-sm text-amber-600 truncate">
        {props.description}
      </p>

      {/* Bottom row: date + action badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-zinc-400">{props.date}</span>
        <span className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
          {props.actionCount} action{props.actionCount !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
