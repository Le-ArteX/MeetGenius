"use client";

import React, { useState } from "react";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([
    { id: "1", name: "My Workspace", members: [{ id: "m1", user: { name: "M" }, role: "OWNER" }, { id: "m2", user: { name: "M" }, role: "EDITOR" }, { id: "m3", user: { name: "M" }, role: "VIEWER" }], role: "OWNER" },
    { id: "2", name: "Product Team", members: [{ id: "m4", user: { name: "M" }, role: "OWNER" }, { id: "m5", user: { name: "M" }, role: "EDITOR" }, { id: "m6", user: { name: "M" }, role: "EDITOR" }], role: "EDITOR" },
  ]);
  const [selected, setSelected] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [invite, setInvite] = useState({ email: "", role: "VIEWER" });
  const [inviting, setInviting] = useState(false);

  const createWorkspace = async () => {
    if (!newName) return;
    setCreating(true);
    setTimeout(() => {
      setWorkspaces([...workspaces, { id: Math.random().toString(), name: newName, members: [], role: "OWNER" }]);
      setNewName("");
      setCreating(false);
    }, 600);
  };

  const inviteMember = async () => {
    if (!invite.email || !selected) return;
    setInviting(true);
    setTimeout(() => {
      setWorkspaces(prev => prev.map(ws => {
        if (ws.id === selected.id) {
          return {
            ...ws,
            members: [...(ws.members || []), { id: Math.random().toString(), user: { name: "M" }, role: invite.role }]
          };
        }
        return ws;
      }));
      setInvite({ email: "", role: "VIEWER" });
      setInviting(false);
    }, 600);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetingMind"
        logoHref="/dashboard"
        workspaceName="My Workspace"
        ctaLabel="+ Note"
        logo={<Logo />}
        onSearch={(val) => console.log("Searching for:", val)}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar links={sidebarLinks} activeLinkId="workspaces" />
        <main className="flex-1 overflow-y-auto px-12 py-8 bg-zinc-50/10">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-3xl font-bold text-zinc-900 mb-6">Workspaces</h1>
            
            {/* Create */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <p className="text-lg font-bold text-zinc-900 mb-3">Create new workspace</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Product Team"
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                />
                <button
                  onClick={createWorkspace}
                  disabled={creating}
                  className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {creating ? "..." : "Create"}
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => setSelected(ws.id === selected?.id ? null : ws)}
                  className={`bg-white border border-zinc-200 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md
                    ${selected?.id === ws.id ? "ring-2 ring-zinc-900 shadow-lg" : "shadow-sm"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-zinc-900">{ws.name}</p>
                      <p className="text-sm text-zinc-400 font-medium">{ws.members?.length ?? 0} members</p>
                      
                      <div className="flex -space-x-2 mt-3">
                        {ws.members?.slice(0, 3).map((m: any) => (
                          <div
                            key={m.id}
                            className="w-8 h-8 rounded-full bg-black border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                          >
                            M
                          </div>
                        ))}
                        {ws.members && ws.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-500">
                            +{ws.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize
                      ${ws.role === "OWNER" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                      {ws.role?.toLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite */}
            {selected && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mt-8">
                <p className="text-lg font-bold text-zinc-900 mb-3">
                  Invite to <span className="text-zinc-900">{selected.name}</span>
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={invite.email}
                    onChange={(e) => setInvite((p) => ({ ...p, email: e.target.value }))}
                    placeholder="colleague@email.com"
                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                  />
                  <div className="relative">
                    <select
                      value={invite.role}
                      onChange={(e) => setInvite((p) => ({ ...p, role: e.target.value }))}
                      className="appearance-none px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium pr-10 focus:outline-none"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                      <option value="OWNER">Owner</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={inviteMember}
                    disabled={inviting}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {inviting ? "..." : "Invite"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
