"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import Logo from "../../components/logo/logo";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";
import Price from "../price/price";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks: SidebarLink[] = [
  { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
  { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
  { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const sub = await apiRequest("/bill/subscription");
        setSubscription(sub);
      } catch (err) {
        console.error("Failed to fetch billing data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
  const sidebarUser = user ? { name: user.email.split("@")[0] || user.email, email: user.email, avatarUrl: user.avatarUrl || undefined } : undefined;

  return (
    <div className="h-screen flex flex-col bg-white">
      <DashboardTopbar
        logoText="MeetGenius"
        logoHref="/dashboard"
        logo={<Logo />}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <DashboardSidebar 
          links={sidebarLinks} 
          activeLinkId="billing" 
          user={sidebarUser} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:pl-2 py-8 bg-zinc-50/10">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Billing</h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your subscription and upgrade your account.</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
              </div>
            ) : (
              <Price
                plans={[
                  {
                    name: "Free",
                    period: "monthly",
                    price: "$0",
                    features: ["5 notes/month", "1 workspace"],
                    ctaLabel: currentPlan === "FREE" ? "Current Plan" : "Downgrade",
                    variant: "light",
                  },
                  {
                    name: "Pro",
                    period: "monthly",
                    price: "$12",
                    features: ["Unlimited notes", "Team workspaces", "PDF export"],
                    ctaLabel: upgrading === "PRO" ? "Connecting..." : currentPlan === "PRO" ? "Current Plan" : "Upgrade to Pro",
                    onClick: currentPlan === "PRO" ? undefined : () => handleUpgrade("PRO"),
                    variant: "dark",
                    isPopular: true,
                  },
                  {
                    name: "Enterprise",
                    period: "annually",
                    price: "$144",
                    features: ["Unlimited notes", "Team workspaces", "PDF export", "Priority Support"],
                    ctaLabel: upgrading === "ENTERPRISE" ? "Connecting..." : currentPlan === "ENTERPRISE" ? "Current Plan" : "Go Enterprise",
                    onClick: currentPlan === "ENTERPRISE" ? undefined : () => handleUpgrade("ENTERPRISE"),
                    variant: "dark",
                  },
                ]}
              />
            )}

            <div className="mt-16 p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-2">Subscription Details</h2>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                  <span className="text-sm font-medium text-zinc-500">Current Plan</span>
                  <span className="text-sm font-bold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full">{currentPlan}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                  <span className="text-sm font-medium text-zinc-500">Status</span>
                  <span className="text-sm font-bold text-emerald-600">{subscription?.status || "ACTIVE"}</span>
                </div>
                {subscription?.currentPeriodEnd && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-zinc-500">Next Billing Date</span>
                    <span className="text-sm font-medium text-zinc-900">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}