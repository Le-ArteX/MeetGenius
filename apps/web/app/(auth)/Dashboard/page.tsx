"use client";

import { useState } from "react";
import Dashboard, { type DashboardProps } from "../../components/dashboard/dashboard";

const dashboardData: Omit<DashboardProps, "search"> = {
    topbar: {
        logoText: "MeetingMind",
        logoHref: "/Dashboard",
        workspaces: [
            { id: "ws-1", name: "My Workspace" },
            { id: "ws-2", name: "Team Alpha" },
            { id: "ws-3", name: "Client Projects" },
        ],
        activeWorkspaceId: "ws-1",
        ctaLabel: "+ Note",
        user: {
            initials: "M",
            name: "Mursa",
        },
    },

    sidebar: {
        links: [
            { id: "notes", label: "Notes", href: "/Dashboard", icon: "notes" },
            { id: "workspaces", label: "Workspaces", href: "/Dashboard/workspaces", icon: "workspaces" },
            { id: "billing", label: "Billing", href: "/Dashboard/billing", icon: "billing" },
            { id: "settings", label: "Settings", href: "/Dashboard/settings", icon: "settings" },
        ],
        activeLinkId: "notes",
    },

    pageTitle: "Notes",

    notes: [
        {
            id: "1",
            title: "Weekly Standup",
            description: "Discussed Q1 targets, sprint velocity......",
            date: "Jan 12",
            actionCount: 3,
            href: "/Dashboard/notes/1",
        },
        {
            id: "2",
            title: "Client Call - Acme",
            description: "Client requested dashboard redesign......",
            date: "Jan 10",
            actionCount: 5,
            href: "/Dashboard/notes/2",
        },
        {
            id: "3",
            title: "Design Review",
            description: "Approved new dashboard mockups......",
            date: "Jan 8",
            actionCount: 2,
            href: "/Dashboard/notes/3",
        },
        {
            id: "4",
            title: "Sprint Planning",
            description: "Selected 14 story points for sprint......",
            date: "Jan 6",
            actionCount: 8,
            href: "/Dashboard/notes/4",
        },
    ],

    emptyStateMessage: "No notes yet. Create your first note!",
};

export default function Page() {
    const [searchValue, setSearchValue] = useState("");

    const searchProps = {
        placeholder: "Search notes...",
        value: searchValue,
        onChange: setSearchValue,
    };

    const filteredNotes = dashboardData.notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            note.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <Dashboard
            {...dashboardData}
            search={searchProps}
            notes={filteredNotes}
        />
    );
}
