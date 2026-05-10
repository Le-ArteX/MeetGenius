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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await apiRequest<any[]>('/notes');
        
        // Map backend notes to NoteCardProps
        const formattedNotes: NoteCardProps[] = response.map((n: any) => ({
          id: n.id,
          title: n.title,
          preview: n.summary || n.transcript?.substring(0, 50) + "..." || "No content",
          date: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          actionCount: n.actionItems?.length || 0,
        }));
        
        setNotes(formattedNotes);
      } catch (error) {
        console.error("Failed to load notes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        workspaceName="My Workspace"
        ctaLabel="+ Note"
        ctaHref="/dashboard/new"
        logo={<Logo />}
        onSearch={(val) => console.log("Searching for:", val)}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar
          links={sidebarLinks}
          activeLinkId="notes"
          user={user ? { name: user.email.split('@')[0] || "User", email: user.email, avaterUrl: user.avatarUrl || undefined } : undefined}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-8 bg-zinc-50/30">
          <h1 className="text-3xl font-bold text-zinc-900 mb-8">Notes</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
            </div>
          ) : notes.length > 0 ? (
            <div className="flex flex-col gap-4 w-full">
              {notes.map((note) => (
                <Link href={`/dashboard/${note.id}`} key={note.id}>
                  <NoteCard {...note} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
              <p className="text-zinc-500 mb-4">No notes found yet.</p>
              <Link href="/dashboard/new" className="text-blue-600 font-semibold hover:underline">
                Create your first note →
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
