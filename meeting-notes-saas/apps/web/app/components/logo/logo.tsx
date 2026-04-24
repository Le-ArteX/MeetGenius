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
            <div className={`${iconSize} bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0`}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M8 10h.01"></path>
                    <path d="M12 10h.01"></path>
                    <path d="M16 10h.01"></path>
                </svg>
            </div>
        </div>
    );
}
