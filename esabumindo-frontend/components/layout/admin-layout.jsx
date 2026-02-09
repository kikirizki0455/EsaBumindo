// components/layout/AdminLayout.jsx

import { useState, useEffect } from "react";
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
  Calendar,
  Settings,
  Bell,
  Search,
  Factory,
  Package,
  Boxes,
  BarChart3,
  ChevronDown,
  Sun,
  Moon,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

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
    description: "Kelola konten artikel",
  },
  {
    title: "Karyawan",
    icon: Users,
    href: "/admin/employee",
    description: "Data & absensi karyawan",
  },
  {
    title: "Keuangan",
    icon: DollarSign,
    href: "/admin/finance",
    description: "Gaji & keuangan",
  },
];

const productionMenuItems = [
  {
    title: "Dashboard PPIC",
    icon: BarChart3,
    href: "/admin/ppic/dashboard",
    description: "Overview produksi",
  },
  {
    title: "Jadwal Produksi",
    icon: Calendar,
    href: "/admin/ppic/schedule",
    description: "Kelola jadwal reactor",
  },
  {
    title: "Manajemen Produk",
    icon: Package,
    href: "/admin/ppic/products",
    description: "Produk & BOM",
  },
  {
    title: "Material",
    icon: Boxes,
    href: "/admin/ppic/materials",
    description: "Stok bahan baku",
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productionExpanded, setProductionExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarCollapsed");
      if (savedState !== null) {
        setSidebarCollapsed(JSON.parse(savedState));
      }
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isMounted) {
      localStorage.setItem(
        "sidebarCollapsed",
        JSON.stringify(sidebarCollapsed)
      );
    }
  }, [sidebarCollapsed, isMounted]);

  // Auto expand production menu if on production page
  useEffect(() => {
    if (router.pathname.includes("/ppic")) {
      setProductionExpanded(true);
    }
  }, [router.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-72";
  const mainPadding = sidebarCollapsed ? "lg:pl-20" : "lg:pl-72";
  const topNavLeft = sidebarCollapsed ? "left-20" : "left-72";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header - Elegant Dark */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Esabumindo
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                Chemical Adhesive
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 top-[60px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Dark Theme with Collapse Feature */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 transform transition-all duration-300 ease-out",
          "lg:translate-x-0 lg:top-0",
          "shadow-2xl shadow-black/50",
          // Mobile: show/hide based on sidebarOpen
          sidebarOpen
            ? "translate-x-0 top-[60px]"
            : "-translate-x-full lg:translate-x-0",
          // Desktop: width based on collapsed state
          "w-72 lg:w-72",
          isMounted && sidebarCollapsed && "lg:w-20"
        )}
      >
        {/* Collapse Toggle Button - Positioned at Edge */}
        <button
          onClick={toggleSidebarCollapse}
          className={cn(
            "hidden lg:flex absolute -right-3 top-20 z-50",
            "w-6 h-6 rounded-full",
            "bg-slate-800 border-2 border-slate-700 hover:border-emerald-500",
            "items-center justify-center",
            "text-slate-400 hover:text-emerald-400",
            "shadow-lg hover:shadow-emerald-500/20",
            "transition-all duration-200"
          )}
          title={sidebarCollapsed ? "Perlebar Sidebar" : "Perkecil Sidebar"}
        >
          <ChevronLeft
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-300",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </button>

        {/* Logo - Desktop */}
        <div
          className={cn(
            "hidden lg:flex items-center border-b border-white/10 transition-all duration-300",
            sidebarCollapsed
              ? "justify-center px-2 py-4"
              : "justify-between px-5 py-4"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              sidebarCollapsed ? "justify-center" : "space-x-3"
            )}
          >
            <div
              className={cn(
                "bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all duration-300",
                sidebarCollapsed ? "w-10 h-10" : "w-11 h-11"
              )}
            >
              <Factory
                className={cn(
                  "text-white transition-all",
                  sidebarCollapsed ? "w-5 h-5" : "w-6 h-6"
                )}
              />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">
                  Esabumindo
                </h1>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                  Chemical Adhesive
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Time Display - Only when expanded */}
        {!sidebarCollapsed && (
          <div className="hidden lg:block px-5 py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white font-mono">
                  {formatTime(currentTime)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(currentTime)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "p-3 space-y-1 overflow-y-auto custom-scrollbar transition-all duration-300",
            sidebarCollapsed
              ? "h-[calc(100%-180px)] lg:h-[calc(100%-140px)]"
              : "h-[calc(100%-220px)] lg:h-[calc(100%-280px)]"
          )}
        >
          {/* Main Menu Label */}
          {!sidebarCollapsed && (
            <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Menu Utama
            </p>
          )}

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
                title={sidebarCollapsed ? item.title : undefined}
              >
                <div
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-200 group",
                    sidebarCollapsed
                      ? "justify-center px-2 py-3"
                      : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg flex items-center justify-center transition-colors",
                      sidebarCollapsed ? "w-10 h-10" : "w-9 h-9",
                      isActive
                        ? "bg-white/20"
                        : "bg-slate-800 group-hover:bg-slate-700"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.title}</p>
                        {item.description && (
                          <p
                            className={cn(
                              "text-[10px] mt-0.5",
                              isActive ? "text-white/70" : "text-slate-500"
                            )}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Production Menu Section */}
          <div className="pt-4">
            {!sidebarCollapsed ? (
              <button
                onClick={() => setProductionExpanded(!productionExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
              >
                <span>Produksi & PPIC</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    productionExpanded && "rotate-180"
                  )}
                />
              </button>
            ) : (
              <div className="flex justify-center py-2">
                <div className="w-8 h-px bg-slate-700"></div>
              </div>
            )}

            {(productionExpanded || sidebarCollapsed) && (
              <div className="mt-1 space-y-1">
                {productionMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    router.pathname === item.href ||
                    router.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.title : undefined}
                    >
                      <div
                        className={cn(
                          "flex items-center rounded-xl transition-all duration-200 group",
                          sidebarCollapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-2.5",
                          isActive
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg flex items-center justify-center transition-colors",
                            sidebarCollapsed ? "w-10 h-10" : "w-9 h-9",
                            isActive
                              ? "bg-white/20"
                              : "bg-slate-800 group-hover:bg-slate-700"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {!sidebarCollapsed && (
                          <>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                {item.title}
                              </p>
                              {item.description && (
                                <p
                                  className={cn(
                                    "text-[10px] mt-0.5",
                                    isActive
                                      ? "text-white/70"
                                      : "text-slate-500"
                                  )}
                                >
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all duration-300",
            sidebarCollapsed ? "p-2" : "p-3"
          )}
        >
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-slate-800/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  AD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    Admin
                  </p>
                  <p className="text-[10px] text-slate-400">Administrator</p>
                </div>
                <button className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Sistem
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                AD
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Top Navbar - Desktop */}
      <div
        className={cn(
          "hidden lg:block fixed top-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300",
          sidebarCollapsed ? "left-20" : "left-72"
        )}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari menu, produk, atau material..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">Admin</p>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "pt-[60px] lg:pt-[60px] transition-all duration-300",
          "lg:pl-72",
          isMounted && sidebarCollapsed && "lg:pl-20"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {/* Custom Scrollbar Style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
