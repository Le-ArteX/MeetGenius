"use client";

import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import Logo from "../../components/logo/logo";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Price from "../price/price";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function BillingPage() {
  const notesUsed = 4;
  const notesLimit = 5;
  const pct = (notesUsed / notesLimit) * 100;

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        ctaLabel="Upgrade"
        logo={<Logo />}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar links={sidebarLinks} activeLinkId="billing" />

        <main className="flex-1 overflow-y-auto pl-2 py-8 bg-white">
          <div className="w-full max-w-480 ml-auto px-6">
            <h1 className="text-3xl font-bold text-zinc-900 mb-8">Billing</h1>

            <Price
              className="px-6 py-2 w-1200px max-w-7xl ml-auto"
              plans={[
                {
                  name: "Free",
                  period: "monthly",
                  price: "$0",
                  features: ["5 notes/month", "1 workspace"],
                  ctaLabel: "Subscribed",
                  ctaHref: "/dashboard/billing",
                  variant: "light",
                },
                {
                  name: "Pro",
                  period: "monthly",
                  price: "$12",
                  features: ["Unlimited notes", "Team workspaces", "PDF export"],
                  ctaLabel: "Go Pro",
                  ctaHref: "/dashboard/billing",
                  variant: "dark",
                  isPopular: true,
                },
                {
                  name: "Enterprise",
                  period: "annually",
                  price: "$144",
                  features: ["Unlimited notes", "Team workspaces", "PDF export", "Unlimited Transcription", "File Uploads"],
                  ctaLabel: "Go Enterprise",
                  ctaHref: "/dashboard/billing",
                  variant: "dark",
                },
              ]}
            />

            <div className="mt-16 p-10 bg-zinc-50 rounded-3xl border border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-3">Billing history</h2>
              <p className="text-sm text-zinc-500">No billing history yet.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}