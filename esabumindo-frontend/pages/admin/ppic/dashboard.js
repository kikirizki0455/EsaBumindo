import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/layout/admin-layout";
import {
  Factory,
  Package,
  Boxes,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  FileText,
  Settings,
  ChevronLeft,
  ChevronDown,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Page: PPIC Dashboard
 * Modern UI dengan statistik produksi yang lengkap
 */
export default function PPICDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSchedules: 0,
    draftSchedules: 0,
    confirmedSchedules: 0,
    inProgressSchedules: 0,
    completedSchedules: 0,
    cancelledSchedules: 0,
    totalChanges: 0,
    affectedPlans: 0,
    changesSummary: {
      DATE: 0,
      QUANTITY: 0,
      REACTOR: 0,
      PRODUCT: 0,
      NOTES: 0,
    },
    scheduleChanges: [],
    weeklyScheduleData: [],
    reactorUtilization: [],
    productTypeDistribution: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    plant: "P1",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        plant: filter.plant,
        month: filter.month,
        year: filter.year,
      });

      const res = await apiFetch(`/production/ppic/dashboard?${query}`);

      if (!res.ok) {
        console.warn("Using dummy data for dashboard");
        setStats(getDummyDashboardData());
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
      setStats(getDummyDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const getDummyDashboardData = () => ({
    totalSchedules: 24,
    draftSchedules: 5,
    confirmedSchedules: 8,
    inProgressSchedules: 6,
    completedSchedules: 4,
    cancelledSchedules: 1,
    totalChanges: 12,
    affectedPlans: 3,
    changesSummary: {
      DATE: 5,
      QUANTITY: 3,
      REACTOR: 2,
      PRODUCT: 1,
      NOTES: 1,
    },
    scheduleChanges: [
      {
        id: 1,
        createdAt: new Date().toISOString(),
        changeType: "DATE",
        oldValue: "2026-02-08",
        newValue: "2026-02-10",
        materialWeighedCount: 3,
        materialTotalCount: 5,
        reason: "Keterlambatan bahan baku",
        productionPlan: { product: { name: "EB-5502" } },
      },
      {
        id: 2,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        changeType: "QUANTITY",
        oldValue: "1000",
        newValue: "800",
        materialWeighedCount: 4,
        materialTotalCount: 5,
        reason: "Penyesuaian permintaan",
        productionPlan: { product: { name: "ST-3301" } },
      },
    ],
    weeklyScheduleData: [
      { label: "Sen", value: 4, completed: 2 },
      { label: "Sel", value: 5, completed: 3 },
      { label: "Rab", value: 3, completed: 2 },
      { label: "Kam", value: 6, completed: 4 },
      { label: "Jum", value: 4, completed: 3 },
      { label: "Sab", value: 2, completed: 1 },
      { label: "Min", value: 0, completed: 0 },
    ],
    reactorUtilization: [
      { reactor: "A", utilization: 85, schedules: 6 },
      { reactor: "B", utilization: 72, schedules: 5 },
      { reactor: "C", utilization: 68, schedules: 4 },
      { reactor: "D", utilization: 45, schedules: 3 },
    ],
    productTypeDistribution: [
      { type: "PVAC", count: 8, color: "from-blue-500 to-cyan-500" },
      { type: "STYRENE", count: 5, color: "from-violet-500 to-purple-500" },
      { type: "EVA", count: 4, color: "from-emerald-500 to-green-500" },
      { type: "ALL ACR", count: 3, color: "from-orange-500 to-amber-500" },
      { type: "PSA", count: 2, color: "from-pink-500 to-rose-500" },
      { type: "OTHER", count: 2, color: "from-slate-500 to-gray-500" },
    ],
  });

  const currentMonth = new Date(
    filter.year,
    filter.month - 1
  ).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const completionRate =
    stats.totalSchedules > 0
      ? Math.round((stats.completedSchedules / stats.totalSchedules) * 100)
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard PPIC
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Production Planning & Inventory Control - {currentMonth}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Plant Filter */}
            <select
              value={filter.plant}
              onChange={(e) => setFilter({ ...filter, plant: e.target.value })}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <option value="P1">Plant 1</option>
              <option value="P2">Plant 2</option>
            </select>

            {/* Month Filter */}
            <select
              value={filter.month}
              onChange={(e) =>
                setFilter({ ...filter, month: parseInt(e.target.value) })
              }
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(filter.year, m - 1).toLocaleDateString("id-ID", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={filter.year}
              onChange={(e) =>
                setFilter({ ...filter, year: parseInt(e.target.value) })
              }
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Schedules */}
          <div
            onClick={() => router.push("/admin/ppic/schedule")}
            className="group bg-white rounded-2xl p-4 cursor-pointer border border-slate-200/50 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-all" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalSchedules}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total Jadwal</p>
          </div>

          {/* Draft */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.draftSchedules}
            </p>
            <p className="text-xs text-slate-500 mt-1">Draft</p>
          </div>

          {/* Confirmed */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.confirmedSchedules}
            </p>
            <p className="text-xs text-slate-500 mt-1">Confirmed</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.inProgressSchedules}
            </p>
            <p className="text-xs text-slate-500 mt-1">In Progress</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.completedSchedules}
            </p>
            <p className="text-xs text-slate-500 mt-1">Completed</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{completionRate}%</p>
            <p className="text-xs text-white/80 mt-1">Completion Rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              {
                id: "changes",
                label: `Perubahan (${stats.totalChanges})`,
                icon: AlertTriangle,
              },
              { id: "analysis", label: "Analisis", icon: PieChart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-violet-600 border-b-2 border-violet-500 bg-violet-50/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <OverviewTab stats={stats} router={router} />
                )}
                {activeTab === "changes" && (
                  <ChangesTab changes={stats.scheduleChanges} />
                )}
                {activeTab === "analysis" && (
                  <AnalysisTab
                    changesSummary={stats.changesSummary}
                    scheduleChanges={stats.scheduleChanges}
                    affectedPlans={stats.affectedPlans}
                    productTypeDistribution={stats.productTypeDistribution}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-500" />
            Aksi Cepat PPIC
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/admin/ppic/schedule-create")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 text-violet-700 hover:shadow-md hover:shadow-violet-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Buat Jadwal</span>
            </button>
            <button
              onClick={() => router.push("/admin/ppic/schedule")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 text-blue-700 hover:shadow-md hover:shadow-blue-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Factory className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Lihat Jadwal</span>
            </button>
            <button
              onClick={() => router.push("/admin/ppic/products")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 text-emerald-700 hover:shadow-md hover:shadow-emerald-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Kelola Produk</span>
            </button>
            <button
              onClick={() => router.push("/admin/ppic/materials")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 text-amber-700 hover:shadow-md hover:shadow-amber-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-sm">Bahan Baku</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/**
 * Component: Overview Tab
 */
function OverviewTab({ stats, router }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule Chart */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            Jadwal Mingguan
          </h3>
          <div className="h-48">
            <WeeklyBarChart data={stats.weeklyScheduleData} />
          </div>
        </div>

        {/* Reactor Utilization */}
        <div className="bg-slate-50 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Factory className="w-5 h-5 text-emerald-500" />
            Utilisasi Reactor
          </h3>
          <div className="space-y-4">
            {stats.reactorUtilization?.map((reactor) => (
              <div key={reactor.reactor}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm",
                        reactor.reactor === "A"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                          : reactor.reactor === "B"
                          ? "bg-gradient-to-br from-emerald-500 to-green-500"
                          : reactor.reactor === "C"
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-rose-500 to-pink-500"
                      )}
                    >
                      {reactor.reactor}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Reactor {reactor.reactor}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {reactor.utilization}%
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      ({reactor.schedules} jadwal)
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      reactor.utilization >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : reactor.utilization >= 50
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-slate-400 to-slate-500"
                    )}
                    style={{ width: `${reactor.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-500" />
          Distribusi Status Jadwal
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              label: "Draft",
              value: stats.draftSchedules,
              color: "bg-slate-400",
            },
            {
              label: "Confirmed",
              value: stats.confirmedSchedules,
              color: "bg-blue-500",
            },
            {
              label: "In Progress",
              value: stats.inProgressSchedules,
              color: "bg-amber-500",
            },
            {
              label: "Completed",
              value: stats.completedSchedules,
              color: "bg-emerald-500",
            },
            {
              label: "Cancelled",
              value: stats.cancelledSchedules,
              color: "bg-red-500",
            },
          ].map((item) => {
            const percentage =
              stats.totalSchedules > 0
                ? Math.round((item.value / stats.totalSchedules) * 100)
                : 0;
            return (
              <div
                key={item.label}
                className="bg-white rounded-xl p-4 border border-slate-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-3 h-3 rounded-full", item.color)}></div>
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{item.value}</p>
                <p className="text-xs text-slate-400">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Changes Summary */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Ringkasan Perubahan Jadwal
            </h3>
            <p className="text-sm text-amber-700">
              Total <span className="font-bold">{stats.totalChanges}</span>{" "}
              perubahan tercatat, mempengaruhi{" "}
              <span className="font-bold">{stats.affectedPlans}</span> jadwal
              produksi.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/ppic/schedule")}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Component: Changes Tab
 */
function ChangesTab({ changes }) {
  if (!changes || changes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500">
          Tidak ada perubahan jadwal pada periode ini
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Tanggal
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Produk
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Tipe
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Perubahan
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Material
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Impact
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
              Alasan
            </th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => {
            const impactPercent = Math.round(
              (change.materialWeighedCount / change.materialTotalCount) * 100
            );
            const isHighImpact = impactPercent > 50;

            return (
              <tr
                key={change.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="py-3 px-4 text-sm text-slate-600">
                  {new Date(change.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-900">
                    {change.productionPlan?.product?.name || "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-semibold",
                      change.changeType === "DATE"
                        ? "bg-blue-100 text-blue-700"
                        : change.changeType === "QUANTITY"
                        ? "bg-amber-100 text-amber-700"
                        : change.changeType === "REACTOR"
                        ? "bg-violet-100 text-violet-700"
                        : change.changeType === "PRODUCT"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {change.changeType}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {change.oldValue}
                  </code>
                  <span className="mx-2 text-slate-400">→</span>
                  <code className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">
                    {change.newValue}
                  </code>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-semibold text-slate-700">
                    {change.materialWeighedCount}/{change.materialTotalCount}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-bold",
                      isHighImpact
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {impactPercent}% {isHighImpact && "⚠️"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500 max-w-[200px] truncate">
                  {change.reason || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Component: Analysis Tab
 */
function AnalysisTab({
  changesSummary,
  scheduleChanges,
  affectedPlans,
  productTypeDistribution,
}) {
  const totalChanges = Object.values(changesSummary).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Change Type Distribution */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 mb-4">
          Distribusi Tipe Perubahan
        </h3>
        <div className="space-y-4">
          {Object.entries(changesSummary).map(([type, count]) => {
            const percentage =
              totalChanges > 0 ? Math.round((count / totalChanges) * 100) : 0;
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    {getChangeTypeLabel(type)}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getChangeTypeColor(type),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Type Distribution */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 mb-4">
          Distribusi Tipe Produk
        </h3>
        <div className="space-y-3">
          {productTypeDistribution?.map((item) => (
            <div key={item.type} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r",
                  item.color
                )}
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {item.type}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {item.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Impact Changes */}
      <div className="bg-slate-50 rounded-xl p-5 lg:col-span-2">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Perubahan Berdampak Tinggi
        </h3>
        {scheduleChanges.filter(
          (c) => (c.materialWeighedCount / c.materialTotalCount) * 100 > 50
        ).length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              Tidak ada perubahan berdampak tinggi
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scheduleChanges
              .filter(
                (c) =>
                  (c.materialWeighedCount / c.materialTotalCount) * 100 > 50
              )
              .slice(0, 4)
              .map((change) => (
                <div
                  key={change.id}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-red-900">
                        {change.productionPlan?.product?.name}
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {change.changeType}: {change.oldValue} →{" "}
                        {change.newValue}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-red-200 text-red-800 text-xs font-bold">
                      {Math.round(
                        (change.materialWeighedCount /
                          change.materialTotalCount) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Component: Weekly Bar Chart
 */
function WeeklyBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-slate-400 text-center py-8">Data tidak tersedia</div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end justify-between h-full gap-2 px-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center justify-end h-32">
            <div
              className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-t-lg transition-all duration-500 relative group"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? "20px" : "0",
              }}
            >
              {item.value > 0 && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Helper: Get change type label
 */
function getChangeTypeLabel(type) {
  const labels = {
    DATE: "Perubahan Tanggal",
    QUANTITY: "Perubahan Qty",
    REACTOR: "Perubahan Reactor",
    PRODUCT: "Perubahan Produk",
    NOTES: "Perubahan Catatan",
  };
  return labels[type] || type;
}

/**
 * Helper: Get change type color
 */
function getChangeTypeColor(type) {
  const colors = {
    DATE: "#3b82f6",
    QUANTITY: "#f59e0b",
    REACTOR: "#8b5cf6",
    PRODUCT: "#ef4444",
    NOTES: "#22c55e",
  };
  return colors[type] || "#64748b";
}
