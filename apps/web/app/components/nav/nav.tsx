import Link from "next/link";
import Logo from "../logo/logo";


export interface NavLink {
    label: string;
    href: string;
}

export interface NavProps {
    logoText: string;
    logoHref: string;
    links: NavLink[];
    signInLabel: string;
    signInHref: string;
    ctaLabel: string;
    ctaHref: string;
}

export default function Nav(props: NavProps) {
    const showText = true;
    const textClassName = "text-base font-bold tracking-tight text-zinc-900";

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-8 border-b border-zinc-200 bg-white/80 backdrop-blur-md ">

            <Link href={props.logoHref} className="flex items-center gap-2.5">
                <Logo showText={false} />
                {showText && (
                    <span className={textClassName}>
                        {props.logoText}
                    </span>
                )}
            </Link>


            {props.links.length > 0 && (
                <div className="hidden md:flex items-center gap-1">
                    {props.links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-zinc-500 px-3 py-1.5 rounded-md hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}


            <div className="flex items-center gap-2">
                <Link
                    href={props.signInHref}
                    className="text-sm text-zinc-600 px-4 py-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                >
                    {props.signInLabel}
                </Link>
                <Link
                    href={props.ctaHref}
                    className="text-sm text-white bg-zinc-900 px-4 py-1.5 rounded-md hover:bg-zinc-700 transition-colors font-medium" >
                    {props.ctaLabel}
                </Link>
            </div>
        </nav>
    );
}
