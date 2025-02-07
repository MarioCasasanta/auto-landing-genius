
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import LandingPages from "@/components/dashboard/LandingPages";
import Support from "@/components/dashboard/Support";
import Settings from "@/components/dashboard/Settings";
import SwipeFiles from "@/components/dashboard/SwipeFiles";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/landing-pages" element={<LandingPages />} />
            <Route path="/swipe-files" element={<SwipeFiles />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </DashboardLayout>
      </div>
    </SidebarProvider>
  );
}
