"use client";

import { useState } from "react";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import Logo from "../../components/logo/logo";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";

const sidebarLinks: SidebarLink[] = [
    { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
    { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
    { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

// --- Types ---
interface WorkspaceMember {
    id: string;
    name: string;
    avatarColor: string;
}

interface Workspace {
    id: string;
    name: string;
    role: "Owner" | "Editor" | "Viewer";
    members: WorkspaceMember[];
}

// --- Sample Data ---
const sampleWorkspaces: Workspace[] = [
    {
        id: "1",
        name: "My Workspace",
        role: "Owner",
        members: [
            { id: "m1", name: "Mark", avatarColor: "#18181B" },
            { id: "m2", name: "Mia", avatarColor: "#18181B" },
            { id: "m3", name: "Max", avatarColor: "#18181B" },
        ],
    },
    {
        id: "2",
        name: "Product Team",
        role: "Editor",
        members: [
            { id: "m4", name: "Mike", avatarColor: "#18181B" },
            { id: "m5", name: "Mona", avatarColor: "#18181B" },
            { id: "m6", name: "Matt", avatarColor: "#18181B" },
        ],
    },
];

// --- Avatar Component ---
function MemberAvatar({ member, size = 28 }: { member: WorkspaceMember; size?: number }) {
    return (
        <div
            className="rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{
                width: size,
                height: size,
                backgroundColor: member.avatarColor,
                border: "2px solid #fff",
                marginLeft: -6,
            }}
            title={member.name}
        >
            {member.name.charAt(0).toUpperCase()}
        </div>
    );
}

// --- Role Badge ---
function RoleBadge({ role }: { role: Workspace["role"] }) {
    const colors: Record<Workspace["role"], string> = {
        Owner: "text-orange-600",
        Editor: "text-blue-600",
        Viewer: "text-zinc-500",
    };
    return (
        <span className={`text-sm font-semibold ${colors[role]}`}>
            {role}
        </span>
    );
}

// --- Workspace Card ---
function WorkspaceCard({ workspace }: { workspace: Workspace }) {
    return (
        <div className="w-full border border-zinc-200 rounded-xl px-5 py-4 bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-150">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-base font-bold text-zinc-900">{workspace.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{workspace.members.length} members</p>
                </div>
                <RoleBadge role={workspace.role} />
            </div>
            <div className="flex items-center mt-3" style={{ paddingLeft: 6 }}>
                {workspace.members.map((member) => (
                    <MemberAvatar key={member.id} member={member} />
                ))}
            </div>
        </div>
    );
}

export default function WorkspacesPage() {
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"Viewer" | "Editor">("Viewer");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateWorkspace = () => {
        if (!newWorkspaceName.trim()) return;
        // TODO: Call API to create workspace
        console.log("Creating workspace:", newWorkspaceName);
        setNewWorkspaceName("");
        setIsCreateOpen(false);
    };

    const handleInvite = () => {
        if (!inviteEmail.trim()) return;
        // TODO: Call API to invite user
        console.log("Inviting:", inviteEmail, "as", inviteRole);
        setInviteEmail("");
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            <DashboardTopbar
                logoText="MeetGenius"
                logoHref="/dashboard"
                logo={<Logo />}
            />

            <div className="flex flex-1 min-h-0">
                <DashboardSidebar links={sidebarLinks} activeLinkId="workspaces" />

                <main className="flex-1 overflow-y-auto px-6 py-8 bg-zinc-50/30">
                    <div className="w-full">
                        {/* Page Title */}
                        <h1 className="text-3xl font-bold text-zinc-900 mb-8">Workspaces</h1>

                        {/* Create New Workspace */}
                        <div className="border border-zinc-200 rounded-xl px-5 py-4 mb-4 bg-white">
                            <button
                                onClick={() => setIsCreateOpen(!isCreateOpen)}
                                className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer w-full text-left"
                            >
                                Create new workspace
                            </button>

                            {isCreateOpen && (
                                <div className="flex items-center gap-3 mt-3">
                                    <input
                                        type="text"
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                        placeholder="e.g. Product Team"
                                        onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
                                        className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all bg-white"
                                    />
                                    <button
                                        onClick={handleCreateWorkspace}
                                        className="px-5 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                                    >
                                        Create
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Workspace List */}
                        <div className="flex flex-col gap-3 mb-6">
                            {sampleWorkspaces.map((ws) => (
                                <WorkspaceCard key={ws.id} workspace={ws} />
                            ))}
                        </div>

                        {/* Invite Section */}
                        <div className="border border-zinc-200 rounded-xl px-5 py-4 bg-white">
                            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
                                Invite to My Workspace
                            </h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@email.com"
                                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                                    className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all bg-white"
                                />
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as "Viewer" | "Editor")}
                                    className="px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all cursor-pointer"
                                >
                                    <option value="Viewer">Viewer</option>
                                    <option value="Editor">Editor</option>
                                </select>
                                <button
                                    onClick={handleInvite}
                                    className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                                >
                                    Invite
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
