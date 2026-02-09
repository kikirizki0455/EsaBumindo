import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/layout/admin-layout";
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
  Warehouse,
  Scale,
  FileText,
  TrendingDown,
  TrendingUp,
  MoreVertical,
  ChevronDown,
  Eye,
} from "lucide-react";

/**
 * Page: Material Management
 *
 * Features:
 * - List bahan baku dengan stok
 * - Tambah material baru + input stok
 * - Edit material + update stok
 * - Delete material
 * - Sync dengan database
 */
export default function MaterialManagementPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    unit: "kg",
    description: "",
    minStock: 100,
    currentStock: 0,
    warehouseId: "",
  });

  const units = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "liter", label: "Liter (L)" },
    { value: "pcs", label: "Pieces (pcs)" },
    { value: "gram", label: "Gram (g)" },
    { value: "ml", label: "Mililiter (ml)" },
    { value: "box", label: "Box" },
  ];

  useEffect(() => {
    fetchWarehouses();
    fetchMaterials();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await apiFetch("/production/master/warehouses");
      if (res.ok) {
        const data = await res.json();
        const warehousesArray = Array.isArray(data) ? data : data.data || [];
        setWarehouses(warehousesArray);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/production/master/materials");
      if (res.ok) {
        const data = await res.json();
        let materialsArray = Array.isArray(data)
          ? data
          : data.data || data.materials || [];
        setMaterials(materialsArray);
      } else {
        console.warn("Failed to fetch materials, using dummy data");
        setMaterials(getDummyMaterials());
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      setMaterials(getDummyMaterials());
    } finally {
      setLoading(false);
    }
  };

  const getDummyMaterials = () => [
    {
      id: "m1",
      code: "W 01",
      name: "Water",
      unit: "kg",
      description: "Air murni untuk campuran",
      minStock: 500,
      currentStock: 2500,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m2",
      code: "A 05",
      name: "Additive A",
      unit: "kg",
      description: "Bahan tambahan A untuk stabilitas",
      minStock: 100,
      currentStock: 450,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m3",
      code: "V 03 A",
      name: "Vinyl Acetate",
      unit: "kg",
      description: "Monomer vinyl acetate",
      minStock: 200,
      currentStock: 180,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m4",
      code: "V 01 A",
      name: "Vinyl Compound A",
      unit: "kg",
      description: "Compound vinyl tipe A",
      minStock: 150,
      currentStock: 620,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m5",
      code: "S 11",
      name: "Styrene Monomer",
      unit: "kg",
      description: "Styrene untuk basis produk",
      minStock: 300,
      currentStock: 250,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m6",
      code: "B 02",
      name: "Binder Solution",
      unit: "liter",
      description: "Larutan pengikat",
      minStock: 100,
      currentStock: 380,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m7",
      code: "K 03",
      name: "Catalyst K",
      unit: "kg",
      description: "Katalis untuk reaksi polimerisasi",
      minStock: 50,
      currentStock: 25,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m8",
      code: "E 04",
      name: "Emulsifier",
      unit: "kg",
      description: "Pengemulsi untuk stabilitas emulsi",
      minStock: 80,
      currentStock: 420,
      createdAt: new Date().toISOString(),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      code: "",
      unit: "kg",
      description: "",
      minStock: 100,
      currentStock: 0,
      warehouseId: warehouses.length > 0 ? warehouses[0].id : "",
    });
    setShowForm(true);
  };

  const handleEdit = (material) => {
    setEditingId(material.id);
    setFormData({
      name: material.name,
      code: material.code,
      unit: material.unit,
      description: material.description || "",
      minStock: material.minStock || 100,
      currentStock: material.currentStock || 0,
      warehouseId: warehouses.length > 0 ? warehouses[0].id : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        // Update existing material
        try {
          const res = await apiFetch(
            `/production/master/materials/${editingId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: formData.code,
                name: formData.name,
                unit: formData.unit,
                description: formData.description,
              }),
            }
          );

          if (res.ok) {
            const updatedMaterial = await res.json();
            setMaterials(
              materials.map((m) =>
                m.id === editingId
                  ? {
                      ...updatedMaterial,
                      currentStock: parseFloat(formData.currentStock) || 0,
                      minStock: formData.minStock,
                    }
                  : m
              )
            );
          } else {
            // Fallback to local update
            setMaterials(
              materials.map((m) =>
                m.id === editingId
                  ? {
                      ...m,
                      name: formData.name,
                      code: formData.code,
                      unit: formData.unit,
                      description: formData.description,
                      minStock: formData.minStock,
                      currentStock: parseFloat(formData.currentStock) || 0,
                    }
                  : m
              )
            );
          }
        } catch (error) {
          // Fallback to local update
          setMaterials(
            materials.map((m) =>
              m.id === editingId
                ? {
                    ...m,
                    name: formData.name,
                    code: formData.code,
                    unit: formData.unit,
                    description: formData.description,
                    minStock: formData.minStock,
                    currentStock: parseFloat(formData.currentStock) || 0,
                  }
                : m
            )
          );
        }
      } else {
        // Add new material ke database
        const payload = {
          code: formData.code,
          name: formData.name,
          unit: formData.unit,
          description: formData.description,
          status: "active",
        };

        try {
          const res = await apiFetch("/production/master/materials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const newMaterial = await res.json();

            // Jika ada stok yang diinput, simpan ke MaterialStock
            if (formData.currentStock > 0 && formData.warehouseId) {
              const stockPayload = {
                materialId: newMaterial.id,
                warehouseId: formData.warehouseId,
                quantity: parseFloat(formData.currentStock),
                minStock: formData.minStock,
              };

              await apiFetch("/production/master/material-stocks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stockPayload),
              }).catch((err) => {
                console.warn(
                  "Warning: Stok tidak tersimpan, tapi material berhasil dibuat",
                  err
                );
              });
            }

            // Add to local state dengan stok
            setMaterials([
              ...materials,
              {
                ...newMaterial,
                currentStock: parseFloat(formData.currentStock) || 0,
                minStock: formData.minStock,
              },
            ]);
          } else {
            // Fallback - add locally
            const newId = `m${Date.now()}`;
            setMaterials([
              ...materials,
              {
                id: newId,
                ...formData,
                currentStock: parseFloat(formData.currentStock) || 0,
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        } catch (error) {
          // Fallback - add locally
          const newId = `m${Date.now()}`;
          setMaterials([
            ...materials,
            {
              id: newId,
              ...formData,
              currentStock: parseFloat(formData.currentStock) || 0,
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      }

      setShowForm(false);
      setFormData({
        name: "",
        code: "",
        unit: "kg",
        description: "",
        minStock: 100,
        currentStock: 0,
        warehouseId: warehouses.length > 0 ? warehouses[0].id : "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Yakin ingin menghapus material "${name}"?`)) return;

    try {
      const res = await apiFetch(`/production/master/materials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMaterials(materials.filter((m) => m.id !== id));
      } else {
        // Fallback - delete locally
        setMaterials(materials.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      // Fallback - delete locally
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  // Filter materials
  const filteredMaterials = materials.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase());

    const currentStock = Number(m.currentStock || 0);
    const minStock = Number(m.minStock || 0);
    const isLowStock = currentStock <= minStock;

    if (filterStatus === "low") return matchSearch && isLowStock;
    if (filterStatus === "normal") return matchSearch && !isLowStock;
    return matchSearch;
  });

  // Stats
  const stats = {
    total: materials.length,
    lowStock: materials.filter(
      (m) => Number(m.currentStock || 0) <= Number(m.minStock || 0)
    ).length,
    normal: materials.filter(
      (m) => Number(m.currentStock || 0) > Number(m.minStock || 0)
    ).length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              Manajemen Bahan Baku
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-13">
              Kelola material dan stok bahan baku produksi
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Material
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Package className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Material</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-red-200/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.lowStock}
              </p>
              <p className="text-sm text-red-500">Stok Rendah</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-emerald-200/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.normal}
              </p>
              <p className="text-sm text-emerald-500">Stok Normal</p>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      editingId ? "bg-amber-100" : "bg-cyan-100"
                    }`}
                  >
                    {editingId ? (
                      <Edit3 className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-cyan-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">
                      {editingId ? "Edit Material" : "Tambah Material Baru"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {editingId
                        ? "Perbarui informasi material"
                        : "Isi data material baru"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Kode Material <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      required
                      placeholder="Contoh: W 01, A 05"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nama Material <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="Nama material"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm bg-white"
                    >
                      {units.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Stok Minimum
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStock: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="100"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Stok Saat Ini
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.currentStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentStock: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                    />
                  </div>

                  {warehouses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Gudang
                      </label>
                      <select
                        value={formData.warehouseId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            warehouseId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm bg-white"
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Deskripsi singkat tentang material ini..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all disabled:opacity-50 ${
                      editingId
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
                      : editingId
                      ? "Update Material"
                      : "Simpan Material"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200/50 p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode atau nama material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Status:</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="">Semua</option>
                <option value="low">🔴 Stok Rendah</option>
                <option value="normal">🟢 Stok Normal</option>
              </select>

              <button
                onClick={fetchMaterials}
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
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama Material
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stok Saat Ini
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Min. Stok
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" />
                        <span className="text-slate-500">
                          Memuat data material...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <Boxes className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">
                        Tidak ada material ditemukan
                      </p>
                      <button
                        onClick={handleAdd}
                        className="mt-3 text-sm text-cyan-600 font-medium hover:text-cyan-700"
                      >
                        + Tambah material baru
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material, idx) => {
                    const currentStock = Number(material.currentStock || 0);
                    const minStock = Number(material.minStock || 0);
                    const isLowStock = currentStock <= minStock;
                    const stockPercentage =
                      minStock > 0 ? (currentStock / minStock) * 100 : 100;

                    return (
                      <tr
                        key={material.id}
                        className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                          idx % 2 === 0 ? "" : "bg-slate-50/30"
                        }`}
                      >
                        <td className="px-4 py-4">
                          <code className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-mono font-semibold text-slate-700">
                            {material.code}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                isLowStock
                                  ? "bg-gradient-to-br from-red-100 to-red-200"
                                  : "bg-gradient-to-br from-cyan-100 to-blue-100"
                              }`}
                            >
                              <Package
                                className={`w-4 h-4 ${
                                  isLowStock ? "text-red-600" : "text-cyan-600"
                                }`}
                              />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {material.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                            {material.unit}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className={`text-lg font-bold ${
                              isLowStock ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {currentStock.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm text-slate-500">
                            {minStock.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isLowStock
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {isLowStock ? (
                                <AlertTriangle className="w-3 h-3" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {isLowStock ? "Rendah" : "Normal"}
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  stockPercentage < 50
                                    ? "bg-red-500"
                                    : stockPercentage < 100
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(stockPercentage, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-slate-500 max-w-[200px] truncate">
                            {material.description || "-"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEdit(material)}
                              className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
                              title="Edit Material"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(material.id, material.name)
                              }
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                              title="Hapus Material"
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

          {/* Table Footer */}
          {filteredMaterials.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Menampilkan{" "}
                <span className="font-semibold text-slate-700">
                  {filteredMaterials.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-700">
                  {materials.length}
                </span>{" "}
                material
              </p>
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
    </AdminLayout>
  );
}
