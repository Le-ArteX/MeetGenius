"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardTopbar from "../dashboard/DashboardTopbar";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Logo from "../logo/logo";
import { apiRequest } from "../../lib/api";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function NoteDetails() {
  const { id } = useParams();
  const router = useRouter();

  // Mock data for UI demonstration
  const note = {
    id: id,
    title: "Project Strategy Meeting",
    createdAt: new Date().toISOString(),
    wordCount: 1240,
    summary: "The team discussed the upcoming Q3 product launch. Key priorities include finalizing the mobile app redesign and starting the beta testing phase with selected customers. We also reviewed the marketing budget and decided to increase spend on social media ads by 15%.",
    keyDecision: "1. Increase marketing budget by 15%.\n2. Beta launch scheduled for August 15th.\n3. Mobile redesign finalized.",
    actionItems: [
      { id: "1", text: "Finalize mobile mockups", assignee: "Sarah", done: true },
      { id: "2", text: "Draft beta invitation email", assignee: "John", done: false },
      { id: "3", text: "Book social media ad spots", assignee: "Alex", done: false }
    ],
    transcript: "[00:00] John: Hello everyone, let's start the strategy meeting...\n[01:30] Sarah: The mobile redesign is looking great, just a few more tweaks.\n[05:00] Alex: We need more budget for the Q3 ads.\n[10:00] John: Okay, let's approve a 15% increase.",
    workspace: {
      name: "Engineering Team"
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        workspaceName={note.workspace?.name || "My Workspace"}
        ctaLabel="+ Note"
        ctaHref="/dashboard/new"
        logo={<Logo />}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar links={sidebarLinks} activeLinkId="notes" />
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 bg-zinc-50/10">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-zinc-900">{note.title}</h1>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
                    Share
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors">
                    Edit Note
                  </button>
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
                {note.summary || "No summary available yet. The AI is still processing your note."}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Key Decisions */}
              <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-6">
                <h2 className="text-lg font-bold text-zinc-900">Key Decisions</h2>
                <div className="prose prose-zinc text-zinc-700">
                  {note.keyDecision || "No decisions recorded."}
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
                <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-600 leading-relaxed max-h-96 overflow-y-auto">
                  {note.transcript || "No transcript available."}
                </pre>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
