"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";
import { apiRequest } from "../../lib/api";
import DeleteModal from "../ui/DeleteModal";

const ShareDropdown = dynamic(() => import("../ui/ShareModal"), {
  ssr: false,
  loading: () => <button className="px-4 py-2 text-sm font-medium text-zinc-400">Share</button>
});

import { useAuth } from "../../context/AuthContext";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function NoteDetails({ noteId }: { noteId?: string }) {
  const { slug, id: directId } = useParams();
  const id = noteId || directId || (Array.isArray(slug) ? slug[0] : slug);
  const router = useRouter();
  const { user } = useAuth();

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editKeyDecision, setEditKeyDecision] = useState("");
  const [editTranscript, setEditTranscript] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await apiRequest(`/notes/${id}`);
        setNote(data);
        setEditTitle(data.title || "");
        setEditSummary(data.summary || "");
        setEditKeyDecision(data.keyDecision || "");
        setEditTranscript(data.transcript || "");
      } catch (err: any) {
        setError("Failed to load note details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  useEffect(() => {
    if (error || (!loading && !note)) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, note, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 flex-col space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{error || "Note not found"}</h2>
        <p className="text-zinc-500">Returning you to dashboard...</p>
        <button onClick={() => router.push("/dashboard")} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        workspaceName={note.workspace?.name || "My Workspace"}
        ctaLabel="+ Note"
        ctaHref="/dashboard/new"
        logo={<Logo />}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar
          links={sidebarLinks}
          activeLinkId="notes"
          user={user ? { name: user.email.split('@')[0] || "User", email: user.email, avatarUrl: user.avatarUrl || undefined } : undefined}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 bg-zinc-50/10">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-3xl font-bold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 w-full max-w-xl"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-zinc-900">{note.title}</h1>
                )}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      ref={shareButtonRef}
                      onClick={() => setIsShareModalOpen(!isShareModalOpen)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isCopied ? 'bg-green-50 text-green-600' : 'text-zinc-600 hover:bg-zinc-100'}`}
                    >
                      {isCopied ? 'Copied!' : 'Share'}
                    </button>
                    <ShareDropdown
                      isOpen={isShareModalOpen}
                      onClose={() => setIsShareModalOpen(false)}
                      note={note}
                      anchorRef={shareButtonRef}
                      onCopyLink={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                    />
                  </div>

                  {isEditing ? (
                    <button
                      onClick={async () => {
                        setIsSaving(true);
                        try {
                          const updated = await apiRequest(`/notes/${id}`, {
                            method: "PATCH",
                            data: {
                              title: editTitle,
                              summary: editSummary,
                              keyDecision: editKeyDecision,
                              transcript: editTranscript,
                            }
                          });
                          setNote(updated);
                          setIsEditing(false);
                        } catch (err) {
                          console.error("Failed to update note", err);
                          alert("Failed to save changes.");
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      Edit Note
                    </button>
                  )}

                  {!isEditing && (
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {note.wordCount || 0} words
                </div>
              </div>
            </div>

            {/* AI Summary Section */}
            <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <h2 className="text-lg font-bold">AI Summary</h2>
              </div>
              <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed">
                {isEditing ? (
                  <textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    rows={4}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 resize-none"
                    placeholder="Note summary..."
                  />
                ) : (
                  note.summary || "No summary available yet. The AI is still processing your note."
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Key Decisions */}
              <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Key Decisions</h2>
                <div className="prose prose-zinc text-zinc-700">
                  {isEditing ? (
                    <textarea
                      value={editKeyDecision}
                      onChange={(e) => setEditKeyDecision(e.target.value)}
                      rows={4}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 resize-none"
                      placeholder="Key decisions..."
                    />
                  ) : (
                    note.keyDecision || "No decisions recorded."
                  )}
                </div>
              </section>

              {/* Action Items */}
              <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Action Items</h2>
                <div className="space-y-4">
                  {note.actionItems && note.actionItems.length > 0 ? (
                    note.actionItems.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded border border-zinc-300 flex items-center justify-center flex-shrink-0">
                          {item.done && (
                            <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-sm ${item.done ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>
                            {item.text}
                          </p>
                          {item.assignee && (
                            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                              @{item.assignee}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">No action items found.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Transcript Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-zinc-900">Transcript</h2>
              <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
                {isEditing ? (
                  <textarea
                    value={editTranscript}
                    onChange={(e) => setEditTranscript(e.target.value)}
                    rows={12}
                    className="w-full p-0 border-none text-xs font-mono bg-transparent placeholder:text-zinc-400 resize-none focus:ring-0"
                    placeholder="Full transcript..."
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-600 leading-relaxed max-h-96 overflow-y-auto">
                    {note.transcript || "No transcript available."}
                  </pre>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            await apiRequest(`/notes/${note.id}`, { method: "DELETE" });
            setIsDeleteModalOpen(false);
            setSuccessMessage("Note deleted successfully!");
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          } catch (err) {
            console.error("Failed to delete note", err);
            alert("Failed to delete note. Please try again.");
          }
        }}
        title="Delete Meeting Note"
        description={`Are you sure you want to delete "${note.title}"? This action is permanent and cannot be undone.`}
      />

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10003] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
