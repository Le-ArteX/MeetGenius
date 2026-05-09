"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";
import api, { apiRequest } from "../../lib/api";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setError(err.message || "Failed to load settings. Are you logged in?");
      }
    }
    fetchProfile();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const updated = await apiRequest("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, email }),
      });
      setUser(updated);
      setSaved(true);
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      setSaving(true);
      const response = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser({ ...user, avaterUrl: response.data.avatarUrl });
      setSaved(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

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
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-zinc-800 transition-all shadow-md cursor-pointer"
            >
              Retry Connection
            </button>
            <p className="text-xs text-zinc-400 mt-2">
              Make sure your API server is running on <span className="font-mono">localhost:4000</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Loading settings...</p>
      </div>
    </div>
  );

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
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Settings</h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your account settings and preferences.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-zinc-900">Profile Information</h2>
                  <p className="text-zinc-500 text-xs mt-1 font-medium">Update your personal details and profile picture.</p>
                </div>

                <div className="flex items-center justify-between mb-8 pb-8 border-b border-zinc-100">
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-lg border-4 border-white overflow-hidden">
                        {user?.avaterUrl ? (
                          <img src={user.avaterUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-xl">
                            {user?.name?.[0]?.toUpperCase() ?? "U"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-base">{user?.name}</p>
                      <p className="text-xs text-zinc-400 font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={handleAvatarClick}
                    className="text-xs font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl hover:bg-zinc-100 transition-all shadow-sm cursor-pointer"
                  >
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
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      {saved && (
                        <p className="text-green-600 text-xs font-bold flex items-center gap-1.5 animate-pulse">
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
                      className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md disabled:opacity-50 transition-all hover:bg-zinc-800 active:scale-[0.98] cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

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
                  <button className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-5 py-2.5 rounded-xl hover:bg-red-100 transition-all shadow-sm cursor-pointer">
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
