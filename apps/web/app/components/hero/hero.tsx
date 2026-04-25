import Link from "next/link";

export interface HeroLink {
    label: string;
    href: string;
}

export interface HeroProps {
    heading: string;
    headingHighlight?: string;
    subheading: string;
    primaryHref: HeroLink;
    secondaryHref?: HeroLink;
}

export default function Hero({ heading, headingHighlight, subheading, primaryHref, secondaryHref }: HeroProps) {
    return (
        <section className='max-w-4xl mx-auto px-6 pt-20 pb-16 text-center'>
            <h1 className="max-w-[800px] mx-auto text-center text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.1] mb-5">
                {heading}
                {headingHighlight && (
                    <span className="block text-zinc-500">{headingHighlight}</span>
                )}
            </h1>
            <p className="text-zinc-500 text-lg mb-8 max-w-2xl mx-auto">
                {subheading}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
                {primaryHref && (
                    <Link href={primaryHref.href}
                        className='bg-zinc-900 text-white px-8 py-3 text-base rounded-xl border border-zinc-900 hover:bg-zinc-800 transition-colors font-medium'>
                        {primaryHref.label}
                    </Link>
                )}

                {secondaryHref && (
                    <Link href={secondaryHref.href}
                        className='bg-transparent text-zinc-900 px-8 py-3 text-base rounded-xl border border-zinc-200 hover:bg-zinc-100 transition-colors font-medium'>
                        {secondaryHref.label}
                    </Link>
                )}
            </div>
        </section>
    );
}