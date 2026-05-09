"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import Logo from "../../components/logo/logo";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Price from "../price/price";
import { apiRequest } from "../../lib/api";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    /*
    async function fetchData() {
      try {
        const [sub, userData] = await Promise.all([
          apiRequest("/bill/subscription"),
          apiRequest("/users/profile")
        ]);
        setSubscription(sub);
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch billing data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    */
    setUser({ name: "Mursalin Leon", email: "mursalinleon2295@gmail.com" });
    setSubscription({ plan: "FREE" });
    setLoading(false);
  }, []);

  const handleUpgrade = async (plan: string) => {
    try {
      setUpgrading(plan);
      const { checkoutUrl } = await apiRequest("/bill/checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      window.location.href = checkoutUrl;
    } catch (err: any) {
      alert(err.message || "Failed to start checkout");
    } finally {
      setUpgrading(null);
    }
  };

  const currentPlan = subscription?.plan || "FREE";

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        ctaLabel="Upgrade"
        logo={<Logo />}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar 
          links={sidebarLinks} 
          activeLinkId="billing" 
          user={user} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:pl-2 py-8 bg-white">
          <div className="w-full max-w-480 ml-auto px-6">
            <h1 className="text-3xl font-bold text-zinc-900 mb-8">Billing</h1>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-zinc-400 animate-pulse">
                Loading plans...
              </div>
            ) : (
              <Price
                className="px-6 py-2 w-1200px max-w-7xl ml-auto"
                plans={[
                  {
                    name: "Free",
                    period: "monthly",
                    price: "$0",
                    features: ["5 notes/month", "1 workspace"],
                    ctaLabel: currentPlan === "FREE" ? "Current Plan" : "Subscribed",
                    variant: "light",
                  },
                  {
                    name: "Pro",
                    period: "monthly",
                    price: "$12",
                    features: ["Unlimited notes", "Team workspaces", "PDF export"],
                    ctaLabel: upgrading === "PRO" ? "Connecting..." : currentPlan === "PRO" ? "Current Plan" : "Go Pro",
                    onClick: currentPlan === "PRO" ? undefined : () => handleUpgrade("PRO"),
                    variant: "dark",
                    isPopular: true,
                  },
                  {
                    name: "Enterprise",
                    period: "annually",
                    price: "$144",
                    features: ["Unlimited notes", "Team workspaces", "PDF export", "Unlimited Transcription", "File Uploads"],
                    ctaLabel: upgrading === "ENTERPRISE" ? "Connecting..." : currentPlan === "ENTERPRISE" ? "Current Plan" : "Go Enterprise",
                    onClick: currentPlan === "ENTERPRISE" ? undefined : () => handleUpgrade("ENTERPRISE"),
                    variant: "dark",
                  },
                ]}
              />
            )}

            <div className="mt-16 p-10 bg-zinc-50 rounded-3xl border border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900 mb-3">Billing history</h2>
              <p className="text-sm text-zinc-500">
                {subscription?.lemonSubId ? "You have an active subscription managed via LemonSqueezy." : "No billing history yet."}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}