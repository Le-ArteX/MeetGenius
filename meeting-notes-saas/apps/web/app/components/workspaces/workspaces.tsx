
import DashboardTopbar from "../../components/dashboard/DashboardTopbar";
import Logo from "../../components/logo/logo";
import DashboardSidebar, { SidebarLink } from "../dashboard/DashboardSidebar";


const sidebarLinks: SidebarLink[] = [
    { id: "notes", label: "Notes", href: "/dashboard", icon: "notes" },
    { id: "workspaces", label: "Workspaces", href: "/dashboard/workspaces", icon: "workspaces" },
    { id: "billing", label: "Billing", href: "/dashboard/billing", icon: "billing" },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function WorkspacesPage() {
    return (
        <div className="h-screen flex flex-col bg-white">
            <DashboardTopbar
                logoText="MeetGenius"
                logoHref="/dashboard"
                ctaLabel="Upgrade"
                logo={<Logo />}
            />

            <div className="flex flex-1 min-h-0">
                <DashboardSidebar links={sidebarLinks} activeLinkId="workspaces" />

                <main className="flex-1 overflow-y-auto pl-2 py-8 bg-white">
                    <div className="w-full max-w-480 ml-auto px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-zinc-900">Workspaces</h1>
                            <button className="px-6 py-2.5 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                                + New Workspace
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
