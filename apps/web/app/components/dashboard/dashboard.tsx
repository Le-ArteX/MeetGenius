"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardTopbar from "./DashboardTopbar";
import Logo from "../logo/logo";
import DashboardSidebar, { SidebarLink } from "./DashboardSidebar";
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

  useEffect(() => {
    fetchWorkspaces();
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
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-zinc-900">Notes</h1>
              <div className="text-sm text-zinc-500">
                Total: <span className="font-semibold text-zinc-900">{totalNotes}</span> notes
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 w-full">
                  {filteredNotes.map((note) => (
                    <Link href={`/dashboard/${note.id}`} key={note.id}>
                      <NoteCard {...note} />
                    </Link>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
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
