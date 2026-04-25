import Link from "next/link";

export interface PricePlanProps {
    name: string;
    period: string;
    price: string;
    features: string[];
    ctaLabel: string;
    ctaHref: string;
    variant?: string;
    isPopular?: boolean;
}

export interface PriceProps {
    plans: PricePlanProps[];
}

export default function Price(props: PriceProps) {
    return (
        <section id="price" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8 mx-auto">
                    {props.plans?.map((plan, i) => {
                        const isDark = plan.variant === "dark";
                        return (
                            <div key={i} className={`p-10 rounded-4xl border flex flex-col h-full transition-all hover:scale-[1.02] relative ${isDark
                                ? "bg-zinc-900 border-zinc-800 text-white shadow-2xl"
                                : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
                                }`}>
                                {plan.isPopular && (
                                    <div className="absolute top-6 right-6 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        Popular
                                    </div>
                                )}

                                <div className="mb-10">
                                    <h3 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                                        <span className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                            /{plan.period}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-5 mb-10 grow">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-4 text-base">
                                            <span className={`text-lg leading-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                                {isDark ? "+" : "•"}
                                            </span>
                                            <span className={isDark ? "text-zinc-300" : "text-zinc-600"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.ctaHref}
                                    className={`w-full py-4 px-8 rounded-2xl text-center font-bold transition-all ${isDark
                                        ? "bg-white text-zinc-900 hover:bg-zinc-100"
                                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                                        }`}
                                >
                                    {plan.ctaLabel}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
