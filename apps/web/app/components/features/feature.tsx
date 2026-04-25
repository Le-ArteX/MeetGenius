import React from "react";

export interface FeatureItem {
    title: string;
    description: string;
}

export interface FeatureLink {
    label: string;
    href: string;
}

export interface FeatureProps {
    title?: string;
    titleHighlight?: string;
    subheading?: string;
    features?: FeatureItem[];
    links?: FeatureLink[];
}

export default function Feature(props: FeatureProps) {
    return (
        <section id="features" className="py-16 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                        {props.title} <span className="text-blue-500">{props.titleHighlight}</span>
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        {props.subheading}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {props.features?.map((feature, i) => (
                        <div key={i} className="p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-zinc-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
