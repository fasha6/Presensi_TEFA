import { NavLink } from "react-router";
import { LayoutDashboard, ClipboardCheck, Users, FileWarning, Bell, Settings, GraduationCap, Menu, X, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";
import { DemoRole, useAuth } from "../../lib/auth";

const allRoles: DemoRole[] = [
  "secretary",
  "homeroom",
  "major_head",
  "teacher",
  "student",
  "parent",
  "bk",
  "student_affairs",
  "curriculum",
  "operator",
  "principal",
];

const studentDataRoles: DemoRole[] = [
  "secretary",
  "homeroom",
  "major_head",
  "teacher",
  "bk",
  "student_affairs",
  "curriculum",
  "operator",
  "principal",
];

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", roles: allRoles },
  { icon: ClipboardCheck, label: "Presensi", path: "/presensi", roles: ["secretary", "homeroom", "teacher", "operator"] },
  { icon: Users, label: "Siswa", path: "/siswa", roles: studentDataRoles },
  { icon: UserRound, label: "Profil Saya", path: "/siswa/1", roles: ["student"] },
  { icon: UserRound, label: "Data Anak", path: "/siswa/1", roles: ["parent"] },
  { icon: FileWarning, label: "SP & Pembinaan", path: "/sp", roles: ["homeroom", "bk", "student_affairs", "operator", "principal"] },
  { icon: Bell, label: "Notifikasi", path: "/notifikasi", roles: allRoles },
  { icon: Settings, label: "Pengaturan", path: "/pengaturan", roles: allRoles },
] satisfies Array<{
  icon: LucideIcon;
  label: string;
  path: string;
  roles: DemoRole[];
}>;

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

export function Sidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  const { user } = useAuth();
  const visibleMenuItems = menuItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 dark:bg-sidebar dark:border-sidebar-border",
          "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center dark:bg-primary">
                <GraduationCap className="w-6 h-6 text-white dark:text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900 dark:text-sidebar-foreground">TEFA Presensi</span>
                <span className="text-xs text-gray-500 dark:text-muted-foreground">SMKN 1 Garut</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center mx-auto dark:bg-primary">
              <GraduationCap className="w-6 h-6 text-white dark:text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-gray-50 dark:hover:bg-sidebar-accent",
                  isActive 
                    ? "bg-[#1E3A8A] text-white shadow-sm dark:bg-primary dark:text-primary-foreground" 
                    : "text-gray-700 dark:text-sidebar-foreground",
                  isCollapsed && "justify-center"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:shadow-md transition-shadow dark:bg-card dark:border-border"
        >
          {isCollapsed ? (
            <Menu className="w-3 h-3 text-gray-600 dark:text-muted-foreground" />
          ) : (
            <X className="w-3 h-3 text-gray-600 dark:text-muted-foreground" />
          )}
        </button>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-sidebar-border">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 text-center dark:text-muted-foreground">
              <p>v1.0.0</p>
              <p className="mt-1">© 2026 SMKN 1 Garut</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
