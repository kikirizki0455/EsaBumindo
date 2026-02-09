import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/layout/admin-layout";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Factory,
  Package,
  Zap,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";

export default function ProductionSchedulePage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filters, setFilters] = useState({
    status: "",
    reactor: "",
    plant: "P1",
  });

  // Week navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const reactors = ["A", "B", "C", "D"];

  useEffect(() => {
    fetchPlans();
  }, [filters, currentWeekStart]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.status) query.append("status", filters.status);
      if (filters.reactor) query.append("reactor", filters.reactor);
      if (filters.plant) query.append("plant", filters.plant);

      const res = await apiFetch(`/production/plans?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let plansArray = Array.isArray(data) ? data : data.data || data.plans || [];
        setPlans(plansArray);
      } else {
        setPlans(getDummyData());
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans(getDummyData());
    } finally {
      setLoading(false);
    }
  };

  const getDummyData = () => {
    const today = new Date();
    return [
      { id: "1", planDate: today.toISOString(), reactor: "A", plant: "P1", product: { name: "EB-5502", type: "PVAC" }, noBatch: "P1-20260209-001", targetQty: 5400, status: "IN_PROGRESS" },
      { id: "2", planDate: today.toISOString(), reactor: "B", plant: "P1", product: { name: "ST-3301", type: "STYRENE" }, noBatch: "P1-20260209-002", targetQty: 4800, status: "DRAFT" },
      { id: "3", planDate: new Date(today.getTime() + 86400000).toISOString(), reactor: "A", plant: "P1", product: { name: "EVA-100", type: "EVA" }, noBatch: "P1-20260210-001", targetQty: 5000, status: "CONFIRMED" },
      { id: "4", planDate: new Date(today.getTime() + 86400000).toISOString(), reactor: "C", plant: "P1", product: { name: "EB-5503", type: "PVAC" }, noBatch: "P1-20260210-002", targetQty: 5400, status: "DRAFT" },
      { id: "5", planDate: new Date(today.getTime() + 172800000).toISOString(), reactor: "B", plant: "P1", product: { name: "AC-200", type: "ALL ACR" }, noBatch: "P1-20260211-001", targetQty: 4500, status: "CONFIRMED" },
      { id: "6", planDate: new Date(today.getTime() + 172800000).toISOString(), reactor: "D", plant: "P1", product: { name: "PSA-50", type: "PSA" }, noBatch: "P1-20260211-002", targetQty: 3800, status: "IN_PROGRESS" },
      { id: "7", planDate: new Date(today.getTime() + 259200000).toISOString(), reactor: "A", plant: "P1", product: { name: "VN-800", type: "VINYL" }, noBatch: "P1-20260212-001", targetQty: 5200, status: "DRAFT" },
      { id: "8", planDate: new Date(today.getTime() - 86400000).toISOString(), reactor: "C", plant: "P1", product: { name: "EB-5501", type: "PVAC" }, noBatch: "P1-20260208-001", targetQty: 5400, status: "COMPLETED" },
    ];
  };

  // Get week days
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Get schedule for specific reactor and date
  const getScheduleForCell = (reactor, date) => {
    const dateStr = date.toISOString().split("T")[0];
    return plans.filter((s) => {
      const planDateStr = new Date(s.planDate).toISOString().split("T")[0];
      const matchReactor = filters.reactor ? s.reactor === filters.reactor : s.reactor === reactor;
      const matchDate = planDateStr === dateStr;
      return matchReactor && matchDate;
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(today.setDate(diff)));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusConfig = (status) => {
    const configs = {
      COMPLETED: { color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2, label: "Selesai" },
      IN_PROGRESS: { color: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: PlayCircle, label: "Berjalan" },
      CONFIRMED: { color: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", icon: CheckCircle2, label: "Dikonfirmasi" },
      DRAFT: { color: "bg-slate-400", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: Clock, label: "Draft" },
      CANCELLED: { color: "bg-red-500", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle, label: "Dibatalkan" },
    };
    return configs[status] || configs.DRAFT;
  };

  const getTypeGradient = (type) => {
    const gradients = {
      PVAC: "from-blue-500 to-cyan-500",
      STYRENE: "from-violet-500 to-purple-500",
      EVA: "from-emerald-500 to-green-500",
      "ALL ACR": "from-orange-500 to-amber-500",
      PSA: "from-pink-500 to-rose-500",
      VINYL: "from-cyan-500 to-teal-500",
      DEMPUL: "from-red-500 to-orange-500",
      WIP: "from-slate-500 to-gray-500",
    };
    return gradients[type] || "from-slate-500 to-gray-500";
  };

  const getReactorGradient = (reactor) => {
    const gradients = {
      A: "from-blue-500 to-cyan-500",
      B: "from-emerald-500 to-green-500",
      C: "from-amber-500 to-orange-500",
      D: "from-rose-500 to-pink-500",
    };
    return gradients[reactor] || "from-slate-500 to-gray-500";
  };

  const handleViewDetails = (plan) => {
    router.push(`/admin/ppic/schedule-detail/${plan.id}`);
  };

  const handleDelete = async (planId) => {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      await apiFetch(`/production/plans/${planId}`, { method: "DELETE" });
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  // Stats
  const stats = {
    total: plans.length,
    draft: plans.filter(p => p.status === "DRAFT").length,
    confirmed: plans.filter(p => p.status === "CONFIRMED").length,
    inProgress: plans.filter(p => p.status === "IN_PROGRESS").length,
    completed: plans.filter(p => p.status === "COMPLETED").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Jadwal Produksi
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-13">
              Kelola jadwal produksi reactor dengan tampilan papan catur
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/ppic/schedule-create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Buat Jadwal Baru
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200/50">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total Jadwal</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
            <p className="text-2xl font-bold text-slate-600">{stats.draft}</p>
            <p className="text-xs text-slate-500 mt-1">Draft</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-4 border border-violet-200/50">
            <p className="text-2xl font-bold text-violet-600">{stats.confirmed}</p>
            <p className="text-xs text-violet-500 mt-1">Dikonfirmasi</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-blue-500 mt-1">Berjalan</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/50">
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            <p className="text-xs text-emerald-500 mt-1">Selesai</p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-xl border border-slate-200/50 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter:</span>
              </div>
              
              <select
                value={filters.plant}
                onChange={(e) => setFilters({ ...filters, plant: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="">Semua Plant</option>
                <option value="P1">🏭 Plant 1</option>
                <option value="P2">🏭 Plant 2</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="">Semua Status</option>
                <option value="DRAFT">📝 Draft</option>
                <option value="CONFIRMED">✅ Confirmed</option>
                <option value="IN_PROGRESS">🔄 In Progress</option>
                <option value="COMPLETED">✔️ Completed</option>
                <option value="CANCELLED">❌ Cancelled</option>
              </select>

              <select
                value={filters.reactor}
                onChange={(e) => setFilters({ ...filters, reactor: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="">Semua Reactor</option>
                <option value="A">⚗️ Reactor A</option>
                <option value="B">⚗️ Reactor B</option>
                <option value="C">⚗️ Reactor C</option>
                <option value="D">⚗️ Reactor D</option>
              </select>
            </div>

            {/* View Toggle & Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-violet-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-violet-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={fetchPlans}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Chess Board View */}
        {viewMode === "grid" && (
          <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
            {/* Week Navigation */}
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Factory className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Papan Jadwal Mingguan</h2>
                  <p className="text-xs text-slate-500">Reactor (Baris) × Hari (Kolom)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateWeek(-1)}
                  className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 rounded-lg bg-violet-100 text-violet-700 text-sm font-semibold hover:bg-violet-200 transition-colors"
                >
                  Hari Ini
                </button>
                <div className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 min-w-[180px] text-center">
                  {weekDays[0].toLocaleDateString("id-ID", { day: "numeric", month: "short" })} — {weekDays[6].toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <button
                  onClick={() => navigateWeek(1)}
                  className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chess Board Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="w-32 px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 sticky left-0 bg-slate-50/80 z-10">
                      <div className="flex items-center gap-2">
                        <Factory className="w-4 h-4" />
                        Reactor
                      </div>
                    </th>
                    {weekDays.map((day, idx) => (
                      <th
                        key={idx}
                        className={`px-2 py-3 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                          isToday(day) ? "bg-violet-100/80" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday(day) ? "text-violet-600" : "text-slate-400"}`}>
                            {day.toLocaleDateString("id-ID", { weekday: "short" })}
                          </span>
                          <span className={`text-xl font-bold ${isToday(day) ? "text-violet-700" : "text-slate-700"}`}>
                            {day.getDate()}
                          </span>
                          {isToday(day) && (
                            <span className="px-2 py-0.5 rounded-full bg-violet-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(filters.reactor ? [filters.reactor] : reactors).map((reactor, rIdx) => (
                    <tr key={reactor} className={`${rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/30"} hover:bg-slate-50/50 transition-colors`}>
                      <td className="px-4 py-3 border-r border-slate-200 sticky left-0 bg-inherit z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getReactorGradient(reactor)} flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                            {reactor}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">Reactor {reactor}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {filters.plant || "All Plants"}
                            </p>
                          </div>
                        </div>
                      </td>
                      {weekDays.map((day, dIdx) => {
                        const cellSchedules = getScheduleForCell(reactor, day);
                        const isEvenCell = (rIdx + dIdx) % 2 === 0;
                        
                        return (
                          <td
                            key={dIdx}
                            className={`px-2 py-2 border-r border-slate-200 last:border-r-0 align-top transition-colors ${
                              isToday(day) ? "bg-violet-50/50" : isEvenCell ? "bg-slate-50/50" : ""
                            }`}
                          >
                            <div className="min-h-[100px] space-y-2">
                              {cellSchedules.length > 0 ? (
                                cellSchedules.map((schedule) => {
                                  const statusConfig = getStatusConfig(schedule.status);
                                  return (
                                    <div
                                      key={schedule.id}
                                      onClick={() => handleViewDetails(schedule)}
                                      className={`p-2.5 rounded-xl bg-gradient-to-br ${getTypeGradient(schedule.product?.type)} cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all shadow-sm group relative overflow-hidden`}
                                    >
                                      {/* Status indicator */}
                                      <div className="absolute top-2 right-2">
                                        <span className={`w-2 h-2 rounded-full ${statusConfig.color} block shadow-sm`}></span>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="relative z-10">
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20">
                                            {schedule.product?.type || "N/A"}
                                          </span>
                                        </div>
                                        <p className="text-sm font-bold text-white truncate leading-tight">
                                          {schedule.product?.name || "Unknown"}
                                        </p>
                                        <p className="text-[10px] text-white/70 truncate mt-1">
                                          📋 {schedule.noBatch || "-"}
                                        </p>
                                        <p className="text-[10px] text-white/70 truncate">
                                          ⚖️ {schedule.targetQty?.toLocaleString() || 0} kg
                                        </p>
                                      </div>

                                      {/* Hover Actions */}
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                          <Eye className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="h-full min-h-[100px] flex items-center justify-center">
                                  <div className="text-center opacity-40 hover:opacity-60 transition-opacity cursor-pointer group"
                                       onClick={() => router.push("/admin/ppic/schedule-create")}>
                                    <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200 flex items-center justify-center mb-1 group-hover:bg-violet-200 transition-colors">
                                      <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 group-hover:text-violet-500">Tambah</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="px-5 py-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-wrap items-center gap-6 text-xs">
                <span className="text-slate-500 font-semibold">Keterangan Status:</span>
                {Object.entries(getStatusConfig("")).length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                      <span className="text-slate-600">Draft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                      <span className="text-slate-600">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-slate-600">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-slate-600">Cancelled</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reactor</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. Lot</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <RefreshCw className="w-5 h-5 animate-spin text-violet-500" />
                          <span className="text-slate-500">Memuat data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : plans.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500">Tidak ada jadwal produksi</p>
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan, idx) => {
                      const statusConfig = getStatusConfig(plan.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr key={plan.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-violet-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">
                                  {new Date(plan.planDate).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {new Date(plan.planDate).toLocaleDateString("id-ID", { year: "numeric" })}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getReactorGradient(plan.reactor)} text-white`}>
                              <span className="font-bold">{plan.reactor}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold text-slate-800">{plan.product?.name || "Unknown"}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${getTypeGradient(plan.product?.type)} text-white`}>
                                {plan.product?.type || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <code className="px-2 py-1 rounded bg-slate-100 text-xs font-mono text-slate-600">
                              {plan.noBatch || "-"}
                            </code>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">{plan.targetQty?.toLocaleString() || 0} kg</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleViewDetails(plan)}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/admin/ppic/schedule-edit/${plan.id}`)}
                                className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(plan.id)}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
