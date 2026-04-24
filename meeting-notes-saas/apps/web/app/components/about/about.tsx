import React from "react";
import Image from "next/image";

export interface AboutProps {
    title: string;
    titleHighlight: string;
    description: string;
    mission: string;
    stats: { label: string; value: string }[];
}

export default function About(props: AboutProps) {
    return (
        <section id="about" className="py-24 bg-white text-zinc-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-sm font-medium text-blue-600">
                            Our Mission
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-zinc-900">
                            {props.title} <span className="text-blue-500">{props.titleHighlight}</span>
                        </h2>
                        <p className="text-xl text-zinc-600 leading-relaxed">
                            {props.description}
                        </p>
                        <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm">
                            <h3 className="text-lg font-semibold mb-3 text-zinc-900">The Why Behind MeetGenius</h3>
                            <p className="text-zinc-600">
                                {props.mission}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
                            {props.stats.map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-3xl font-bold text-zinc-900">{stat.value}</div>
                                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-3xl" />
                        <div className="relative rounded-3xl border border-zinc-200 overflow-hidden bg-white shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
                                alt="About MeetGenius"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
