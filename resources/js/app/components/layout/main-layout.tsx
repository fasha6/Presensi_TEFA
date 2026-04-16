import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Toaster } from "../ui/sonner";
import { cn } from "../ui/utils";

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-background">
      <button
        type="button"
        aria-label="Buka menu"
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed left-4 top-4 z-40 w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center dark:bg-card dark:border-border"
      >
        <Menu className="w-5 h-5 text-gray-700 dark:text-foreground" />
      </button>

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
      />
      
      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <Outlet />
      </div>

      <Toaster />
    </div>
  );
}
