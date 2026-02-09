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
  ArrowUpRight,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Wallet,
  BadgeDollarSign,
  PiggyBank,
  CreditCard,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/router";
import api from "@/lib/axios";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, draft: 0 },
    employees: { total: 0, active: 0, inactive: 0 },
    attendance: { today: 0, thisMonth: 0 },
    salary: { thisMonth: 0, paid: 0, pending: 0 },
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [articlesRes, employeesRes, attendancesRes, salariesRes] =
        await Promise.all([
          api.get("/articles"),
          api.get("/employees"),
          api.get("/attendances", {
            params: {
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
          }),
          api.get("/salaries", {
            params: {
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            },
          }),
        ]);

      const articles = articlesRes.data || [];
      const employees = employeesRes.data || [];
      const attendances = attendancesRes.data || [];
      const salaries = salariesRes.data || [];

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

      // Recent employees
      setRecentEmployees(
        employees
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );

      // Salary data for display
      setSalaryData(salaries.slice(0, 5));

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
        ...salaries.slice(0, 2).map((s) => ({
          type: "salary",
          title: `Gaji ${s.employee?.name || "Karyawan"} ${
            s.status === "paid" ? "dibayar" : "diproses"
          }`,
          date: s.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case "article":
        return <FileText className="w-5 h-5 text-white" />;
      case "attendance":
        return <Clock className="w-5 h-5 text-white" />;
      case "salary":
        return <DollarSign className="w-5 h-5 text-white" />;
      default:
        return <Activity className="w-5 h-5 text-white" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "article":
        return "bg-gradient-to-br from-blue-500 to-cyan-500";
      case "attendance":
        return "bg-gradient-to-br from-violet-500 to-purple-500";
      case "salary":
        return "bg-gradient-to-br from-amber-500 to-orange-500";
      default:
        return "bg-gradient-to-br from-slate-500 to-slate-600";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat datang kembali! Berikut ringkasan aktivitas hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Online
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              {currentMonth}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Articles */}
          <div
            onClick={() => router.push("/admin/artikel")}
            className="group bg-white rounded-2xl p-5 cursor-pointer border border-slate-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.articles.total}
            </p>
            <p className="text-sm text-slate-500 mt-1">Total Artikel</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
                {stats.articles.published} Published
              </span>
              <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-medium">
                {stats.articles.draft} Draft
              </span>
            </div>
          </div>

          {/* Employees */}
          <div
            onClick={() => router.push("/admin/employee")}
            className="group bg-white rounded-2xl p-5 cursor-pointer border border-slate-200/50 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.employees.total}
            </p>
            <p className="text-sm text-slate-500 mt-1">Total Karyawan</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
                {stats.employees.active} Aktif
              </span>
              <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                {stats.employees.inactive} Nonaktif
              </span>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/50">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.attendance.today}
            </p>
            <p className="text-sm text-slate-500 mt-1">Absensi Hari Ini</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (stats.attendance.today / stats.employees.active) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {stats.attendance.thisMonth} /bln
              </span>
            </div>
          </div>

          {/* Salary */}
          <div
            onClick={() => router.push("/admin/finance")}
            className="group bg-white rounded-2xl p-5 cursor-pointer border border-slate-200/50 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="text-2xl font-bold text-slate-900 truncate">
              {formatCurrency(stats.salary.thisMonth)}
            </p>
            <p className="text-sm text-slate-500 mt-1">Total Gaji Bulan Ini</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium truncate">
                {formatCurrency(stats.salary.paid)} Paid
              </span>
            </div>
          </div>
        </div>

        {/* Finance Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Ringkasan Keuangan</h2>
                <p className="text-xs text-slate-500">Periode {currentMonth}</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/admin/finance")}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Gaji */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <BadgeDollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Total Gaji
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats.salary.thisMonth)}
                </p>
              </div>

              {/* Sudah Dibayar */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">
                    Sudah Dibayar
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(stats.salary.paid)}
                </p>
              </div>

              {/* Belum Dibayar */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-amber-700">
                    Belum Dibayar
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-700">
                  {formatCurrency(stats.salary.pending)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Progress Pembayaran
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {stats.salary.thisMonth > 0
                    ? Math.round(
                        (stats.salary.paid / stats.salary.thisMonth) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.salary.thisMonth > 0
                        ? (stats.salary.paid / stats.salary.thisMonth) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/admin/artikel/new")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 text-blue-700 hover:shadow-md hover:shadow-blue-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Buat Artikel</span>
            </button>
            <button
              onClick={() => router.push("/admin/employee/add-employee")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 text-emerald-700 hover:shadow-md hover:shadow-emerald-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Tambah Karyawan</span>
            </button>
            <button
              onClick={() => router.push("/admin/employee")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 text-violet-700 hover:shadow-md hover:shadow-violet-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Kelola Karyawan</span>
            </button>
            <button
              onClick={() => router.push("/admin/finance")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 text-amber-700 hover:shadow-md hover:shadow-amber-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Kelola Gaji</span>
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl border border-slate-200/50 p-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Aktivitas Terbaru
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Belum ada aktivitas
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Employees */}
          <div className="bg-white rounded-2xl border border-slate-200/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                Karyawan Terbaru
              </h2>
              <button
                onClick={() => router.push("/admin/employee")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Lihat Semua
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentEmployees.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Belum ada karyawan
              </p>
            ) : (
              <div className="space-y-3">
                {recentEmployees.map((employee, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      router.push(`/admin/employee/edit/${employee.id}`)
                    }
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold">
                      {employee.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium truncate">
                        {employee.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {employee.position || "Karyawan"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        employee.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {employee.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Info Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Esabumindo Admin</h2>
                <p className="text-emerald-400 text-xs font-medium">
                  Content & HR Management
                </p>
              </div>
            </div>

            <p className="text-slate-300 mb-5 text-sm leading-relaxed">
              Sistem terintegrasi untuk mengelola artikel, karyawan, absensi,
              dan penggajian perusahaan.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">Manajemen Artikel</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">Data Karyawan</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">Sistem Absensi</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">Penggajian</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Periode Aktif</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {currentMonth}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                v2.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
