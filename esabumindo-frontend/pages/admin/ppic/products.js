import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import AdminLayout from "@/components/layout/admin-layout";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Filter,
} from "lucide-react";

/**
 * Toast Notification Component
 */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6";
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: bgColor,
        color: "white",
        padding: "16px 24px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "500px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <span style={{ flex: 1, fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ×
      </button>
    </div>
  );
};

export default function ProductManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all"); // all, with-bom, without-bom

  const productTypes = [
    "PVAC",
    "STYRENE",
    "EVA",
    "ALL ACR",
    "PSA",
    "VINYL",
    "DEMPUL",
    "WIP",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/production/master/products");
      if (res.ok) {
        const data = await res.json();
        let productsArray = Array.isArray(data)
          ? data
          : data.data || data.products || [];
        setProducts(productsArray);
        showToast(`${productsArray.length} produk dimuat`, "success");
      } else {
        console.warn("Failed to fetch products, using dummy data");
        setProducts(getDummyProducts());
        showToast("Menggunakan data demo", "info");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(getDummyProducts());
      showToast("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  const getDummyProducts = () => [
    {
      id: "1",
      code: "EB - 5502",
      name: "EB - 5502",
      type: "PVAC",
      description: "Polyvinyl Acetate adhesive",
      bom: null, // No BOM
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      code: "PROD-002",
      name: "Styrene Resin Standard",
      type: "STYRENE",
      description: "Styrene resin",
      bom: { details: [{ id: 1 }, { id: 2 }] }, // Has BOM
      createdAt: new Date().toISOString(),
    },
  ];

  const handleAdd = () => {
    router.push("/admin/ppic/product-create");
  };

  const handleEdit = (product) => {
    router.push(`/admin/ppic/product-edit/${product.id}`);
  };

  const handleDelete = async (product) => {
    if (!confirm(`Yakin ingin menghapus produk "${product.name}"?`)) return;

    try {
      const res = await apiFetch(
        `/production/master/products/${product.id}/delete`,
        {
          method: "PUT",
        }
      );

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== product.id));
        showToast("Produk berhasil dihapus", "success");
      } else {
        // Fallback: hapus dari state lokal
        setProducts(products.filter((p) => p.id !== product.id));
        showToast("Produk dihapus (mode demo)", "info");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setProducts(products.filter((p) => p.id !== product.id));
      showToast("Produk dihapus secara lokal", "info");
    }
  };

  const handleBack = () => {
    router.push("/admin/ppic/dashboard");
  };

  // Check if product has BOM
  const hasBOM = (product) => {
    return product.bom && product.bom.details && product.bom.details.length > 0;
  };

  // Get BOM material count
  const getBOMCount = (product) => {
    if (!product.bom || !product.bom.details) return 0;
    return product.bom.details.length;
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (filter === "with-bom") return hasBOM(product);
    if (filter === "without-bom") return !hasBOM(product);
    return true;
  });

  // Stats
  const stats = {
    total: products.length,
    withBOM: products.filter(hasBOM).length,
    withoutBOM: products.filter((p) => !hasBOM(p)).length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              Manajemen Produk
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-13">
              Kelola produk dan Bill of Materials (BOM)
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Produk Baru
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setFilter("all")}
            className={`p-5 rounded-xl cursor-pointer transition-all border-2 ${
              filter === "all"
                ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                : "bg-white text-slate-900 border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-80 mt-1">Total Produk</div>
          </div>

          <div
            onClick={() => setFilter("with-bom")}
            className={`p-5 rounded-xl cursor-pointer transition-all border-2 ${
              filter === "with-bom"
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30"
                : "bg-white text-slate-900 border-slate-200 hover:border-emerald-300"
            }`}
          >
            <div className="text-3xl font-bold">{stats.withBOM}</div>
            <div className="text-sm opacity-80 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Dengan BOM
            </div>
          </div>

          <div
            onClick={() => setFilter("without-bom")}
            className={`p-5 rounded-xl cursor-pointer transition-all border-2 ${
              filter === "without-bom"
                ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30"
                : "bg-white text-slate-900 border-slate-200 hover:border-amber-300"
            }`}
          >
            <div className="text-3xl font-bold">{stats.withoutBOM}</div>
            <div className="text-sm opacity-80 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Tanpa BOM
            </div>
          </div>
        </div>

        {/* Info Alert for products without BOM */}
        {stats.withoutBOM > 0 && (
          <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>
                ⚠️ {stats.withoutBOM} produk belum memiliki BOM/Formula.
              </strong>{" "}
              Produk tanpa BOM tidak bisa dijadwalkan untuk produksi. Klik
              tombol "Edit" untuk menambahkan formula.
            </p>
          </div>
        )}

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              {filter === "without-bom"
                ? "Semua produk sudah memiliki BOM 🎉"
                : filter === "with-bom"
                ? "Tidak ada produk dengan BOM"
                : "Tidak ada produk"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Nama Produk
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status BOM
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        !hasBOM(product) ? "border-l-4 border-l-amber-400" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <code className="text-sm bg-slate-100 px-3 py-1 rounded font-mono">
                          {product.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: getTypeColor(product.type).bg,
                            color: getTypeColor(product.type).text,
                          }}
                        >
                          {product.type || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {hasBOM(product) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {getBOMCount(product)} Material
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Belum Ada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                              hasBOM(product)
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-violet-500 text-white hover:bg-violet-600 shadow-md hover:shadow-lg"
                            }`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            {hasBOM(product) ? "Edit" : "Tambah BOM"}
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function getTypeColor(type) {
  const colors = {
    PVAC: { bg: "#dbeafe", text: "#1d4ed8" },
    STYRENE: { bg: "#f3e8ff", text: "#7c3aed" },
    EVA: { bg: "#d1fae5", text: "#059669" },
    "ALL ACR": { bg: "#ffedd5", text: "#ea580c" },
    PSA: { bg: "#fce7f3", text: "#db2777" },
    VINYL: { bg: "#cffafe", text: "#0891b2" },
    DEMPUL: { bg: "#fee2e2", text: "#dc2626" },
    WIP: { bg: "#f3f4f6", text: "#6b7280" },
  };
  return colors[type] || { bg: "#f3f4f6", text: "#6b7280" };
}
