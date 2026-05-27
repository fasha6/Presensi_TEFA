import { Bell, ChevronRight, Moon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useAuth } from "../../lib/auth";

interface HeaderProps {
  title: string;
  breadcrumbs?: string[];
}

export function Header({ title, breadcrumbs = [] }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notificationCount = 5;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldUseDark = savedTheme === "dark";

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, state: { resetRedirect: true } });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 dark:bg-card dark:border-border">
      <div className="flex items-center justify-between h-full gap-3 pl-16 pr-3 sm:pr-6 lg:px-8">
        {/* Left: Title & Breadcrumbs */}
        <div className="min-w-0 flex-1">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mb-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2 dark:text-muted-foreground">
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <span>{crumb}</span>
              </div>
            ))}
          </div>
          <h1 className="truncate text-xl sm:text-2xl font-semibold text-gray-900 dark:text-foreground">{title}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors dark:hover:bg-accent"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-muted-foreground" />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors dark:hover:bg-accent">
                <Bell className="w-5 h-5 text-gray-600 dark:text-muted-foreground" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex-col items-start py-3">
                  <p className="font-medium text-sm">Siswa Absen Berulang</p>
                  <p className="text-xs text-gray-500 mt-1 dark:text-muted-foreground">
                    Ahmad Rizki telah absen 3x minggu ini
                  </p>
                  <p className="text-xs text-gray-400 mt-1 dark:text-muted-foreground">5 menit lalu</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start py-3">
                  <p className="font-medium text-sm">SP Disetujui</p>
                  <p className="text-xs text-gray-500 mt-1 dark:text-muted-foreground">
                    SP 01/2026 untuk Siti Nurhaliza telah disetujui
                  </p>
                  <p className="text-xs text-gray-400 mt-1 dark:text-muted-foreground">1 jam lalu</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start py-3">
                  <p className="font-medium text-sm">Presensi Selesai</p>
                  <p className="text-xs text-gray-500 mt-1 dark:text-muted-foreground">
                    Presensi kelas X PPL 1 telah lengkap
                  </p>
                  <p className="text-xs text-gray-400 mt-1 dark:text-muted-foreground">2 jam lalu</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors dark:hover:bg-accent">
                <div className="w-9 h-9 rounded-full bg-[#1E3A8A] flex items-center justify-center dark:bg-primary">
                  <User className="w-5 h-5 text-white dark:text-primary-foreground" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-foreground">{user?.name ?? "Akun Demo"}</p>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground">{user?.roleLabel ?? "Pengguna"}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
