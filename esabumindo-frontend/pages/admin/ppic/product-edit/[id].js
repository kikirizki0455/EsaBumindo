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

/**
 * Page: Edit Product with BOM/Formula
 */
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
  ];

  const steps = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

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

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch materials
      const materialsRes = await apiFetch("/production/master/materials");
      if (materialsRes.ok) {
        const data = await materialsRes.json();
        let materialsArray = Array.isArray(data)
          ? data
          : data.data || data.materials || [];
        setMaterials(materialsArray);
      } else {
        setMaterials(getDummyMaterials());
      }

      // Fetch product detail
      const productRes = await apiFetch(`/production/bom/${id}`);
      if (productRes.ok) {
        const productData = await productRes.json();
        setProduct(productData);

        // Populate form
        setFormData({
          code: productData.code || "",
          name: productData.name || "",
          type: productData.type || "PVAC",
          description: productData.description || "",
          baseQty: productData.baseQty || 5400,
        });

        // Populate BOM details if exists
        if (
          productData.bom &&
          productData.bom.details &&
          productData.bom.details.length > 0
        ) {
          setBomDetails(
            productData.bom.details.map((detail, idx) => ({
              id: detail.id || `${idx}`,
              step: detail.step || "A",
              materialId: detail.materialId || "",
              percentage: parseFloat(detail.percentage) || 0,
              notes: detail.notes || "",
            }))
          );
        } else {
          // No BOM, start with empty
          setBomDetails([
            {
              id: "1",
              step: "A",
              materialId: "",
              percentage: 0,
              notes: "",
            },
          ]);
        }

        showToast("Data produk berhasil dimuat", "success");
      } else {
        showToast("Gagal memuat data produk", "error");
        // Use dummy
        const dummyProduct = {
          id: id,
          code: "EB - 5502",
          name: "EB - 5502",
          type: "PVAC",
          description: "",
          baseQty: 5400,
          bom: null,
        };
        setProduct(dummyProduct);
        setFormData({
          code: dummyProduct.code,
          name: dummyProduct.name,
          type: dummyProduct.type,
          description: dummyProduct.description || "",
          baseQty: dummyProduct.baseQty || 5400,
        });
        setBomDetails([
          { id: "1", step: "A", materialId: "", percentage: 0, notes: "" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Error loading data", "error");
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
  ];

  const handleAddStep = () => {
    const newId = Math.random().toString(36);
    const usedSteps = bomDetails.map((b) => b.step);
    const nextStep = steps.find((s) => !usedSteps.includes(s)) || "A";

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
    const parentStep = bomDetails.find((b) => b.id === stepId);
    setBomDetails([
      ...bomDetails,
      {
        id: newId,
        step: parentStep?.step || "A",
        materialId: "",
        percentage: 0,
        notes: "",
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
      showToast("Menyimpan perubahan...", "info");

      const updateData = {
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

      console.log("📤 Sending update data:", updateData);

      const updateRes = await apiFetch(`/production/master/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (updateRes.ok) {
        const responseData = await updateRes.json();
        console.log("✅ Produk berhasil diupdate:", responseData);
        showToast("✅ Produk & BOM berhasil diupdate!", "success");

        setTimeout(() => {
          router.push("/admin/ppic/products");
        }, 2000);
      } else {
        let errorMessage = "Gagal update produk";
        try {
          const errorData = await updateRes.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        showToast(errorMessage, "error");
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
      showToast(error.message || "Gagal update produk", "error");
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
  const hasBOM =
    product?.bom && product.bom.details && product.bom.details.length > 0;

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

      {/* Alert for product without BOM */}
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
              <label>Base Qty (kg)</label>
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
            <label>Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
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
                  <th style={{ minWidth: "120px" }}>KEBUTUHAN (kg)</th>
                  <th style={{ minWidth: "150px" }}>NOTES</th>
                  <th style={{ minWidth: "80px" }}>AKSI</th>
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
                              style={{ width: "100%", fontSize: "12px" }}
                              disabled={submitting}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveBomDetail(detail.id)}
                              style={{
                                background: "#ffe6e6",
                                color: "#cc0000",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
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
              ➕ Tambah Step Baru
            </button>
          </div>

          {/* Summary */}
          <div
            style={{
              padding: "15px",
              background:
                Math.abs(totalPercentage - 100) < 0.01 ? "#f0fff4" : "#fffbeb",
              borderRadius: "6px",
              borderLeft: `4px solid ${
                Math.abs(totalPercentage - 100) < 0.01 ? "#10b981" : "#f59e0b"
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
                        ? "#10b981"
                        : "#f59e0b",
                  }}
                >
                  {totalPercentage.toFixed(2)}%
                  {Math.abs(totalPercentage - 100) < 0.01 && " ✓"}
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
                  Total Material
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

        {/* Material Breakdown */}
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

            <div style={{ overflowX: "auto" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th style={{ textAlign: "right" }}>Qty (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(materialNeeds).map(([materialId, qty]) => (
                    <tr key={materialId}>
                      <td style={{ fontWeight: 600 }}>
                        {getMaterialName(materialId)}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {qty.toFixed(2)} kg
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#f9f9f9", fontWeight: 700 }}>
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
            disabled={submitting || Math.abs(totalPercentage - 100) > 0.01}
            style={{
              opacity:
                submitting || Math.abs(totalPercentage - 100) > 0.01 ? 0.6 : 1,
            }}
          >
            {submitting ? "⏳ Menyimpan..." : "✅ Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
