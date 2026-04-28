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

export default function Settings() {
  const [user, setUser] = useState({ name: "Mursalin Ahmed", email: "mursalin@example.com" });
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    // Simulate API call
    setTimeout(() => {
      setUser({ name, email });
      setSaving(false);
      setSaved(true);
      setPassword("");
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        logo={<Logo />}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar links={sidebarLinks} activeLinkId="settings" />
        <main className="flex-1 overflow-y-auto px-12 py-10 bg-zinc-50/10">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your account settings and preferences.</p>
            </div>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-zinc-900">Profile Information</h2>
                  <p className="text-zinc-500 text-xs mt-1 font-medium">Update your personal details and profile picture.</p>
                </div>

                <div className="flex items-center justify-between mb-8 pb-8 border-b border-zinc-100">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                      <span className="text-white font-bold text-xl">
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-base">{user?.name}</p>
                      <p className="text-xs text-zinc-400 font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl hover:bg-zinc-100 transition-all shadow-sm">
                    Change photo
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Full name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input w-full px-4 py-3 bg-zinc-50/50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input w-full px-4 py-3 bg-zinc-50/50"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 flex items-center justify-between">
                        New password
                        <span className="text-zinc-400 font-normal text-xs">(optional)</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        minLength={8}
                        className="input w-full px-4 py-3 bg-zinc-50/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      {saved && (
                        <p className="text-green-600 text-xs font-bold flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Changes saved successfully
                        </p>
                      )}
                      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary px-8 py-3 rounded-xl font-bold text-sm shadow-md disabled:opacity-50 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/30 border border-red-100 rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
                  <p className="text-red-600/70 text-xs mt-1 font-medium">Irreversible and destructive actions.</p>
                </div>
                <div className="flex items-center justify-between p-6 bg-white border border-red-100 rounded-xl shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Delete Account</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Permanently remove your account and all data.</p>
                  </div>
                  <button className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-5 py-2.5 rounded-xl hover:bg-red-100 transition-all shadow-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
