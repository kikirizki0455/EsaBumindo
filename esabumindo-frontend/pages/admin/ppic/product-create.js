import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

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

/**
 * Page: Create Product with BOM/Formula
 */
export default function ProductCreatePage() {
  const router = useRouter();
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
  ];

  const steps = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "PVAC",
    description: "",
    baseQty: 5400,
  });

  const [bomDetails, setBomDetails] = useState([
    {
      id: "1",
      step: "A",
      materialId: "",
      percentage: 0,
      notes: "",
    },
  ]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
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
        showToast("Material berhasil dimuat", "success");
      } else {
        setMaterials(getDummyMaterials());
        showToast("Menggunakan data dummy material", "info");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      setMaterials(getDummyMaterials());
      showToast("Error loading materials, using dummy data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getDummyMaterials = () => [
    { id: "m1", code: "W 01", name: "Water", unit: "kg" },
    { id: "m2", code: "A 05", name: "Additive A", unit: "kg" },
    { id: "m3", code: "V 03 A", name: "Vinyl A", unit: "kg" },
    { id: "m4", code: "V 01 A", name: "Vinyl Comp A", unit: "kg" },
    { id: "m5", code: "V 04 A", name: "Vinyl Comp B", unit: "kg" },
    { id: "m6", code: "S 11", name: "Styrene", unit: "kg" },
    { id: "m7", code: "B 02", name: "Binder", unit: "kg" },
    { id: "m8", code: "K 03", name: "Catalyzer", unit: "kg" },
    { id: "m9", code: "M 17", name: "Monomer", unit: "kg" },
    { id: "m10", code: "T 03", name: "Thinner A", unit: "liter" },
    { id: "m11", code: "T 01", name: "Thinner B", unit: "liter" },
    { id: "m12", code: "BP 13", name: "Pigment", unit: "kg" },
    { id: "m13", code: "A 15", name: "Additive B", unit: "kg" },
    { id: "m14", code: "P 02", name: "Polymer", unit: "kg" },
  ];

  const handleAddStep = () => {
    const newId = Math.random().toString(36);
    const nextStep =
      steps[
        Math.min(
          steps.indexOf(bomDetails[bomDetails.length - 1].step) + 1,
          steps.length - 1
        )
      ];

    setBomDetails([
      ...bomDetails,
      {
        id: newId,
        step: nextStep,
        materialId: "",
        percentage: 0,
        notes: "",
      },
    ]);
  };

  const handleAddMaterialToStep = (stepId) => {
    const newId = Math.random().toString(36);
    setBomDetails([
      ...bomDetails,
      {
        id: newId,
        step: bomDetails.find((b) => b.id === stepId).step,
        materialId: "",
        percentage: 0,
        notes: "",
        parentId: stepId,
      },
    ]);
  };

  const handleRemoveBomDetail = (id) => {
    setBomDetails(bomDetails.filter((b) => b.id !== id));
  };

  const handleBomDetailChange = (id, field, value) => {
    setBomDetails(
      bomDetails.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const calculateTotalPercentage = () => {
    return bomDetails.reduce(
      (sum, detail) => sum + parseFloat(detail.percentage || 0),
      0
    );
  };

  const calculateMaterialNeeds = () => {
    const needs = {};
    bomDetails.forEach((detail) => {
      if (detail.materialId && detail.percentage > 0) {
        const needed = (formData.baseQty * detail.percentage) / 100;
        needs[detail.materialId] = (needs[detail.materialId] || 0) + needed;
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

    // Validation
    if (!formData.code.trim()) {
      showToast("Kode produk harus diisi", "error");
      return;
    }
    if (!formData.name.trim()) {
      showToast("Nama produk harus diisi", "error");
      return;
    }

    const validBomDetails = bomDetails.filter(
      (b) => b.materialId && b.percentage > 0
    );
    if (validBomDetails.length === 0) {
      showToast("Minimal harus ada 1 material dengan persentase > 0", "error");
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
      showToast("Menyimpan produk...", "info");

      // Prepare product data dengan BOM details
      const productData = {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        baseQty: formData.baseQty,
        bomDetails: validBomDetails.map((d) => ({
          materialId: d.materialId,
          step: d.step,
          percentage: parseFloat(d.percentage),
          notes: d.notes || "",
        })),
      };

      console.log("📤 Sending product data:", productData);

      // Send to API
      const createRes = await apiFetch("/production/master/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      console.log("📥 Response status:", createRes.status);

      // Handle response - PERBAIKAN DI SINI
      if (createRes.ok || createRes.status === 201) {
        let responseData;
        try {
          responseData = await createRes.json();
        } catch (e) {
          console.log("No JSON response, but status is OK");
          responseData = { success: true };
        }

        console.log("✅ Produk berhasil dibuat:", responseData);
        showToast("✅ Produk berhasil dibuat! Mengalihkan...", "success");

        setTimeout(() => {
          router.push("/admin/ppic/products");
        }, 2000);
      } else {
        // Parse error response
        let errorMessage = "Gagal membuat produk";
        try {
          const errorData = await createRes.json();
          errorMessage =
            errorData.message ||
            errorData.error ||
            `Error ${createRes.status}` ||
            errorMessage;
          console.error("❌ Error details:", errorData);
        } catch (e) {
          console.warn("Could not parse error response");
          errorMessage = `Error ${createRes.status}: ${createRes.statusText}`;
        }
        showToast(errorMessage, "error");
      }
    } catch (error) {
      console.error("❌ Error creating product:", error);
      showToast(
        error.message || "Gagal membuat produk. Silakan coba lagi.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/ppic/products");
  };

  if (loading)
    return (
      <div className={styles.loading}>
        <div>Loading materials...</div>
      </div>
    );

  const materialNeeds = calculateMaterialNeeds();
  const totalPercentage = calculateTotalPercentage();

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
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
        <h1>➕ Buat Produk Baru dengan Formula</h1>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
          Sistem akan menyimpan formula/BOM untuk perhitungan kebutuhan material
          saat produksi
        </p>
      </div>

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
              <label>Kode Produk *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="PROD-001"
                required
                disabled={submitting}
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
                placeholder="Nama produk"
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
                required
                disabled={submitting}
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    baseQty: parseFloat(e.target.value) || 0,
                  })
                }
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
                  <th style={{ minWidth: "120px" }}>NO</th>
                  <th style={{ minWidth: "200px" }}>MATERIAL</th>
                  <th style={{ minWidth: "120px" }}>QTY (%)</th>
                  <th style={{ minWidth: "150px" }}>KEBUTUHAN (kg)</th>
                  <th style={{ minWidth: "200px" }}>NOTES</th>
                  <th style={{ minWidth: "100px" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => {
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
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              max="100"
                              value={detail.percentage}
                              onChange={(e) =>
                                handleBomDetailChange(
                                  detail.id,
                                  "percentage",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              style={{ width: "100%", textAlign: "right" }}
                              disabled={submitting}
                            />
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 600 }}>
                            {detail.materialId && detail.percentage > 0
                              ? (
                                  (formData.baseQty * detail.percentage) /
                                  100
                                ).toFixed(2)
                              : "-"}
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
                            className={styles.btnAction}
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

          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
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
              borderLeft: "4px solid #0066cc",
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
                </div>
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
                  {Object.values(materialNeeds)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2)}{" "}
                  kg
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
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(materialNeeds)
                    .sort()
                    .map(([materialId, qty]) => (
                      <tr key={materialId}>
                        <td style={{ fontWeight: 600 }}>
                          {getMaterialName(materialId)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {qty.toFixed(2)} kg
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
                      {Object.values(materialNeeds)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)}{" "}
                      kg
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
            {submitting ? "⏳ Menyimpan..." : "✅ Buat Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
