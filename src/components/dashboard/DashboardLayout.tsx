
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, MessageSquare, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Landing Pages", icon: FileText, path: "/dashboard/landing-pages" },
  { title: "Support", icon: MessageSquare, path: "/dashboard/support" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-xl font-bold px-6 py-4">Auto Landing</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-2 ${
                          location.pathname === item.path
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6 overflow-auto">
        <SidebarTrigger className="mb-4" />
        {children}
      </main>
    </>
  );
}
