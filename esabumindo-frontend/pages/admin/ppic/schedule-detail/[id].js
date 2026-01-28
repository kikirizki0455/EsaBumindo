import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

/**
 * Page: Production Schedule Detail
 *
 * Features:
 * - Display production plan details
 * - Show material requirements
 * - Timeline/logs
 * - Update status
 * - Mock data support for development
 */
export default function ScheduleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // null atau { orderDetailId, material, requiredQty }
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmForm, setConfirmForm] = useState({
    actualQty: "",
    lotNumber: "",
  });

  useEffect(() => {
    if (id) {
      fetchScheduleDetail();
    }
  }, [id]);

  const fetchScheduleDetail = async () => {
    try {
      setLoading(true);

      // Try fetch from backend
      let planData = null;
      try {
        const res = await apiFetch(`/production/plans/${id}`);
        if (res.ok) {
          planData = await res.json();
        }
      } catch (backendError) {
        console.warn("Backend fetch failed, using mock data:", backendError);
      }

      // Fallback ke mock data jika backend gagal
      if (!planData) {
        planData = getMockScheduleDetail(id);
      }

      setPlan(planData);
    } catch (error) {
      console.error("Error:", error);
      setError("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  };

  const getMockScheduleDetail = (planId) => {
    return {
      id: planId,
      planDate: "2026-01-26",
      plant: "P1",
      reactor: "A",
      productId: "1",
      product: {
        id: "1",
        code: "PROD-001",
        name: "Adhesive PVAC Premium",
        type: "PVAC",
      },
      targetQty: 100,
      status: "DRAFT",
      notes: "Jadwal produksi awal untuk testing",
      createdAt: new Date().toISOString(),
      createdBy: "Admin User",
      orderDetails: [
        {
          id: "od1",
          materialId: "m1",
          bomStep: 1,
          requiredQty: 30,
          actualQty: null,
          material: {
            id: "m1",
            code: "MAT-001",
            name: "Resin Dasar",
            unit: "kg",
          },
          warehouseConfirmedAt: null,
        },
        {
          id: "od2",
          materialId: "m2",
          bomStep: 2,
          requiredQty: 20,
          actualQty: null,
          material: {
            id: "m2",
            code: "MAT-002",
            name: "Hardener A",
            unit: "kg",
          },
          warehouseConfirmedAt: null,
        },
        {
          id: "od3",
          materialId: "m3",
          bomStep: 3,
          requiredQty: 10,
          actualQty: null,
          material: {
            id: "m3",
            code: "MAT-003",
            name: "Pigment Merah",
            unit: "kg",
          },
          warehouseConfirmedAt: null,
        },
        {
          id: "od4",
          materialId: "m4",
          bomStep: 4,
          requiredQty: 15,
          actualQty: null,
          material: {
            id: "m4",
            code: "MAT-004",
            name: "Solvent X",
            unit: "liter",
          },
          warehouseConfirmedAt: null,
        },
        {
          id: "od5",
          materialId: "m5",
          bomStep: 5,
          requiredQty: 25,
          actualQty: null,
          material: {
            id: "m5",
            code: "MAT-005",
            name: "Filler Powder",
            unit: "kg",
          },
          warehouseConfirmedAt: null,
        },
      ],
      logs: [
        {
          id: "log1",
          type: "INFO",
          role: "PPIC",
          message: "Rencana produksi dibuat - Target: 100 unit",
          createdAt: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        },
      ],
    };
  };

  const handleStatusChange = async (newStatus) => {
    if (!plan) return;

    try {
      const updateRes = await apiFetch(`/production/plans/${plan.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (updateRes.ok) {
        const updated = await updateRes.json();
        setPlan(updated);
        alert("✅ Status berhasil diupdate");
      } else {
        // Fallback: update locally
        setPlan({ ...plan, status: newStatus });
        alert("✅ Status diupdate (Development Mode)");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Fallback update
      setPlan({ ...plan, status: newStatus });
    }

    setStatusDropdown(false);
  };

  const handleBack = () => {
    router.push("/admin/ppic/dashboard");
  };

  const handleWarehouseConfirm = async () => {
    if (!confirmModal) return;

    try {
      setConfirmLoading(true);

      // Validasi input
      if (!confirmForm.actualQty || confirmForm.actualQty <= 0) {
        alert("⚠️ Actual Qty harus lebih besar dari 0");
        return;
      }
      if (!confirmForm.lotNumber.trim()) {
        alert("⚠️ Lot Number tidak boleh kosong");
        return;
      }

      // Call API warehouse confirm
      const res = await apiFetch(
        `/order-details/${confirmModal.orderDetailId}/warehouse-confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actualQty: parseFloat(confirmForm.actualQty),
            lotNumber: confirmForm.lotNumber.trim(),
          }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        alert("✅ Material berhasil dikonfirmasi!");

        // Update plan data
        const updatedPlan = { ...plan };
        const detailIdx = updatedPlan.orderDetails.findIndex(
          (od) => od.id === confirmModal.orderDetailId
        );
        if (detailIdx >= 0) {
          updatedPlan.orderDetails[detailIdx] = updated;
        }
        setPlan(updatedPlan);

        // Reset form dan close modal
        setConfirmModal(null);
        setConfirmForm({ actualQty: "", lotNumber: "" });
      } else {
        const errorData = await res.json();
        alert(
          `❌ Error: ${errorData.message || "Gagal mengkonfirmasi material"}`
        );
      }
    } catch (error) {
      console.error("Error confirming material:", error);
      alert("❌ Terjadi kesalahan saat mengkonfirmasi material");
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading)
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading schedule details...</div>
      </div>
    );

  if (error || !plan)
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || "Jadwal tidak ditemukan"}</div>
        <button
          className={styles.btnSecondary}
          onClick={handleBack}
          style={{ marginTop: "20px" }}
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    );

  const statusColors = {
    DRAFT: { bg: "#f0f0f0", text: "#666", label: "Draft" },
    CONFIRMED: { bg: "#e6f2ff", text: "#0066cc", label: "Confirmed" },
    IN_PROGRESS: { bg: "#fff3e6", text: "#ff6600", label: "In Progress" },
    COMPLETED: { bg: "#e6ffe6", text: "#00aa00", label: "Completed" },
    CANCELLED: { bg: "#ffe6e6", text: "#cc0000", label: "Cancelled" },
  };

  const currentStatus = statusColors[plan.status] || statusColors.DRAFT;

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
        <div>
          <h1>📋 Detail Jadwal Produksi</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
            ID: <code>{plan.id}</code>
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <button
            className={styles.btnPrimary}
            onClick={() => setStatusDropdown(!statusDropdown)}
            style={{
              background: currentStatus.bg,
              color: currentStatus.text,
              border: `2px solid ${currentStatus.text}`,
            }}
          >
            {currentStatus.label} ▼
          </button>
          {statusDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                minWidth: "150px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
                marginTop: "5px",
              }}
            >
              {Object.entries(statusColors).map(([statusKey, statusData]) => (
                <button
                  key={statusKey}
                  onClick={() => handleStatusChange(statusKey)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 15px",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    color: statusData.text,
                    cursor: "pointer",
                    fontSize: "14px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#f9f9f9")}
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  {statusData.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "details" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            📋 Details
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "materials" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("materials")}
          >
            📦 Materials ({plan.orderDetails?.length || 0})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "logs" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("logs")}
          >
            📝 Timeline
          </button>
        </div>

        <div className={styles.tabContent}>
          {/* Details Tab */}
          {activeTab === "details" && (
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Card 1: Basic Info */}
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
                    📅 Informasi Jadwal
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Tanggal Rencana
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {new Date(plan.planDate).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Plant
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {plan.plant}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Reactor
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        Reactor {plan.reactor}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Product Info */}
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
                    🏭 Informasi Produk
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Kode
                      </span>
                      <div
                        style={{
                          fontSize: "14px",
                          fontFamily: "monospace",
                          background: "#fff",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          marginTop: "4px",
                        }}
                      >
                        {plan.product?.code}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Nama
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {plan.product?.name}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Tipe
                      </span>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          background: "#e6f2ff",
                          color: "#0066cc",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          marginTop: "4px",
                        }}
                      >
                        {plan.product?.type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Production Target */}
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
                    🎯 Target Produksi
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Target Quantity
                      </span>
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 700,
                          color: "#0066cc",
                        }}
                      >
                        {plan.targetQty}
                        <span style={{ fontSize: "14px", color: "#666" }}>
                          {" "}
                          unit
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Total Material
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {plan.orderDetails?.length || 0} items
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Notes */}
                {plan.notes && (
                  <div
                    style={{
                      background: "#f9f9f9",
                      padding: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
                      📝 Catatan
                    </h4>
                    <p style={{ margin: 0, color: "#666", lineHeight: "1.5" }}>
                      {plan.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div style={{ padding: "20px" }}>
              <div style={{ overflowX: "auto" }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kode Material</th>
                      <th>Nama Material</th>
                      <th style={{ textAlign: "right" }}>Qty Diperlukan</th>
                      <th style={{ textAlign: "right" }}>Qty Actual</th>
                      <th>Unit</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.orderDetails?.map((detail, idx) => {
                      const isConfirmed = detail.warehouseConfirmedAt !== null;
                      return (
                        <tr key={detail.id} className={styles.tableRow}>
                          <td style={{ textAlign: "center", color: "#666" }}>
                            {idx + 1}
                          </td>
                          <td>
                            <code
                              style={{
                                fontSize: "12px",
                                background: "#f5f5f5",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              {detail.material?.code}
                            </code>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {detail.material?.name}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 600 }}>
                            {detail.requiredQty}
                          </td>
                          <td style={{ textAlign: "right", color: "#666" }}>
                            {detail.actualQty || "-"}
                          </td>
                          <td style={{ textAlign: "center", color: "#666" }}>
                            {detail.material?.unit}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "4px",
                                background: isConfirmed ? "#e6ffe6" : "#fff3e6",
                                color: isConfirmed ? "#00aa00" : "#ff6600",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {isConfirmed ? "✓ Confirmed" : "⏳ Pending"}
                            </span>
                          </td>
                          <td>
                            {!isConfirmed && (
                              <button
                                className={styles.btnSecondary}
                                onClick={() =>
                                  setConfirmModal({
                                    orderDetailId: detail.id,
                                    material: detail.material,
                                    requiredQty: detail.requiredQty,
                                  })
                                }
                              >
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timeline/Logs Tab */}
          {activeTab === "logs" && (
            <div style={{ padding: "20px" }}>
              {plan.logs && plan.logs.length > 0 ? (
                <div style={{ maxWidth: "600px" }}>
                  {plan.logs.map((log, idx) => (
                    <div
                      key={log.id || idx}
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                        borderBottom:
                          idx < (plan.logs?.length || 0) - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "#0066cc",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {log.type === "INFO"
                          ? "ℹ️"
                          : log.type === "MATERIAL_OUT"
                          ? "📦"
                          : log.type === "ADJUST"
                          ? "⚙️"
                          : "📝"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#333",
                            marginBottom: "4px",
                          }}
                        >
                          {log.type}
                        </div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: "14px",
                            marginBottom: "8px",
                          }}
                        >
                          {log.message}
                        </div>
                        <div style={{ color: "#999", fontSize: "12px" }}>
                          {new Date(log.createdAt).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    color: "#999",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  Belum ada aktivitas
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setConfirmModal(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>
              📦 Konfirmasi Warehouse
            </h2>

            <div
              style={{
                background: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <span style={{ color: "#666", fontSize: "12px" }}>
                  Material
                </span>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  {confirmModal.material?.name}
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ color: "#666", fontSize: "12px" }}>Kode</span>
                <div
                  style={{
                    fontSize: "14px",
                    fontFamily: "monospace",
                    background: "#fff",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    marginTop: "4px",
                  }}
                >
                  {confirmModal.material?.code}
                </div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: "12px" }}>
                  Qty Diperlukan
                </span>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  {confirmModal.requiredQty} {confirmModal.material?.unit}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  color: "#333",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Actual Quantity <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={confirmForm.actualQty}
                onChange={(e) =>
                  setConfirmForm({ ...confirmForm, actualQty: e.target.value })
                }
                placeholder="Masukkan qty aktual"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#333",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Lot Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                value={confirmForm.lotNumber}
                onChange={(e) =>
                  setConfirmForm({ ...confirmForm, lotNumber: e.target.value })
                }
                placeholder="Masukkan lot number (misal: LOT-2026-001)"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                className={styles.btnSecondary}
                onClick={() => setConfirmModal(null)}
                disabled={confirmLoading}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleWarehouseConfirm}
                disabled={confirmLoading}
                style={{
                  opacity: confirmLoading ? 0.6 : 1,
                  cursor: confirmLoading ? "not-allowed" : "pointer",
                }}
              >
                {confirmLoading ? "Processing..." : "✓ Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
