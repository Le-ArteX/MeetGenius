"use client";

export interface NoteCardProps {
    id: string;
    title: string;
    preview: string;
    date: string;
    actionCount: number;
    onClick?: (id: string) => void;
}

export default function NoteCard({ id, title, preview, date, actionCount, onClick }: NoteCardProps) {
    return (
        <div
            onClick={() => onClick?.(id)}
            className="w-full flex items-center justify-between px-6 py-5 border border-zinc-200 rounded-xl bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-150 cursor-pointer group"
        >
            <div className="flex flex-col gap-1.5 flex-1 min-w-0 mr-8">
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">{title}</h3>
                <p className="text-sm text-zinc-500 font-medium truncate">{preview}</p>
                <span className="text-sm text-zinc-400">{date}</span>
            </div>
            
            <div className="flex items-center shrink-0">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg group-hover:bg-blue-100 transition-colors whitespace-nowrap">
                    {actionCount} actions
                </span>
            </div>
        </div>
    );
}
