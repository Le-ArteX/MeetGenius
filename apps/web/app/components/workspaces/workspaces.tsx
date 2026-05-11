"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import Logo from "../../components/logo/logo";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks: SidebarLink[] = [
    { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
    { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
    { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

// --- Types matching backend API responses ---
interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    members: { role: "OWNER" | "EDITOR" | "VIEWER" }[];
    _count: { notes: number; members: number };
}

interface WorkspaceMember {
    userId: string;
    workspaceId: string;
    role: "OWNER" | "EDITOR" | "VIEWER";
    joinedAt: string;
    user: { id: string; email: string; avaterUrl?: string | null };
}

// --- Toast Component ---
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed top-6 right-6 z-[10000] px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all animate-[slideIn_0.3s_ease] ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
            {message}
        </div>
    );
}

// --- Avatar ---
function MemberAvatar({ email, avatarUrl, size = 28 }: { email: string; avatarUrl?: string | null; size?: number }) {
    const colors = ["#18181B", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];
    const colorIndex = email.charCodeAt(0) % colors.length;

    return (
        <div
            className="rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ width: size, height: size, backgroundColor: colors[colorIndex], border: "2px solid #fff", marginLeft: -6 }}
            title={email}
        >
            {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
                email.charAt(0).toUpperCase()
            )}
        </div>
    );
}

// --- Role Badge ---
function RoleBadge({ role }: { role: string }) {
    const colors: Record<string, string> = { OWNER: "text-orange-600", EDITOR: "text-blue-600", VIEWER: "text-zinc-500" };
    return <span className={`text-xs font-semibold ${colors[role] || "text-zinc-500"}`}>{role}</span>;
}

