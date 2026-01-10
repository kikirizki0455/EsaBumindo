// components/layout/AdminLayout.jsx

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Menu,
  X,
  FileText,
  Users,
  DollarSign,
  Home,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    title: "Artikel",
    icon: FileText,
    href: "/admin/artikel",
    description: "Kelola konten artikel perusahaan",
  },
  {
    title: "Karyawan",
    icon: Users,
    href: "/admin/karyawan",
    description: "Kelola data & absensi karyawan",
  },
  {
    title: "Keuangan",
    icon: DollarSign,
    href: "/admin/keuangan",
    description: "Kelola gaji & keuangan karyawan",
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary">Esabumindo</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-[57px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:top-0",
          sidebarOpen ? "translate-x-0 top-[57px]" : "-translate-x-full"
        )}
      >
        {/* Logo - Desktop */}
        <div className="hidden lg:flex items-center space-x-3 px-6 py-5 border-b border-gray-200">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary">Esabumindo</h1>
            <p className="text-xs text-gray-500">Chemical Adhesive</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-140px)] lg:h-[calc(100%-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              router.pathname === item.href ||
              (item.href !== "/admin" && router.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className={cn(
                    "flex items-start space-x-3 px-4 py-3 rounded-lg transition-all",
                    "hover:bg-gray-100",
                    isActive
                      ? "bg-primary text-white hover:bg-primary-600"
                      : "text-gray-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mt-0.5 shrink-0",
                      isActive && "text-white"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium text-sm",
                        isActive && "text-white"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p
                        className={cn(
                          "text-xs mt-0.5",
                          isActive ? "text-white/80" : "text-gray-500"
                        )}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-white shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-[57px] lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
