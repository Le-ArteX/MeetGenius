"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardTopbar from "./DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "./DashboardSidebar";
import Logo from "../logo/logo";
import NoteCard, { NoteCardProps } from "./noteCard";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<NoteCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Workspace state
  const [workspaces, setWorkspaces] = useState<{ id: string, name: string }[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{ id: string, name: string } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [usage, setUsage] = useState<{ count: number, limit: number, plan: string } | null>(null);

  const fetchWorkspaces = async () => {
    try {
      const response = await apiRequest<any>('/workspaces?limit=100');
      setWorkspaces(response.data || []);
    } catch (error) {
      console.error("Failed to load workspaces", error);
    }
  };

  const fetchNotes = async (page: number, workspaceId?: string) => {
    setLoading(true);
    try {
      const url = `/notes?page=${page}&limit=15${workspaceId ? `&workspaceId=${workspaceId}` : ''}`;
      const response = await apiRequest<any>(url);
      const { data, total, totalPages: totalP } = response;

      // Map backend notes to NoteCardProps
      const formattedNotes: NoteCardProps[] = data.map((n: any) => ({
        id: n.id,
        title: n.title,
        preview: n.summary || (n.transcript ? n.transcript.substring(0, 80) + "..." : "Processing summary..."),
        date: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actionCount: n.actionItems?.length || 0,
        workspaceName: n.workspace?.name,
      }));

      setNotes(formattedNotes);
      setTotalPages(totalP);
      setTotalNotes(total);
    } catch (error) {
      console.error("Failed to load notes", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await apiRequest<any>('/notes/usage');
      setUsage(response);
    } catch (error) {
      console.error("Failed to load usage", error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    fetchUsage();
  }, []);

  useEffect(() => {
    fetchNotes(currentPage, selectedWorkspace?.id);
  }, [currentPage, selectedWorkspace]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.workspaceName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        workspaceName={
          selectedWorkspace?.id === "personal" 
            ? "Personal Notes" 
            : selectedWorkspace?.name || "All Notes"
        }
        workspaces={[
          { id: "", name: "All Notes" },
          { id: "personal", name: "Personal Notes" },
          ...workspaces
        ]}
        onWorkspaceSelect={(ws) => {
          setSelectedWorkspace(ws.id === "" ? null : ws);
          setCurrentPage(1);
        }}
        ctaLabel="+ Note"
        ctaHref="/dashboard/new"
        logo={<Logo showText={false} iconSize="w-8 h-8" />}
        onSearch={(val) => setSearchQuery(val)}
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
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-8 bg-zinc-50/30">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Notes</h1>
              <div className="text-sm text-zinc-500 font-medium">
                Total: <span className="font-bold text-zinc-900">{totalNotes}</span> notes
              </div>
            </div>

            {usage && (
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-zinc-600">Notes used this month</span>
                  <span className="text-sm font-black text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {usage.count} / {usage.limit === 999999 ? "∞" : usage.limit}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      (usage.count / usage.limit) >= 0.8 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-zinc-900"
                    }`}
                    style={{ width: `${Math.min(100, (usage.count / usage.limit) * 100)}%` }}
                  />
                </div>
                {(usage.count / usage.limit) >= 0.8 && (
                  <div className="mt-4 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-500">
                    <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 9v4M12 17h.01M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z" />
                      </svg>
                      You're almost at your limit.
                    </p>
                    <Link href="/dashboard/billing" className="text-xs font-black text-zinc-900 underline hover:text-zinc-600 transition-all uppercase tracking-tighter">
                      Upgrade for more →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="flex flex-col gap-6 w-full pb-10">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} {...note} />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-200 mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                            currentPage === i + 1 
                              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                              : "text-zinc-500 hover:bg-zinc-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                <p className="text-zinc-500 mb-4">
                  {searchQuery ? `No notes found matching "${searchQuery}"` : "No notes found yet."}
                </p>
                <Link href="/dashboard/new" className="text-blue-600 font-semibold hover:underline">
                  Create your first note →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