// --- Workspace Card ---
function WorkspaceCard({
    workspace, currentUserId, onDelete, onExpand, isExpanded, members, membersLoading,
    onRoleChange, onRemoveMember, inviteEmail, setInviteEmail, inviteRole, setInviteRole, onInvite, inviteLoading,
}: {
    workspace: Workspace; currentUserId: string; onDelete: (id: string) => void;
    onExpand: (id: string) => void; isExpanded: boolean;
    members: WorkspaceMember[]; membersLoading: boolean;
    onRoleChange: (workspaceId: string, userId: string, role: string) => void;
    onRemoveMember: (workspaceId: string, userId: string) => void;
    inviteEmail: string; setInviteEmail: (v: string) => void;
    inviteRole: string; setInviteRole: (v: string) => void;
    onInvite: (workspaceId: string) => void; inviteLoading: boolean;
}) {
    const isOwner = workspace.ownerId === currentUserId;
    const myMember = members.find(m => m.userId === currentUserId);
    const myRole = workspace.members?.[0]?.role || myMember?.role || (isOwner ? "OWNER" : "VIEWER");

    return (
        <div className="w-full border border-zinc-200 rounded-xl bg-white hover:border-zinc-300 transition-all duration-150">
            {/* Header - clickable */}
            <div className="px-5 py-4 cursor-pointer" onClick={() => onExpand(workspace.id)}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-bold text-zinc-900">{workspace.name}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            {workspace._count.members} member{workspace._count.members !== 1 ? "s" : ""} · {workspace._count.notes} note{workspace._count.notes !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RoleBadge role={myRole} />
                        <svg className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div className="border-t border-zinc-100 px-5 py-4">
                    {membersLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-900"></div>
                        </div>
                    ) : (
                        <>
                            {/* Members list */}
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Members</h4>
                            <div className="flex flex-col gap-2 mb-4">
                                {members.map((member) => (
                                    <div key={member.userId} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <MemberAvatar email={member.user.email} avatarUrl={member.user.avaterUrl} size={32} />
                                            <div>
                                                <p className="text-sm font-medium text-zinc-900">{member.user.email}</p>
                                                <p className="text-xs text-zinc-400">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {myRole === "OWNER" && member.userId !== currentUserId ? (
                                                <>
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => onRoleChange(workspace.id, member.userId, e.target.value)}
                                                        className="text-xs px-2 py-1 border border-zinc-200 rounded-lg bg-white text-zinc-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-300"
                                                    >
                                                        <option value="EDITOR">Editor</option>
                                                        <option value="VIEWER">Viewer</option>
                                                    </select>
                                                    <button
                                                        onClick={() => onRemoveMember(workspace.id, member.userId)}
                                                        className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            ) : (
                                                <RoleBadge role={member.role} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Invite section - only for OWNER and EDITOR */}
                            {(myRole === "OWNER" || myRole === "EDITOR") && (
                                <div className="border-t border-zinc-100 pt-4">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Invite to {workspace.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="colleague@email.com"
                                            onKeyDown={(e) => e.key === "Enter" && onInvite(workspace.id)}
                                            className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                                        />
                                        <select
                                            value={inviteRole}
                                            onChange={(e) => setInviteRole(e.target.value)}
                                            className="px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-700 bg-white focus:outline-none cursor-pointer"
                                        >
                                            <option value="VIEWER">Viewer</option>
                                            <option value="EDITOR">Editor</option>
                                        </select>
                                        <button
                                            onClick={() => onInvite(workspace.id)}
                                            disabled={inviteLoading}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                                        >
                                            {inviteLoading ? "..." : "Invite"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Delete workspace - only for OWNER */}
                            {isOwner && (
                                <div className="border-t border-zinc-100 pt-4 mt-4">
                                    <button
                                        onClick={() => { if (confirm(`Delete "${workspace.name}"? This cannot be undone.`)) onDelete(workspace.id); }}
                                        className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Delete workspace
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// --- Main Page ---
export default function WorkspacesPage() {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [members, setMembers] = useState<Record<string, WorkspaceMember[]>>({});
    const [membersLoading, setMembersLoading] = useState<Record<string, boolean>>({});
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("VIEWER");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type });

    // Fetch workspaces
    const fetchWorkspaces = useCallback(async () => {
        try {
            const data = await apiRequest<Workspace[]>("/workspaces");
            setWorkspaces(data);
        } catch (err: any) {
            showToast(err.message || "Failed to load workspaces", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchWorkspaces(); }, [fetchWorkspaces]);

    // Fetch members when expanding
    const handleExpand = async (id: string) => {
        if (expandedId === id) { setExpandedId(null); return; }
        setExpandedId(id);
        if (!members[id]) {
            setMembersLoading(prev => ({ ...prev, [id]: true }));
            try {
                const data = await apiRequest<WorkspaceMember[]>(`/workspaces/${id}/members`);
                setMembers(prev => ({ ...prev, [id]: data }));
            } catch (err: any) {
                showToast(err.message || "Failed to load members", "error");
            } finally {
                setMembersLoading(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    // Create workspace
    const handleCreate = async () => {
        if (!newWorkspaceName.trim() || newWorkspaceName.trim().length < 3) {
            showToast("Workspace name must be at least 3 characters", "error");
            return;
        }
        setCreateLoading(true);
        try {
            await apiRequest("/workspaces", { method: "POST", body: JSON.stringify({ name: newWorkspaceName.trim() }) });
            setNewWorkspaceName("");
            showToast("Workspace created!");
            await fetchWorkspaces();
        } catch (err: any) {
            showToast(err.message || "Failed to create workspace", "error");
        } finally {
            setCreateLoading(false);
        }
    };

    // Delete workspace
    const handleDelete = async (id: string) => {
        try {
            await apiRequest(`/workspaces/${id}`, { method: "DELETE" });
            showToast("Workspace deleted");
            if (expandedId === id) setExpandedId(null);
            await fetchWorkspaces();
        } catch (err: any) {
            showToast(err.message || "Failed to delete workspace", "error");
        }
    };

    // Invite user
    const handleInvite = async (workspaceId: string) => {
        if (!inviteEmail.trim()) return;
        setInviteLoading(true);
        try {
            await apiRequest(`/workspaces/${workspaceId}/invitations`, {
                method: "POST",
                body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
            });
            setInviteEmail("");
            showToast("Invitation sent!");
        } catch (err: any) {
            showToast(err.message || "Failed to send invitation", "error");
        } finally {
            setInviteLoading(false);
        }
    };

    // Change member role
    const handleRoleChange = async (workspaceId: string, targetUserId: string, role: string) => {
        try {
            await apiRequest(`/workspaces/${workspaceId}/members/${targetUserId}/role`, {
                method: "PATCH",
                body: JSON.stringify({ role }),
            });
            setMembers(prev => ({
                ...prev,
                [workspaceId]: (prev[workspaceId] || []).map(m =>
                    m.userId === targetUserId ? { ...m, role: role as WorkspaceMember["role"] } : m
                ),
            }));
            showToast("Role updated");
        } catch (err: any) {
            showToast(err.message || "Failed to update role", "error");
        }
    };

    // Remove member
    const handleRemoveMember = async (workspaceId: string, targetUserId: string) => {
        if (!confirm("Remove this member?")) return;
        try {
            await apiRequest(`/workspaces/${workspaceId}/members/${targetUserId}`, { method: "DELETE" });
            setMembers(prev => ({
                ...prev,
                [workspaceId]: (prev[workspaceId] || []).filter(m => m.userId !== targetUserId),
            }));
            await fetchWorkspaces();
            showToast("Member removed");
        } catch (err: any) {
            showToast(err.message || "Failed to remove member", "error");
        }
    };

    const sidebarUser = user ? { name: user.email.split("@")[0] || user.email, email: user.email, avaterUrl: user.avatarUrl || undefined } : undefined;

    return (
        <div className="h-screen flex flex-col bg-white">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <DashboardTopbar logoText="MeetGenius" logoHref="/dashboard" logo={<Logo />} onMenuClick={() => setIsSidebarOpen(true)} />

            <div className="flex flex-1 min-h-0">
                <DashboardSidebar links={sidebarLinks} activeLinkId="workspaces" user={sidebarUser} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 overflow-y-auto px-4 md:px-6 py-8 bg-zinc-50/30">
                    <div className="w-full max-w-3xl">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-8">Workspaces</h1>

                        {/* Create New Workspace */}
                        <div className="border border-zinc-200 rounded-xl px-5 py-4 mb-4 bg-white">
                            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Create new workspace</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="e.g. Product Team"
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                                />
                                <button
                                    onClick={handleCreate}
                                    disabled={createLoading}
                                    className="px-5 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                                >
                                    {createLoading ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </div>

                        {/* Workspace List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
                            </div>
                        ) : workspaces.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-zinc-400 text-sm">No workspaces yet. Create one above to get started!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 mb-6">
                                {workspaces.map((ws) => (
                                    <WorkspaceCard
                                        key={ws.id}
                                        workspace={ws}
                                        currentUserId={user?.id || ""}
                                        onDelete={handleDelete}
                                        onExpand={handleExpand}
                                        isExpanded={expandedId === ws.id}
                                        members={members[ws.id] || []}
                                        membersLoading={membersLoading[ws.id] || false}
                                        onRoleChange={handleRoleChange}
                                        onRemoveMember={handleRemoveMember}
                                        inviteEmail={inviteEmail}
                                        setInviteEmail={setInviteEmail}
                                        inviteRole={inviteRole}
                                        setInviteRole={setInviteRole}
                                        onInvite={handleInvite}
                                        inviteLoading={inviteLoading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
