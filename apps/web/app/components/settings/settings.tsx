"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";
import api, { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function Settings() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setError(null);
        const data = await apiRequest("/users/profile");
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || "Failed to load settings.");
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const body: any = { name, email };
      if (password) body.password = password;
      if (pendingAvatar) body.avatarUrl = pendingAvatar;

      const updated = await apiRequest("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setUser(updated);
      setPendingAvatar(null);
      setSaved(true);
      setPassword("");

    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      await apiRequest("/users/profile", { method: "DELETE" });
      // Redirect to home/login after deletion
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      setShowDeleteConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingAvatar(reader.result as string);
      setSaved(false);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const sidebarUser = user ? { name: user.name || user.email.split("@")[0], email: user.email, avatarUrl: user.avatarUrl || undefined } : undefined;

  if (error && !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-zinc-200 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Connection Error</h2>
          <p className="text-zinc-500 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-zinc-800 transition-all shadow-md cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        logo={<Logo showText={false} iconSize="w-8 h-8" />}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar
          links={sidebarLinks}
          activeLinkId="settings"
          user={sidebarUser}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8 md:py-10 bg-zinc-50/10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your account settings and profile.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-100">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-lg border-4 border-white overflow-hidden">
                      {pendingAvatar ? (
                        <img src={pendingAvatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">{user?.name || "User"}</h2>
                    <p className="text-sm text-zinc-500 mb-3">{user?.email}</p>
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Change Photo
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 ml-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-zinc-700 ml-1">New Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                        placeholder="Min. 8 characters"
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      {saved && <p className="text-emerald-600 text-sm font-bold">Changes saved!</p>}
                      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 hover:bg-zinc-800 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-sm">
                <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                <p className="text-sm text-zinc-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>

                {showDeleteConfirm ? (
                  <div className="bg-red-50 p-6 rounded-xl border border-red-100 animate-in fade-in zoom-in duration-300">
                    <p className="text-sm font-bold text-red-700 mb-4">Are you absolutely sure? All your notes and workspaces will be permanently deleted.</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-all cursor-pointer"
                      >
                        {saving ? "Deleting..." : "Yes, Delete Everything"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-white text-zinc-600 border border-zinc-200 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-50 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
