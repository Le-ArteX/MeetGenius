"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiRequest } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

export default function AcceptInvitationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            // Redirect to login, then back here after auth
            router.push(`/login?redirect=/dashboard/workspaces/accept?token=${token}`);
            return;
        }

        if (!token) {
            setStatus("error");
            setMessage("Invalid invitation link — no token provided.");
            return;
        }

        const accept = async () => {
            try {
                await apiRequest(`/workspaces/invitations/accept?token=${token}`, { method: "POST" });
                setStatus("success");
                setMessage("You've successfully joined the workspace!");
            } catch (err: any) {
                setStatus("error");
                setMessage(err.message || "Failed to accept invitation.");
            }
        };

        accept();
    }, [token, user, authLoading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                {status === "loading" && (
                    <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-900 mx-auto mb-4"></div>
                        <p className="text-sm text-zinc-500">Accepting invitation...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 mb-2">Welcome!</h2>
                        <p className="text-sm text-zinc-500 mb-6">{message}</p>
                        <button
                            onClick={() => router.push("/dashboard/workspaces")}
                            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            Go to Workspaces
                        </button>
                    </>
                )}
                {status === "error" && (
                    <>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 mb-2">Something went wrong</h2>
                        <p className="text-sm text-zinc-500 mb-6">{message}</p>
                        <button
                            onClick={() => router.push("/dashboard/workspaces")}
                            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            Go to Workspaces
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
