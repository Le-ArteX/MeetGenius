"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/logo/logo";

function AcceptContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: authLoading } = useAuth();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Joining workspace...");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Invalid invitation link. No token found.");
            return;
        }

        if (authLoading) return;

        if (!user) {
            // Store target in session and go to login
            const currentPath = window.location.pathname + window.location.search;
            localStorage.setItem("redirectAfterLogin", currentPath);
            router.push("/login?message=Please login to accept the invitation");
            return;
        }

        const accept = async () => {
            try {
                await apiRequest(`/workspaces/invitations/accept?token=${token}`, {
                    method: "POST"
                });
                setStatus("success");
                setMessage("Successfully joined the workspace! Redirecting to dashboard...");
                setTimeout(() => router.push("/dashboard/workspaces"), 2000);
            } catch (err: any) {
                setStatus("error");
                setMessage(err.message || "Failed to join workspace. The link may be expired or invalid.");
            }
        };

        accept();
    }, [searchParams, user, authLoading, router]);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 p-8 border border-zinc-100 text-center">
                <div className="mb-8 flex justify-center">
                    <Logo />
                </div>

                {status === "loading" && (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900">Joining Workspace</h2>
                        <p className="text-zinc-500">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900">Welcome Aboard!</h2>
                        <p className="text-zinc-600">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900">Invitation Error</h2>
                        <p className="text-zinc-600 mb-6">{message}</p>
                        <button 
                            onClick={() => router.push("/dashboard")}
                            className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all active:scale-[0.98]"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AcceptInvitationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
            </div>
        }>
            <AcceptContent />
        </Suspense>
    );
}
