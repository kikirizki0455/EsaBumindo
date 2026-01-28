import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";


export default function ProductManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "PVAC",
    description: "",
  });

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch dari endpoint yang benar
      const res = await apiFetch("/production/master/products");
      if (res.ok) {
        const data = await res.json();
        let productsArray = Array.isArray(data)
          ? data
          : data.data || data.products || [];
        setProducts(productsArray);
      } else {
        // Gunakan dummy data jika API belum ready
        console.warn("Failed to fetch products, using dummy data");
        setProducts(getDummyProducts());
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(getDummyProducts());
    } finally {
      setLoading(false);
    }
  };

  const getDummyProducts = () => [
    {
      id: "1",
      code: "PROD-001",
      name: "Adhesive PVAC Premium",
      type: "PVAC",
      description: "Polyvinyl Acetate adhesive untuk aplikasi premium",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      code: "PROD-002",
      name: "Styrene Resin Standard",
      type: "STYRENE",
      description: "Styrene resin untuk aplikasi standard",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      code: "PROD-003",
      name: "EVA Compound Mix",
      type: "EVA",
      description: "Ethylene Vinyl Acetate compound",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      code: "PROD-004",
      name: "Acrylic All Purpose",
      type: "ALL ACR",
      description: "Acrylate polymer untuk kegunaan umum",
      createdAt: new Date().toISOString(),
    },
  ];

  const handleAdd = () => {
    router.push("/admin/ppic/product-create");
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      code: product.code,
      type: product.type,
      description: product.description,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update product
      setProducts(
        products.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      );
    } else {
      // Add new product
      setProducts([
        ...products,
        {
          id: Math.random().toString(36),
          ...formData,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    setShowForm(false);
    setFormData({ name: "", code: "", type: "PVAC", description: "" });
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleBack = () => {
    router.push("/admin/ppic/dashboard");
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.btnSecondary}
          onClick={handleBack}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          ← Dashboard
        </button>
      </div>

      <div className={styles.header}>
        <h1>📦 Manajemen Produk</h1>
        <button className={styles.btnPrimary} onClick={handleAdd}>
          ➕ Tambah Produk
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            {editingId ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}
          </h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Kode Produk *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                  placeholder="PROD-001"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nama Produk *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Nama produk"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tipe Produk *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Deskripsi</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi produk"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
              <button type="submit" className={styles.btnPrimary}>
                {editingId ? "Update" : "Tambah"} Produk
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className={styles.emptyState}>Tidak ada produk</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>Tipe</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className={styles.tableRow}>
                  <td>
                    <code
                      style={{
                        fontSize: "12px",
                        background: "#f5f5f5",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {product.code}
                    </code>
                  </td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        background: getTypeColor(product.type).bg,
                        color: getTypeColor(product.type).text,
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {product.type}
                    </span>
                  </td>
                  <td style={{ fontSize: "13px", color: "#666" }}>
                    {product.description || "-"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className={styles.btnAction}
                        onClick={() => handleEdit(product)}
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className={styles.btnAction}
                        onClick={() => handleDelete(product.id)}
                        style={{
                          fontSize: "12px",
                          padding: "6px 12px",
                          background: "#ffe6e6",
                          color: "#cc0000",
                        }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getTypeColor(type) {
  const colors = {
    PVAC: { bg: "#e6f2ff", text: "#0066cc" },
    STYRENE: { bg: "#f0e6ff", text: "#6600cc" },
    EVA: { bg: "#e6ffe6", text: "#00aa00" },
    "ALL ACR": { bg: "#fff3e6", text: "#ff6600" },
    PSA: { bg: "#ffe6f0", text: "#cc0066" },
    VINYL: { bg: "#e6ffff", text: "#0099cc" },
    DEMPUL: { bg: "#ffe6e6", text: "#cc0000" },
    WIP: { bg: "#f0f0f0", text: "#666" },
  };
  return colors[type] || { bg: "#f0f0f0", text: "#666" };
}
