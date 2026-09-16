import { useState, useEffect } from "react";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Trash2,
  X,
  Save,
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  CalendarDays,
  Tag,
  Layers,
  BarChart3,
  Hash,
  BoxSelect,
  Info,
  Eye,
} from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_STOCK_DATA = [
  {
    id: "p001",
    code: "9110",
    type: "Finished Good",
    name: "Emulsion VA 9110",
    unit: "kg",
    kemasan: "Drum 200kg",
    lots: [
      { lotNo: "P1.20202606121", tanggalMasuk: "2026-06-12", stok: 1200 },
      { lotNo: "P1.20202606122", tanggalMasuk: "2026-06-13", stok: 800 },
      { lotNo: "P1.20202606123", tanggalMasuk: "2026-06-15", stok: 600 },
    ],
  },
  {
    id: "p002",
    code: "9210",
    type: "Finished Good",
    name: "Emulsion VA 9210",
    unit: "kg",
    kemasan: "IBC 1000kg",
    lots: [
      { lotNo: "P2.20202606101", tanggalMasuk: "2026-06-10", stok: 3000 },
      { lotNo: "P2.20202606102", tanggalMasuk: "2026-06-14", stok: 1500 },
    ],
  },
  {
    id: "p003",
    code: "8510",
    type: "Semi Finished",
    name: "Styrene Base 8510",
    unit: "kg",
    kemasan: "Drum 200kg",
    lots: [
      { lotNo: "P3.20202606051", tanggalMasuk: "2026-06-05", stok: 400 },
      { lotNo: "P3.20202606052", tanggalMasuk: "2026-06-08", stok: 200 },
      { lotNo: "P3.20202606053", tanggalMasuk: "2026-06-11", stok: 600 },
      { lotNo: "P3.20202606054", tanggalMasuk: "2026-06-15", stok: 800 },
    ],
  },
  {
    id: "p004",
    code: "7320",
    type: "Finished Good",
    name: "Vinyl Compound 7320",
    unit: "kg",
    kemasan: "Flexi Bag 500kg",
    lots: [{ lotNo: "P4.20202606061", tanggalMasuk: "2026-06-06", stok: 2500 }],
  },
  {
    id: "p005",
    code: "6105",
    type: "Semi Finished",
    name: "Binder Solution 6105",
    unit: "liter",
    kemasan: "Drum 200L",
    lots: [
      { lotNo: "P5.20202606011", tanggalMasuk: "2026-06-01", stok: 50 },
      { lotNo: "P5.20202606012", tanggalMasuk: "2026-06-09", stok: 80 },
    ],
  },
  {
    id: "p006",
    code: "4400",
    type: "Finished Good",
    name: "Acrylic Latex 4400",
    unit: "kg",
    kemasan: "Drum 200kg",
    lots: [
      { lotNo: "P6.20202606131", tanggalMasuk: "2026-06-13", stok: 1800 },
      { lotNo: "P6.20202606132", tanggalMasuk: "2026-06-16", stok: 900 },
    ],
  },
];

const MIN_STOCK_THRESHOLD = 500;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function totalStok(product) {
  return product.lots.reduce((sum, lot) => sum + lot.stok, 0);
}

