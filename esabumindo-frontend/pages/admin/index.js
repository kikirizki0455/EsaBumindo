// pages/admin/index.jsx


import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, draft: 0 },
    employees: { total: 0, active: 0, inactive: 0 },
    attendance: { today: 0, thisMonth: 0 },
    salary: { thisMonth: 0, paid: 0, pending: 0 },
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      // GANTI DARI axios MENJADI api DAN HAPUS /api/ prefix
      const [articlesRes, employeesRes, attendancesRes, salariesRes] =
        await Promise.all([
          api.get("/articles"), // ← GANTI INI (hapus /api/)
          api.get("/employees"), // ← GANTI INI
          api.get("/attendances", {
            // ← GANTI INI
            params: {
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
          }),
          api.get("/salaries", {
            // ← GANTI INI
            params: {
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
          }),
        ]);

      const articles = articlesRes.data;
      const employees = employeesRes.data;
      const attendances = attendancesRes.data;
      const salaries = salariesRes.data;

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const todayAttendances = attendances.filter(
        (att) => new Date(att.date).toISOString().split("T")[0] === today
      );

      setStats({
        articles: {
          total: articles.length,
          published: articles.filter((a) => a.status === "published").length,
          draft: articles.filter((a) => a.status === "draft").length,
        },
        employees: {
          total: employees.length,
          active: employees.filter((e) => e.status === "active").length,
          inactive: employees.filter((e) => e.status === "inactive").length,
        },
        attendance: {
          today: todayAttendances.length,
          thisMonth: attendances.length,
        },
        salary: {
          thisMonth: salaries.reduce(
            (sum, s) => sum + parseFloat(s.totalSalary || 0),
            0
          ),
          paid: salaries
            .filter((s) => s.status === "paid")
            .reduce((sum, s) => sum + parseFloat(s.totalSalary || 0), 0),
          pending: salaries
            .filter((s) => s.status === "pending")
            .reduce((sum, s) => sum + parseFloat(s.totalSalary || 0), 0),
        },
      });

      // Recent activities (simplified)
      const activities = [
        ...articles.slice(0, 3).map((a) => ({
          type: "article",
          title: `Artikel "${a.title}" ${
            a.status === "published" ? "dipublikasikan" : "dibuat"
          }`,
          date: a.createdAt,
        })),
        ...attendances.slice(0, 3).map((a) => ({
          type: "attendance",
          title: `${a.employee?.name || "Karyawan"} melakukan absensi`,
          date: a.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard Esabumindo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang di sistem admin panel Esabumindo Chemical Adhesive
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Articles */}
          <div
            className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/admin/artikel")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.articles.total}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Artikel</p>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="text-green-600">
                {stats.articles.published} Dipublikasikan
              </span>
              <span className="text-orange-600">
                {stats.articles.draft} Draft
              </span>
            </div>
          </div>

          {/* Employees */}
          <div
            className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/admin/karyawan")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.employees.total}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Karyawan</p>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="text-green-600">
                {stats.employees.active} Aktif
              </span>
              <span className="text-red-600">
                {stats.employees.inactive} Tidak Aktif
              </span>
            </div>
          </div>

          {/* Attendance Today */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.attendance.today}
            </p>
            <p className="text-sm text-gray-500 mt-1">Absensi Hari Ini</p>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="text-gray-600">
                {stats.attendance.thisMonth} Bulan Ini
              </span>
            </div>
          </div>

          {/* Salary */}
          <div
            className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/admin/keuangan")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-primary truncate">
              {formatCurrency(stats.salary.thisMonth)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Gaji Bulan Ini</p>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-green-600">
                {formatCurrency(stats.salary.paid)} Dibayar
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={() => router.push("/admin/artikel/buat")}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Buat Artikel Baru
            </Button>
            <Button
              onClick={() => router.push("/admin/karyawan/tambah")}
              variant="outline"
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              Tambah Karyawan
            </Button>
            <Button
              onClick={() => router.push("/admin/karyawan")}
              variant="outline"
              className="w-full justify-start"
            >
              <Clock className="h-4 w-4 mr-2" />
              Input Absensi
            </Button>
            <Button
              onClick={() => router.push("/admin/keuangan")}
              variant="outline"
              className="w-full justify-start"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Hitung Gaji
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Aktivitas Terbaru
            </h2>
            {loading ? (
              <p className="text-sm text-gray-500">Memuat...</p>
            ) : recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada aktivitas</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "article"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "article" ? (
                        <FileText className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-primary to-primary-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-2">
              Sistem Admin Panel Esabumindo
            </h2>
            <p className="text-primary-50 mb-4 text-sm">
              Kelola artikel, karyawan, dan keuangan perusahaan dengan mudah
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Management artikel dengan auto-generate slug</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Sistem absensi dengan perhitungan otomatis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Perhitungan gaji & lembur otomatis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Mobile-first responsive design</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs text-primary-50">
                Periode:{" "}
                <span className="font-semibold text-white">{currentMonth}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
