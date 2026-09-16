import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#f59e0b";
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
        animation: "slideIn 0.3s ease-out",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default function ProductEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const productTypes = [
    "PVAC",
    "STYRENE",
    "EVA",
    "ALL ACR",
    "PSA",
    "VINYL",
    "DEMPUL",
    "WIP",
    "BLENDING",
  ];

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "PVAC",
    description: "",
    baseQty: 5400,
  });

  const [bomDetails, setBomDetails] = useState([]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // ─── Helper: round ke 2 desimal ───────────────────────────────────────────
  const round2 = (val) => Math.round((val || 0) * 100) / 100;

  // ─── Helper: hitung percentage dari QtyKg (4 desimal presisi, tampil 2) ──
  const calcPct = (qtyKg, baseQty) => {
    if (!baseQty || baseQty <= 0) return 0;
    return (qtyKg / baseQty) * 100;
  };

  // ─── uniqueSteps: JAGA URUTAN kemunculan pertama, jangan pakai Set ────────
  const uniqueSteps = bomDetails.reduce((acc, b) => {
    if (b.step && b.step.trim() && !acc.includes(b.step)) {
      acc.push(b.step);
    }
    return acc;
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Load materials
      const materialsRes = await apiFetch("/production/master/materials");
      if (materialsRes.ok) {
        const data = await materialsRes.json();
        let materialsArray = Array.isArray(data)
          ? data
          : data.data || data.materials || [];
        setMaterials(materialsArray);
      }

      // Load product + BOM
      const productRes = await apiFetch(`/production/bom/${id}`);
      if (productRes.ok) {
        const productData = await productRes.json();
        setProduct(productData);

        const baseQty = productData.baseQty || 5400;

        setFormData({
          code: productData.code || "",
          name: productData.name || "",
          type: productData.type || "PVAC",
          description: productData.description || "",
          baseQty: baseQty,
        });

        console.log("📥 RAW BOM dari API:", productData.bom?.details);

        if (
          productData.bom &&
          productData.bom.details &&
          productData.bom.details.length > 0
        ) {
          const mapped = productData.bom.details.map((detail, idx) => {
            // ────────────────────────────────────────────────────────────────
            // PRIORITAS AMBIL QtyKg:
            // 1. Ambil langsung dari field QtyKg / qtyKg / qty_kg di API response
            // 2. Fallback: hitung dari percentage (tapi ini bisa rounding error)
            // ────────────────────────────────────────────────────────────────
            let QtyKg;

            if (detail.QtyKg != null && detail.QtyKg > 0) {
              // API mengembalikan QtyKg langsung → pakai langsung, round 2 desimal
              QtyKg = round2(detail.QtyKg);
            } else if (detail.qtyKg != null && detail.qtyKg > 0) {
              QtyKg = round2(detail.qtyKg);
            } else if (detail.qty_kg != null && detail.qty_kg > 0) {
              QtyKg = round2(detail.qty_kg);
            } else {
              // Fallback: reverse dari percentage
              // Ini yang menyebabkan 2799.9999... → kita round ke 2 desimal
              const pct = parseFloat(detail.percentage) || 0;
              QtyKg = round2((pct / 100) * baseQty);
            }

            // percentage untuk display & validasi — dihitung dari QtyKg yang sudah di-round
            const percentage = calcPct(QtyKg, baseQty);

            console.log(
              `Detail[${idx}] step=${detail.step} | ` +
                `API.percentage=${detail.percentage} | ` +
                `API.QtyKg=${
                  detail.QtyKg ?? detail.qtyKg ?? detail.qty_kg ?? "N/A"
                } | ` +
                `→ QtyKg=${QtyKg} | pct=${percentage.toFixed(4)}%`
            );

            return {
              id: detail.id || `gen-${idx}`,
              step: detail.step || "A",
              materialId: detail.materialId || "",
              percentage: percentage, // float, untuk kalkulasi total
              QtyKg: QtyKg, // float, round 2 desimal — sumber kebenaran
              notes: detail.notes || "",
            };
          });

          const totalPct = mapped.reduce((s, d) => s + d.percentage, 0);
          console.log(
            `📊 Total percentage setelah mapping: ${totalPct.toFixed(4)}%`
          );

          setBomDetails(mapped);
        } else {
          setBomDetails([
            {
              id: "1",
              step: "A",
              materialId: "",
              percentage: 0,
              QtyKg: 0,
              notes: "",
            },
          ]);
        }

        showToast("Data produk berhasil dimuat", "success");
      } else {
        showToast("Gagal memuat data produk", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    const step = prompt("Masukkan nama Step (contoh: A, B, C)");
    if (!step) return;

    setBomDetails([
      ...bomDetails,
      {
        id: Math.random().toString(36),
        step: step.toUpperCase(),
        materialId: "",
        percentage: 0,
        QtyKg: 0,
        notes: "",
      },
    ]);
  };

  const handleAddMaterialToStep = (stepId) => {
    const parentStep = bomDetails.find((b) => b.id === stepId);
    setBomDetails([
      ...bomDetails,
      {
        id: Math.random().toString(36),
        step: parentStep?.step || "A",
        materialId: "",
        percentage: 0,
        QtyKg: 0,
        notes: "",
      },
    ]);
  };

  const handleRemoveBomDetail = (id) => {
    setBomDetails(bomDetails.filter((b) => b.id !== id));
  };

  const handleBomDetailChange = (id, field, value) => {
    setBomDetails(
      bomDetails.map((b) => {
        if (b.id !== id) return b;

        const updated = { ...b, [field]: value };

        if (field === "QtyKg") {
          // QtyKg adalah sumber kebenaran → hitung percentage dari sini
          updated.percentage = calcPct(value, formData.baseQty);
        }

        return updated;
      })
    );
  };

  // ─── Total percentage: sum dari semua QtyKg / baseQty * 100 ───────────────
  // Hitung dari QtyKg (bukan percentage field) agar konsisten
  const calculateTotalPercentage = () => {
    if (!formData.baseQty || formData.baseQty <= 0) return 0;
    const totalKg = bomDetails.reduce(
      (sum, item) => sum + (Number(item.QtyKg) || 0),
      0
    );
    return (totalKg / formData.baseQty) * 100;
  };

  const calculateTotalKg = () => {
    return bomDetails.reduce((sum, item) => sum + (Number(item.QtyKg) || 0), 0);
  };

  const calculateMaterialNeeds = () => {
    const needs = {};
    bomDetails.forEach((detail) => {
      if (detail.materialId && (Number(detail.QtyKg) || 0) > 0) {
        needs[detail.materialId] =
          (needs[detail.materialId] || 0) + (Number(detail.QtyKg) || 0);
      }
    });
    return needs;
  };

  const getMaterialName = (materialId) => {
    const material = materials.find((m) => m.id === materialId);
    return material ? `${material.code} - ${material.name}` : "Unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      showToast("Kode produk harus diisi", "error");
      return;
    }
    if (!formData.name.trim()) {
      showToast("Nama produk harus diisi", "error");
      return;
    }

    const validBomDetails = bomDetails.filter(
      (b) => b.materialId && (Number(b.QtyKg) || 0) > 0
    );
    if (validBomDetails.length === 0) {
      showToast("Minimal harus ada 1 material dengan qty > 0", "error");
      return;
    }

    const totalPercentage = calculateTotalPercentage();
    if (Math.abs(totalPercentage - 100) > 0.01) {
      showToast(
        `Total persentase harus 100% (saat ini: ${totalPercentage.toFixed(
          2
        )}%)`,
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);
      showToast("Menyimpan perubahan...", "info");

      const updateData = {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        baseQty: formData.baseQty,
        bomDetails: validBomDetails.map((d) => ({
          materialId: d.materialId,
          step: d.step,
          // Kirim percentage yang dihitung dari QtyKg (bukan yang di-store)
          percentage: parseFloat(
            calcPct(d.QtyKg, formData.baseQty).toFixed(10)
          ),
          // Kirim QtyKg juga agar backend bisa simpan langsung tanpa reverse-calculate
          QtyKg: d.QtyKg,
          qtyKg: d.QtyKg,
          notes: d.notes || "",
        })),
      };

      console.log("📤 Sending update data:", updateData);

      const updateRes = await apiFetch(`/production/master/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      console.log("📥 Response status:", updateRes.status);

      if (updateRes.ok || updateRes.status === 201) {
        let responseData;
        try {
          responseData = await updateRes.json();
        } catch (e) {
          responseData = { success: true };
        }

        console.log("✅ Produk berhasil diupdate:", responseData);
        showToast("✅ Produk & BOM berhasil diupdate!", "success");

        setTimeout(() => {
          router.push("/admin/ppic/products");
        }, 2000);
      } else {
        let errorMessage = "Gagal update produk";
        try {
          const errorData = await updateRes.json();
          errorMessage =
            errorData.message || errorData.error || `Error ${updateRes.status}`;
          console.error("❌ Error details:", errorData);
        } catch (e) {
          errorMessage = `Error ${updateRes.status}: ${updateRes.statusText}`;
        }
        showToast(errorMessage, "error");
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
      showToast(
        error.message || "Gagal update produk. Silakan coba lagi.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/ppic/products");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product data...</div>
      </div>
    );
  }

  const materialNeeds = calculateMaterialNeeds();
  const totalPercentage = calculateTotalPercentage();
  const totalKg = calculateTotalKg();
  const hasBOM =
    product?.bom && product.bom.details && product.bom.details.length > 0;

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.btnSecondary}
          onClick={handleBack}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          disabled={submitting}
        >
          ← Kembali
        </button>
      </div>

      <div className={styles.header}>
        <div>
          <h1>{hasBOM ? "✏️ Edit Produk & BOM" : "➕ Tambah BOM ke Produk"}</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
            {hasBOM
              ? "Edit formula/BOM produk yang sudah ada"
              : "Produk ini belum memiliki BOM. Tambahkan formula untuk bisa dijadwalkan produksi."}
          </p>
        </div>
      </div>

      {!hasBOM && (
        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderLeft: "4px solid #f59e0b",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
            ⚠️ <strong>Produk ini belum memiliki BOM/Formula!</strong> Tambahkan
            minimal 1 material dengan total persentase 100% agar produk bisa
            dijadwalkan untuk produksi.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Product Info */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>
            📋 Informasi Produk
          </h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Kode Produk</label>
              <input
                type="text"
                value={formData.code}
                readOnly
                style={{ background: "#f5f5f5", cursor: "not-allowed" }}
              />
              <small>Kode produk tidak bisa diubah</small>
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
                disabled={submitting}
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
              >
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Base Qty (kg) - untuk perhitungan persentase</label>
              <input
                type="number"
                value={formData.baseQty}
                onChange={(e) => {
                  const newBaseQty = parseFloat(e.target.value) || 0;
                  setFormData({ ...formData, baseQty: newBaseQty });
                  // Recalculate percentage semua baris saat baseQty berubah
                  setBomDetails((prev) =>
                    prev.map((b) => ({
                      ...b,
                      percentage: calcPct(b.QtyKg, newBaseQty),
                    }))
                  );
                }}
                min="0.01"
                step="0.01"
                disabled={submitting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Deskripsi (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              placeholder="Deskripsi produk"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Section 2: BOM Formula */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>
            🧪 Formula / BOM
          </h3>

          <div
            style={{
              overflowX: "auto",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
            }}
          >
            <table className={styles.table} style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: "80px" }}>STEP</th>
                  <th style={{ minWidth: "60px" }}>NO</th>
                  <th style={{ minWidth: "200px" }}>MATERIAL</th>
                  <th style={{ minWidth: "100px" }}>QTY (%)</th>
                  <th style={{ minWidth: "150px" }}>KEBUTUHAN (kg)</th>
                  <th style={{ minWidth: "150px" }}>NOTES</th>
                  <th style={{ minWidth: "80px" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {uniqueSteps.map((step) => {
                  const stepItems = bomDetails.filter((b) => b.step === step);
                  if (stepItems.length === 0) return null;

                  return (
                    <React.Fragment key={step}>
                      {stepItems.map((detail, itemIndex) => (
                        <tr key={detail.id}>
                          {itemIndex === 0 && (
                            <td
                              rowSpan={stepItems.length + 1}
                              style={{
                                fontWeight: 700,
                                background: "#f9f9f9",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {step}
                            </td>
                          )}
                          <td style={{ textAlign: "center" }}>
                            {itemIndex + 1}
                          </td>
                          <td>
                            <select
                              value={detail.materialId}
                              onChange={(e) =>
                                handleBomDetailChange(
                                  detail.id,
                                  "materialId",
                                  e.target.value
                                )
                              }
                              style={{ width: "100%" }}
                              disabled={submitting}
                            >
                              <option value="">-- Pilih Material --</option>
                              {materials.map((material) => (
                                <option key={material.id} value={material.id}>
                                  {material.code} - {material.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* QTY % — dihitung dari QtyKg / baseQty, tampil 2 desimal */}
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formData.baseQty > 0
                              ? calcPct(
                                  Number(detail.QtyKg) || 0,
                                  formData.baseQty
                                ).toFixed(2)
                              : "0.00"}
                            %
                          </td>

                          {/* KEBUTUHAN (kg) — input utama, 2 desimal */}
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                detail.QtyKg === 0 ? "" : detail.QtyKg ?? ""
                              }
                              onChange={(e) =>
                                handleBomDetailChange(
                                  detail.id,
                                  "QtyKg",
                                  parseFloat(
                                    parseFloat(e.target.value || 0).toFixed(2)
                                  ) || 0
                                )
                              }
                              style={{ width: "100%", textAlign: "right" }}
                              disabled={submitting}
                              placeholder="0.00"
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              value={detail.notes}
                              onChange={(e) =>
                                handleBomDetailChange(
                                  detail.id,
                                  "notes",
                                  e.target.value
                                )
                              }
                              placeholder="Catatan"
                              style={{ width: "100%", fontSize: "12px" }}
                              disabled={submitting}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveBomDetail(detail.id)}
                              className={styles.btnAction}
                              style={{
                                background: "#ffe6e6",
                                color: "#cc0000",
                                padding: "4px 8px",
                                fontSize: "12px",
                              }}
                              disabled={submitting}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Baris tambah material */}
                      <tr key={`add-${step}`}>
                        <td
                          colSpan="6"
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            background: "#f0f8ff",
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleAddMaterialToStep(stepItems[0].id)
                            }
                            style={{
                              background: "#e6f3ff",
                              color: "#0066cc",
                              padding: "6px 12px",
                              fontSize: "12px",
                              border: "1px solid #0066cc",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            disabled={submitting}
                          >
                            ➕ Tambah Material ke Step {step}
                          </button>
                        </td>
                        <td></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <button
              type="button"
              onClick={handleAddStep}
              className={styles.btnSecondary}
              style={{ fontSize: "13px", padding: "8px 12px" }}
              disabled={submitting}
            >
              ➕ Tambah Step
            </button>
          </div>

          {/* Summary */}
          <div
            style={{
              padding: "15px",
              background: "#f9f9f9",
              borderRadius: "6px",
              borderLeft: `4px solid ${
                Math.abs(totalPercentage - 100) < 0.01 ? "#00aa00" : "#ff9900"
              }`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "5px",
                  }}
                >
                  Total Persentase
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color:
                      Math.abs(totalPercentage - 100) < 0.01
                        ? "#00aa00"
                        : "#ff9900",
                  }}
                >
                  {totalPercentage.toFixed(2)}%
                  {Math.abs(totalPercentage - 100) < 0.01 && " ✓"}
                </div>
                {Math.abs(totalPercentage - 100) >= 0.01 && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#ff9900",
                      marginTop: "4px",
                    }}
                  >
                    Selisih: {(100 - totalPercentage).toFixed(2)}% (
                    {round2(((100 - totalPercentage) / 100) * formData.baseQty)}{" "}
                    kg)
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "5px",
                  }}
                >
                  Total Material Dibutuhkan
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#0066cc",
                  }}
                >
                  {round2(totalKg).toFixed(2)} kg
                </div>
                <div
                  style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}
                >
                  Base Qty: {formData.baseQty.toLocaleString()} kg
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Material Breakdown */}
        {Object.keys(materialNeeds).length > 0 && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>
              📊 Kebutuhan Material Total
            </h3>

            <div
              style={{
                overflowX: "auto",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
              }}
            >
              <table className={styles.table} style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th style={{ textAlign: "right" }}>Qty (kg)</th>
                    <th style={{ textAlign: "right" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(materialNeeds)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([materialId, qty]) => (
                      <tr key={materialId}>
                        <td style={{ fontWeight: 600 }}>
                          {getMaterialName(materialId)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {round2(qty).toFixed(2)} kg
                        </td>
                        <td style={{ textAlign: "right", color: "#666" }}>
                          {formData.baseQty > 0
                            ? calcPct(qty, formData.baseQty).toFixed(2)
                            : "0.00"}
                          %
                        </td>
                      </tr>
                    ))}
                  <tr
                    style={{
                      background: "#f9f9f9",
                      fontWeight: 700,
                      borderTop: "2px solid #0066cc",
                    }}
                  >
                    <td>TOTAL</td>
                    <td style={{ textAlign: "right" }}>
                      {round2(totalKg).toFixed(2)} kg
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        color:
                          Math.abs(totalPercentage - 100) < 0.01
                            ? "#00aa00"
                            : "#ff9900",
                      }}
                    >
                      {totalPercentage.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleBack}
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={submitting}
            style={{
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "⏳ Menyimpan..." : "✅ Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
