import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css"; 

/**
 * Page: Create Production Schedule
 *
 * Features:
 * - Pilih product dari daftar yang sudah dibuat
 * - Auto-populate material requirements berdasarkan product BOM
 * - Input qty dan akan mengurangi stock bahan baku otomatis
 * - Validasi stock sebelum create
 * - Back navigation ke dashboard
 */
export default function ScheduleCreatePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    planDate: new Date().toISOString().split("T")[0],
    plant: "P1",
    reactor: "A",
    productId: "",
    targetQty: 1,
    notes: "",
    noLot: "", // Tambahan: Manual input No Lot
    noBpm: "", // Tambahan: Auto-generated No BPM
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [materialRequirements, setMaterialRequirements] = useState([]);
  const [stockWarnings, setStockWarnings] = useState([]);
  const [materialNeeds, setMaterialNeeds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate material needs whenever qty or selectedProduct changes
    if (selectedProduct && formData.targetQty > 0) {
      const qty = parseFloat(formData.targetQty) || 0;
      const needs = [];
      let warnings = [];

      materialRequirements.forEach((req) => {
        const needed = (qty * req.percentage) / 100;
        const material = materials.find((m) => m.id === req.materialId);

        // Handle berbagai format struktur material
        let available = 0;
        if (material) {
          if (
            material.materialStocks &&
            Array.isArray(material.materialStocks) &&
            material.materialStocks.length > 0
          ) {
            available = parseFloat(material.materialStocks[0].quantity) || 0;
          } else if (material.currentStock !== undefined) {
            available = parseFloat(material.currentStock) || 0;
          }
        }

        needs.push({
          ...req,
          needed: needed.toFixed(2),
          available: available.toFixed(2),
          isLowStock: available < needed,
        });

        if (available < needed) {
          warnings.push(
            `${req.name}: Hanya tersedia ${available.toFixed(2)} ${
              req.unit
            }, butuh ${needed.toFixed(2)} ${req.unit}`
          );
        }
      });

      setStockWarnings(warnings);
      setMaterialNeeds(needs);
    } else {
      setStockWarnings([]);
      setMaterialNeeds([]);
    }
  }, [formData.targetQty, selectedProduct, materialRequirements, materials]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch products with BOM from correct endpoint
      const productsRes = await apiFetch("/production/master/products");
      let productsData = [];
      if (productsRes.ok) {
        const data = await productsRes.json();
        productsData = Array.isArray(data)
          ? data
          : data.data || data.products || [];
      } else {
        console.warn("Failed to fetch products, using dummy data");
        productsData = getDummyProducts();
      }
      setProducts(productsData);

      // Fetch materials from correct endpoint
      const materialsRes = await apiFetch("/production/master/materials");
      let materialsData = [];
      if (materialsRes.ok) {
        const data = await materialsRes.json();
        materialsData = Array.isArray(data)
          ? data
          : data.data || data.materials || [];
      } else {
        console.warn("Failed to fetch materials, using dummy data");
        materialsData = getDummyMaterials();
      }
      setMaterials(materialsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProducts(getDummyProducts());
      setMaterials(getDummyMaterials());
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
      description: "Polyvinyl Acetate adhesive",
      bom: {
        details: [
          {
            materialId: "m1",
            material: { name: "Resin Dasar", unit: "kg" },
            percentage: 30,
          },
          {
            materialId: "m2",
            material: { name: "Hardener A", unit: "kg" },
            percentage: 20,
          },
          {
            materialId: "m3",
            material: { name: "Pigment Merah", unit: "kg" },
            percentage: 10,
          },
          {
            materialId: "m4",
            material: { name: "Solvent X", unit: "liter" },
            percentage: 15,
          },
          {
            materialId: "m5",
            material: { name: "Filler Powder", unit: "kg" },
            percentage: 25,
          },
        ],
      },
    },
    {
      id: "2",
      code: "PROD-002",
      name: "Styrene Resin Standard",
      type: "STYRENE",
      description: "Styrene resin",
      bom: {
        details: [
          {
            materialId: "m1",
            material: { name: "Resin Dasar", unit: "kg" },
            percentage: 40,
          },
          {
            materialId: "m2",
            material: { name: "Hardener A", unit: "kg" },
            percentage: 30,
          },
          {
            materialId: "m4",
            material: { name: "Solvent X", unit: "liter" },
            percentage: 30,
          },
        ],
      },
    },
    {
      id: "3",
      code: "PROD-003",
      name: "EVA Compound Mix",
      type: "EVA",
      description: "Ethylene Vinyl Acetate",
      bom: {
        details: [
          {
            materialId: "m1",
            material: { name: "Resin Dasar", unit: "kg" },
            percentage: 35,
          },
          {
            materialId: "m5",
            material: { name: "Filler Powder", unit: "kg" },
            percentage: 65,
          },
        ],
      },
    },
  ];

  const getDummyMaterials = () => [
    {
      id: "m1",
      code: "MAT-001",
      name: "Resin Dasar",
      unit: "kg",
      materialStocks: [{ quantity: 500 }],
      minStock: 100,
    },
    {
      id: "m2",
      code: "MAT-002",
      name: "Hardener A",
      unit: "kg",
      materialStocks: [{ quantity: 200 }],
      minStock: 50,
    },
    {
      id: "m3",
      code: "MAT-003",
      name: "Pigment Merah",
      unit: "kg",
      materialStocks: [{ quantity: 80 }],
      minStock: 20,
    },
    {
      id: "m4",
      code: "MAT-004",
      name: "Solvent X",
      unit: "liter",
      materialStocks: [{ quantity: 150 }],
      minStock: 30,
    },
    {
      id: "m5",
      code: "MAT-005",
      name: "Filler Powder",
      unit: "kg",
      materialStocks: [{ quantity: 450 }],
      minStock: 100,
    },
  ];

  const handleProductChange = (productId) => {
    setFormData({ ...formData, productId });

    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);

    // Load material requirements from BOM
    if (product && product.bom && product.bom.details) {
      const requirements = product.bom.details.map((detail) => ({
        materialId: detail.materialId,
        name: detail.material?.name || "Unknown",
        unit: detail.material?.unit || "kg",
        percentage: detail.percentage,
      }));
      setMaterialRequirements(requirements);

      // Generate No BPM otomatis: {plant}{tahun}{bulan}{sequence}
      generateNoBPM();
    } else {
      setMaterialRequirements([]);
    }
  };

  /**
   * Generate No BPM dengan format: {plant}{tahun}{bulan}{sequence}
   * Contoh: P120260107 (Plant 1, 2026-01-07)
   */
  const generateNoBPM = () => {
    const now = new Date();
    const plant =
      formData.plant === "P1" ? "1" : formData.plant === "P2" ? "2" : "3";
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    // Format: P{plant}{year}{month}{day}
    const noBpm = `P${plant}${year}${month}${day}`;
    setFormData((prev) => ({ ...prev, noBpm }));
  };

  const handleQtyChange = (e) => {
    setFormData({ ...formData, targetQty: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.productId) {
      setError("Silakan pilih produk");
      return;
    }

    // Validate No Lot
    if (!formData.noLot) {
      setError("Nomor lot harus diisi");
      return;
    }

    // Validate qty
    if (formData.targetQty <= 0) {
      setError("Target Quantity harus lebih dari 0");
      return;
    }

    // Check stock before submit
    const hasLowStock = materialNeeds.some((need) => need.isLowStock);
    if (hasLowStock) {
      setError("❌ Stok bahan baku tidak cukup. Silakan periksa kembali.");
      return;
    }

    try {
      // Create production plan
      const payload = {
        planDate: formData.planDate,
        plant: formData.plant,
        reactor: formData.reactor,
        productId: formData.productId,
        targetQty: parseFloat(formData.targetQty),
        noLot: formData.noLot, // Include No Lot
        noBpm: formData.noBpm, // Include No BPM
        notes: formData.notes,
      };

      console.log("Creating schedule with payload:", payload);

      const createRes = await apiFetch("/production/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (createRes.ok) {
        const planData = await createRes.json();
        console.log("Schedule created successfully:", planData);
        alert("✅ Jadwal produksi berhasil dibuat!");
        router.push(`/admin/ppic/schedule-detail/${planData.id}`);
      } else {
        // Parse error response
        let errorMessage = "Gagal membuat jadwal";
        try {
          const errorData = await createRes.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          // Handle nested error messages
          if (errorData.statusCode === 400 || errorData.statusCode === 404) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.warn("Could not parse error response");
        }

        setError(`❌ ${errorMessage}`);
        console.error("Backend error:", createRes.status, errorMessage);
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      setError(
        error.message ||
          "Gagal membuat jadwal. Silakan cek koneksi atau hubungi admin."
      );
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
        <h1>➕ Buat Jadwal Produksi</h1>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
          Sistem akan otomatis mengurangi stok bahan baku sesuai kebutuhan
          produksi
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>
            📋 Informasi Jadwal
          </h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tanggal Rencana *</label>
              <input
                type="date"
                value={formData.planDate}
                onChange={(e) =>
                  setFormData({ ...formData, planDate: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Plant *</label>
              <select
                value={formData.plant}
                onChange={(e) =>
                  setFormData({ ...formData, plant: e.target.value })
                }
                required
              >
                <option value="P1">Plant 1</option>
                <option value="P2">Plant 2</option>
                <option value="BOTH">Kedua Plant</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Reactor *</label>
              <select
                value={formData.reactor}
                onChange={(e) =>
                  setFormData({ ...formData, reactor: e.target.value })
                }
                required
              >
                <option value="A">Reactor A</option>
                <option value="B">Reactor B</option>
                <option value="C">Reactor C</option>
                <option value="D">Reactor D</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Target Quantity (kg) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.targetQty}
                onChange={handleQtyChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Produk *</label>
            <select
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              required
            >
              <option value="">-- Pilih Produk --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.code} - {product.name} ({product.type})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>No Lot (Manual Input) *</label>
              <input
                type="text"
                value={formData.noLot}
                onChange={(e) =>
                  setFormData({ ...formData, noLot: e.target.value })
                }
                placeholder="Masukkan nomor lot (contoh: LOT-001)"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>No BPM (Auto-Generated)</label>
              <input
                type="text"
                value={formData.noBpm}
                readOnly
                placeholder="Akan diisi otomatis saat produk dipilih"
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
              <small
                style={{ color: "#666", marginTop: "5px", display: "block" }}
              >
                Format: P
                {formData.plant === "P1"
                  ? "1"
                  : formData.plant === "P2"
                  ? "2"
                  : "3"}
                {new Date().getFullYear()}
                {String(new Date().getMonth() + 1).padStart(2, "0")}
                {String(new Date().getDate()).padStart(2, "0")}
              </small>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Catatan (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              placeholder="Catatan tambahan untuk produksi..."
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleBack}
            >
              Batal
            </button>
            <button type="submit" className={styles.btnPrimary}>
              ✅ Buat Jadwal
            </button>
          </div>
        </form>
      </div>

      {selectedProduct && materialRequirements.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>
            📦 Kebutuhan Material untuk {selectedProduct.name}
          </h3>

          {stockWarnings.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              {stockWarnings.map((warning, idx) => (
                <div
                  key={idx}
                  className={styles.error}
                  style={{ marginBottom: "10px" }}
                >
                  ⚠️ {warning}
                </div>
              ))}
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>% Kebutuhan</th>
                  <th style={{ textAlign: "right" }}>Qty Dibutuhkan</th>
                  <th style={{ textAlign: "right" }}>Stok Tersedia</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {materialNeeds.map((need) => (
                  <tr key={need.materialId}>
                    <td style={{ fontWeight: 600 }}>{need.name}</td>
                    <td style={{ textAlign: "center" }}>{need.percentage}%</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {need.needed} {need.unit}
                    </td>
                    <td style={{ textAlign: "right", color: "#666" }}>
                      {need.available} {need.unit}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          background: need.isLowStock ? "#ffe6e6" : "#e6ffe6",
                          color: need.isLowStock ? "#cc0000" : "#00aa00",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {need.isLowStock ? "❌ Kurang" : "✓ Cukup"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              background: "#f0f7ff",
              borderRadius: "6px",
              borderLeft: "4px solid #0066cc",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", color: "#0052a3" }}>
              ℹ️ <strong>Info:</strong> Ketika jadwal produksi dibuat, stok
              bahan baku akan otomatis berkurang sesuai dengan kebutuhan di
              atas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
