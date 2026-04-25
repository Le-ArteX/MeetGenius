import React from "react";

export default function Contact() {
    return (
        <section id="contact" className="py-24 bg-white text-zinc-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Get in touch</h2>
                    <p className="text-zinc-600 text-lg">
                        Have questions about MeetGenius? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-4xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300">

                        <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
                        <p className="text-zinc-500 mb-6 leading-relaxed">
                            For general inquiries, partnerships, or business outreach.
                        </p>
                        <a
                            href="mailto:contact@meetgenius.ai"
                            className="text-blue-500 font-bold text-lg hover:underline underline-offset-4"
                        >
                            contact@meetgenius.com
                        </a>
                    </div>

                    <div className="p-10 rounded-4xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center group   hover:bg-white hover:shadow-xl hover:border-blue-100  transition-all duration-300">
                        <h3 className="text-2xl font-bold mb-4">Technical Support</h3>
                        <p className="text-zinc-500 mb-6 leading-relaxed">
                            Need help with your account or having technical issues?
                        </p>
                        <a
                            href="mailto:support@meetgenius.ai"
                            className="text-blue-500 font-bold text-lg hover:underline underline-offset-4">
                            support@meetgenius.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
