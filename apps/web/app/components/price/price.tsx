import Link from "next/link";

export interface PricePlanProps {
    name: string;
    period: string;
    price: string;
    features: string[];
    ctaLabel: string;
    ctaHref?: string;
    onClick?: () => void;
    variant?: string;
    isPopular?: boolean;
    isActive?: boolean;
}

export interface PriceProps {
    plans: PricePlanProps[];
    className?: string;
}

export default function Price(props: PriceProps) {
    const gridCols = props.plans?.length === 2 ? "md:grid-cols-2 max-w-4xl" : "md:grid-cols-3";

    return (
        <section id="price" className={props.className ?? "py-24 bg-white"}>
            <div className="max-w-5xl mx-auto px-6">
                <div className={`grid ${gridCols} gap-6 items-stretch`}>
                    {props.plans?.map((plan, i) => {
                        const isDark = plan.variant === "dark";
                        return (
                            <div key={i} className={`p-8 rounded-[32px] border-2 flex flex-col transition-all hover:scale-[1.01] relative ${
                                plan.isActive ? "ring-4 ring-emerald-500/10 border-emerald-500" : "border-zinc-100"
                            } ${isDark
                                ? "bg-zinc-900 border-zinc-800 text-white shadow-xl"
                                : "bg-white text-zinc-900 shadow-sm"
                                }`}>
                                {plan.isPopular && (
                                    <div className="absolute top-6 right-6 bg-[#3b82f6] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                        Popular
                                    </div>
                                )}
                                {plan.isActive && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20 z-10 border-2 border-white">
                                        Active Plan
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                                        <span className={`text-sm font-medium ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                            /{plan.period}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 grow">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm">
                                            <span className={`text-base font-medium leading-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                                {isDark ? "+" : "*"}
                                            </span>
                                            <span className={isDark ? "text-zinc-300" : "text-zinc-600"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {plan.onClick ? (
                                    <button
                                        onClick={plan.onClick}
                                        className={`w-full py-3.5 px-6 rounded-xl text-center font-bold text-sm transition-all shadow-sm ${isDark
                                            ? "bg-white text-zinc-900 hover:bg-zinc-100"
                                            : "bg-zinc-900 text-white hover:bg-zinc-800"
                                            }`}>
                                        {plan.ctaLabel}
                                    </button>
                                ) : (
                                    <Link
                                        href={plan.ctaHref || "#"}
                                        className={`w-full py-3.5 px-6 rounded-xl text-center font-bold text-sm transition-all shadow-sm ${isDark
                                            ? "bg-white text-zinc-900 hover:bg-zinc-100"
                                            : "bg-zinc-900 text-white hover:bg-zinc-800"
                                            }`}>
                                        {plan.ctaLabel}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
