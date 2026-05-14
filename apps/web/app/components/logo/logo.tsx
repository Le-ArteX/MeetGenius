import React from "react";

interface LogoProps {
    className?: string;
    iconSize?: string;
    showText?: boolean;
    textClassName?: string;
}

export default function Logo({
    className = "flex items-center gap-2.5",
    iconSize = "w-8 h-8",
    showText = true,
    textClassName = "text-base font-bold tracking-tight text-zinc-900"
}: LogoProps) {
    return (
        <div className={className}>
            <div className="relative">

                <div className={`absolute inset-0 ${iconSize} bg-blue-500/30 blur-xl rounded-[12px]`} />

                <div className={`${iconSize} bg-blue-600 rounded-[12px] flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0 relative z-10 border border-white/10`}>
                    <svg
                        suppressHydrationWarning
                        className="w-[55%] h-[55%] text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"></circle>
                        <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"></circle>
                        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"></circle>
                    </svg>
                </div>
            </div>
            {showText && (
                <span className={textClassName}>MeetGenius</span>
            )}
        </div>
    );
}
