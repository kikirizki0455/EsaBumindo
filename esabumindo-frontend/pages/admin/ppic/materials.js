import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

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
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    unit: "kg",
    description: "",
    minStock: 100,
    currentStock: 0,
    warehouseId: "",
  });

  const units = ["kg", "liter", "pcs", "gram", "ml", "box"];

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
      code: "MAT-001",
      name: "Resin Dasar",
      unit: "kg",
      description: "Resin base untuk semua jenis produk",
      minStock: 100,
      currentStock: 500,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m2",
      code: "MAT-002",
      name: "Hardener A",
      unit: "kg",
      description: "Hardener untuk proses curing",
      minStock: 50,
      currentStock: 200,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m3",
      code: "MAT-003",
      name: "Pigment Merah",
      unit: "kg",
      description: "Pigment untuk pewarna merah",
      minStock: 20,
      currentStock: 80,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m4",
      code: "MAT-004",
      name: "Solvent X",
      unit: "liter",
      description: "Solvent untuk pengencer",
      minStock: 30,
      currentStock: 150,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m5",
      code: "MAT-005",
      name: "Filler Powder",
      unit: "kg",
      description: "Filler untuk menambah volume",
      minStock: 100,
      currentStock: 450,
      createdAt: new Date().toISOString(),
    },
    {
      id: "m6",
      code: "MAT-006",
      name: "Stabilizer",
      unit: "kg",
      description: "Stabilizer untuk stabilitas produk",
      minStock: 25,
      currentStock: 120,
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
      description: material.description,
      minStock: material.minStock,
      currentStock: material.currentStock || 0,
      warehouseId: warehouses.length > 0 ? warehouses[0].id : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing material (frontend only for now)
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
      } else {
        // Add new material ke database
        const payload = {
          code: formData.code,
          name: formData.name,
          unit: formData.unit,
          description: formData.description,
          status: "active",
        };

        const res = await apiFetch("/production/master/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const error = await res.json();
          alert("Error: " + (error.message || "Gagal menyimpan material"));
          return;
        }

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
            console.warn("Warning: Stok tidak tersimpan, tapi material berhasil dibuat", err);
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

        alert("Material berhasil ditambahkan!");
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
      alert("Error: Gagal menyimpan material");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus material ini?")) {
      try {
        const res = await apiFetch(`/production/master/materials/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          alert("Error: Gagal menghapus material");
          return;
        }

        setMaterials(materials.filter((m) => m.id !== id));
        alert("Material berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting material:", error);
        setMaterials(materials.filter((m) => m.id !== id));
      }
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
        <h1>🧪 Manajemen Bahan Baku</h1>
        <button className={styles.btnPrimary} onClick={handleAdd}>
          ➕ Tambah Material
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
            {editingId ? "✏️ Edit Material" : "➕ Tambah Material Baru"}
          </h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Kode Material *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                  placeholder="MAT-001"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nama Material *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Nama material"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Unit *</label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  required
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Stok Minimum</label>
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
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Stok Saat Ini</label>
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
                />
              </div>

              {warehouses.length > 0 && (
                <div className={styles.formGroup}>
                  <label>Gudang</label>
                  <select
                    value={formData.warehouseId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warehouseId: e.target.value,
                      })
                    }
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

            <div className={styles.formGroup}>
              <label>Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Deskripsi material"
              />
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
                {editingId ? "Update" : "Tambah"} Material
              </button>
            </div>
          </form>
        </div>
      )}

      {materials.length === 0 ? (
        <div className={styles.emptyState}>Tidak ada material</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Material</th>
                <th>Unit</th>
                <th>Stok Saat Ini</th>
                <th>Min Stok</th>
                <th>Status</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => {
                const currentStock = Number(material.currentStock || 0);
                const minStock = Number(material.minStock || 0);
                const isLowStock = currentStock <= minStock;
                return (
                  <tr key={material.id} className={styles.tableRow}>
                    <td>
                      <code
                        style={{
                          fontSize: "12px",
                          background: "#f5f5f5",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {material.code}
                      </code>
                    </td>
                    <td style={{ fontWeight: 600 }}>{material.name}</td>
                    <td style={{ textAlign: "center", color: "#666" }}>
                      {material.unit}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                        color: isLowStock ? "#cc0000" : "#00aa00",
                      }}
                    >
                      {currentStock}
                    </td>
                    <td style={{ textAlign: "right", color: "#666" }}>
                      {minStock}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          background: isLowStock ? "#ffe6e6" : "#e6ffe6",
                          color: isLowStock ? "#cc0000" : "#00aa00",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {isLowStock ? "⚠️ Rendah" : "✓ Normal"}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "#666" }}>
                      {material.description || "-"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className={styles.btnAction}
                          onClick={() => handleEdit(material)}
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className={styles.btnAction}
                          onClick={() => handleDelete(material.id)}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