function latestEntry(product) {
  return product.lots.reduce((latest, lot) =>
    lot.tanggalMasuk > latest.tanggalMasuk ? lot : latest
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(n) {
  return Number(n).toLocaleString("id-ID");
}

function isLow(product) {
  return totalStok(product) <= MIN_STOCK_THRESHOLD;
}

// ─── Badge Components ─────────────────────────────────────────────────────────

function StatusBadge({ low }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        low
          ? "bg-red-100 text-red-700 border border-red-200"
          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
      }`}
    >
      {low ? (
        <AlertTriangle className="w-3 h-3" />
      ) : (
        <CheckCircle2 className="w-3 h-3" />
      )}
      {low ? "Rendah" : "Normal"}
    </span>
  );
}

function TypeBadge({ type }) {
  const isFinished = type === "Finished Good";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
        isFinished ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {type}
    </span>
  );
}

// ─── Add/Edit Form Modal ──────────────────────────────────────────────────────

function ProductForm({ show, editData, warehouses = [], onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    type: "Finished Good",
    name: "",
    unit: "kg",
    kemasan: "",
    lotNo: "",
    tanggalMasuk: new Date().toISOString().split("T")[0],
    stok: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      const latest = latestEntry(editData);
      setFormData({
        code: editData.code,
        type: editData.type,
        name: editData.name,
        unit: editData.unit,
        kemasan: editData.kemasan,
        lotNo: latest.lotNo,
        tanggalMasuk: latest.tanggalMasuk,
        stok: latest.stok,
      });
    } else {
      setFormData({
        code: "",
        type: "Finished Good",
        name: "",
        unit: "kg",
        kemasan: "",
        lotNo: "",
        tanggalMasuk: new Date().toISOString().split("T")[0],
        stok: 0,
      });
    }
  }, [editData, show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate API
    onSave(formData, editData?.id);
    setSubmitting(false);
  };

  const isEdit = !!editData;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEdit ? "bg-amber-100" : "bg-cyan-100"
              }`}
            >
              {isEdit ? (
                <Edit3 className="w-5 h-5 text-amber-600" />
              ) : (
                <Plus className="w-5 h-5 text-cyan-600" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {isEdit ? "Edit Produk" : "Tambah Stok Produk Baru"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit
                  ? "Perbarui informasi produk"
                  : "Isi data produk & lot masuk gudang"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Informasi Produk */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Informasi Produk
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kode Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                  placeholder="Contoh: 9110"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tipe <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm bg-white"
                >
                  <option value="Finished Good">Finished Good</option>
                  <option value="Semi Finished">Semi Finished</option>
                  <option value="Work In Progress">Work In Progress</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Nama produk"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kemasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.kemasan}
                  onChange={(e) =>
                    setFormData({ ...formData, kemasan: e.target.value })
                  }
                  required
                  placeholder="Contoh: Drum 200kg"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm bg-white"
              >
                {["kg", "liter", "pcs", "gram", "ml", "box"].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Informasi Lot */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {isEdit ? "Lot Terakhir" : "Lot Masuk Gudang"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  No. Lot <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lotNo}
                  onChange={(e) =>
                    setFormData({ ...formData, lotNo: e.target.value })
                  }
                  required
                  placeholder="P1.20202606123"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal Masuk Gudang <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.tanggalMasuk}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalMasuk: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stok (qty) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.stok}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stok: parseFloat(e.target.value) || 0,
                  })
                }
                required
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all disabled:opacity-50 ${
                isEdit
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/30"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30"
              }`}
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {submitting
                ? "Menyimpan..."
                : isEdit
                ? "Update Produk"
                : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Detail Stok Per Lot ──────────────────────────────────────────────────────

function DetailStokPage({ product, onBack, onDeleteLot, onAddLot }) {
  const [search, setSearch] = useState("");
  const [showAddLot, setShowAddLot] = useState(false);
  const [newLot, setNewLot] = useState({
    lotNo: "",
    tanggalMasuk: new Date().toISOString().split("T")[0],
    stok: 0,
  });

  const filteredLots = product.lots.filter((l) =>
    l.lotNo.toLowerCase().includes(search.toLowerCase())
  );

  const total = totalStok(product);
  const low = isLow(product);

  const handleAddLot = (e) => {
    e.preventDefault();
    onAddLot(product.id, newLot);
    setNewLot({
      lotNo: "",
      tanggalMasuk: new Date().toISOString().split("T")[0],
      stok: 0,
    });
    setShowAddLot(false);
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <code className="px-2.5 py-1 rounded-lg bg-slate-100 text-sm font-mono font-bold text-slate-800">
                {product.code}
              </code>
              <TypeBadge type={product.type} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {product.name}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Kemasan: {product.kemasan} · Unit: {product.unit}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddLot(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Lot Baru
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Layers className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {product.lots.length}
            </p>
            <p className="text-sm text-slate-500">Total Lot</p>
          </div>
        </div>
        <div
          className={`bg-white rounded-xl p-5 flex items-center gap-4 border ${
            low ? "border-red-200/50" : "border-emerald-200/50"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              low
                ? "bg-gradient-to-br from-red-100 to-red-200"
                : "bg-gradient-to-br from-emerald-100 to-emerald-200"
            }`}
          >
            <BarChart3
              className={`w-6 h-6 ${low ? "text-red-600" : "text-emerald-600"}`}
            />
          </div>
          <div>
            <p
              className={`text-2xl font-bold ${
                low ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {formatNumber(total)}
            </p>
            <p
              className={`text-sm ${low ? "text-red-500" : "text-emerald-500"}`}
            >
              Total Stok ({product.unit})
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">
              {formatDate(latestEntry(product).tanggalMasuk)}
            </p>
            <p className="text-sm text-slate-500">Masuk Terakhir</p>
          </div>
        </div>
      </div>

      {/* Add Lot Modal */}
      {showAddLot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Tambah Lot Baru</h2>
                  <p className="text-xs text-slate-500">
                    untuk kode {product.code} — {product.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddLot(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddLot} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  No. Lot <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLot.lotNo}
                  onChange={(e) =>
                    setNewLot({ ...newLot, lotNo: e.target.value })
                  }
                  required
                  placeholder="P1.20202606124"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal Masuk Gudang <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newLot.tanggalMasuk}
                  onChange={(e) =>
                    setNewLot({ ...newLot, tanggalMasuk: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Stok ({product.unit}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={newLot.stok}
                  onChange={(e) =>
                    setNewLot({
                      ...newLot,
                      stok: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLot(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" /> Simpan Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200/50 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari no. lot..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      {/* Lot Table */}
      <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-10">
                  #
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  No. Lot
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tanggal Masuk Gudang
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Stok ({product.unit})
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    Tidak ada lot ditemukan
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot, idx) => {
                  const lotLow = lot.stok <= 100;
                  return (
                    <tr
                      key={lot.lotNo}
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                        idx % 2 === 0 ? "" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="px-4 py-4 text-sm text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-4">
                        <code className="px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-mono font-semibold text-blue-800">
                          {lot.lotNo}
                        </code>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          {formatDate(lot.tanggalMasuk)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`text-lg font-bold ${
                            lotLow ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {formatNumber(lot.stok)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <StatusBadge low={lotLow} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus lot "${lot.lotNo}"?`))
                                onDeleteLot(product.id, lot.lotNo);
                            }}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                            title="Hapus Lot"
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
        {filteredLots.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {filteredLots.length}
              </span>{" "}
              lot · Total stok:{" "}
              <span className="font-bold text-slate-800">
                {formatNumber(filteredLots.reduce((s, l) => s + l.stok, 0))}{" "}
                {product.unit}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Stok Gudang Page ────────────────────────────────────────────────────

export default function WarehouseStockPage() {
  const [products, setProducts] = useState(DUMMY_STOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // for detail page

  // Stats
  const stats = {
    total: products.length,
    lowStock: products.filter(isLow).length,
    normal: products.filter((p) => !isLow(p)).length,
    totalLots: products.reduce((s, p) => s + p.lots.length, 0),
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  };

  const handleSave = (formData, editId) => {
    if (editId) {
      setProducts(
        products.map((p) => {
          if (p.id !== editId) return p;
          const updatedLots = p.lots.map((l) =>
            l.lotNo === formData.lotNo
              ? {
                  ...l,
                  tanggalMasuk: formData.tanggalMasuk,
                  stok: formData.stok,
                }
              : l
          );
          return {
            ...p,
            code: formData.code,
            type: formData.type,
            name: formData.name,
            unit: formData.unit,
            kemasan: formData.kemasan,
            lots: updatedLots,
          };
        })
      );
    } else {
      const newProduct = {
        id: `p${Date.now()}`,
        code: formData.code,
        type: formData.type,
        name: formData.name,
        unit: formData.unit,
        kemasan: formData.kemasan,
        lots: [
          {
            lotNo: formData.lotNo,
            tanggalMasuk: formData.tanggalMasuk,
            stok: formData.stok,
          },
        ],
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id, name) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleDeleteLot = (productId, lotNo) => {
    setProducts(
      products.map((p) => {
        if (p.id !== productId) return p;
        const updated = { ...p, lots: p.lots.filter((l) => l.lotNo !== lotNo) };
        return updated;
      })
    );
    // Sync selectedProduct
    setSelectedProduct((prev) =>
      prev && prev.id === productId
        ? { ...prev, lots: prev.lots.filter((l) => l.lotNo !== lotNo) }
        : prev
    );
  };

  const handleAddLot = (productId, lot) => {
    setProducts(
      products.map((p) => {
        if (p.id !== productId) return p;
        return { ...p, lots: [...p.lots, lot] };
      })
    );
    setSelectedProduct((prev) =>
      prev && prev.id === productId
        ? { ...prev, lots: [...prev.lots, lot] }
        : prev
    );
  };

  // Filter
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "" ||
      (filterStatus === "low" && isLow(p)) ||
      (filterStatus === "normal" && !isLow(p));
    const matchType = filterType === "" || p.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  // ── Detail page ──
  if (selectedProduct) {
    const liveProduct =
      products.find((p) => p.id === selectedProduct.id) || selectedProduct;
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <DetailStokPage
          product={liveProduct}
          onBack={() => setSelectedProduct(null)}
          onDeleteLot={handleDeleteLot}
          onAddLot={handleAddLot}
        />
      </div>
    );
  }

  // ── Main page ──
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-white" />
                </div>
                Stok Gudang Produk
              </h1>
              <p className="text-sm text-slate-500 mt-1 ml-13">
                Kelola stok produk jadi & semi produk di gudang
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Tambah Stok Produk
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <Package className="w-6 h-6 text-slate-600" />,
                value: stats.total,
                label: "Total Produk",
                bg: "from-slate-100 to-slate-200",
                border: "border-slate-200/50",
                val: "text-slate-900",
              },
              {
                icon: <Layers className="w-6 h-6 text-blue-600" />,
                value: stats.totalLots,
                label: "Total Lot",
                bg: "from-blue-100 to-blue-200",
                border: "border-blue-200/50",
                val: "text-blue-700",
              },
              {
                icon: <TrendingDown className="w-6 h-6 text-red-600" />,
                value: stats.lowStock,
                label: "Stok Rendah",
                bg: "from-red-100 to-red-200",
                border: "border-red-200/50",
                val: "text-red-600",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
                value: stats.normal,
                label: "Stok Normal",
                bg: "from-emerald-100 to-emerald-200",
                border: "border-emerald-200/50",
                val: "text-emerald-600",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl p-5 border ${s.border} flex items-center gap-4`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center shrink-0`}
                >
                  {s.icon}
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.val}`}>{s.value}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Modal */}
          <ProductForm
            show={showForm}
            editData={editingProduct}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            onSave={handleSave}
          />

          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200/50 p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kode atau nama produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Filter className="w-4 h-4" />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Semua Tipe</option>
                  <option value="Finished Good">Finished Good</option>
                  <option value="Semi Finished">Semi Finished</option>
                  <option value="Work In Progress">Work In Progress</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Semua Status</option>
                  <option value="low">🔴 Stok Rendah</option>
                  <option value="normal">🟢 Stok Normal</option>
                </select>
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-10">
                      No
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      No. Lot
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tgl Masuk Gudang
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nama Produk
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total Stok
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Kemasan
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-12 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" />
                          <span className="text-slate-500">
                            Memuat data stok...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-12 text-center">
                        <Boxes className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500">
                          Tidak ada produk ditemukan
                        </p>
                        <button
                          onClick={() => setShowForm(true)}
                          className="mt-3 text-sm text-cyan-600 font-medium hover:text-cyan-700"
                        >
                          + Tambah produk baru
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, idx) => {
                      const total = totalStok(product);
                      const low = isLow(product);
                      const latest = latestEntry(product);
                      const lotCount = product.lots.length;

                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-slate-100 hover:bg-cyan-50/30 transition-colors cursor-pointer ${
                            idx % 2 === 0 ? "" : "bg-slate-50/30"
                          }`}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <td className="px-4 py-4 text-sm text-slate-400 font-medium">
                            {idx + 1}
                          </td>

                          {/* No Lot column — shows latest + count badge */}
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="flex items-center gap-2 group"
                            >
                              <code className="px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-mono font-semibold text-blue-800 group-hover:bg-blue-100 transition-colors">
                                {latest.lotNo}
                              </code>
                              {lotCount > 1 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                                  +{lotCount - 1}
                                </span>
                              )}
                            </button>
                          </td>

                          {/* Tanggal masuk — shows latest entry date */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                              {formatDate(latest.tanggalMasuk)}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <code className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-mono font-semibold text-slate-700">
                              {product.code}
                            </code>
                          </td>

                          <td className="px-4 py-4">
                            <TypeBadge type={product.type} />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                  low
                                    ? "bg-gradient-to-br from-red-100 to-red-200"
                                    : "bg-gradient-to-br from-cyan-100 to-blue-100"
                                }`}
                              >
                                <Package
                                  className={`w-4 h-4 ${
                                    low ? "text-red-600" : "text-cyan-600"
                                  }`}
                                />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800 text-sm">
                                  {product.name}
                                </span>
                                <p className="text-xs text-slate-400">
                                  {lotCount} lot tersimpan
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span
                              className={`text-lg font-bold ${
                                low ? "text-red-600" : "text-emerald-600"
                              }`}
                            >
                              {formatNumber(total)}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                              {product.unit}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600">
                              {product.kemasan}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <StatusBadge low={low} />
                          </td>

                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setSelectedProduct(product)}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                title="Lihat Detail Lot"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowForm(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                                title="Edit Produk"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(product.id, product.name)
                                }
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                                title="Hapus Produk"
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

            {filteredProducts.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-slate-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredProducts.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-slate-700">
                    {products.length}
                  </span>{" "}
                  produk
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Info className="w-3.5 h-3.5" />
                  Klik baris untuk lihat detail stok per lot
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600">Stok Normal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-slate-600">Stok Rendah</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
