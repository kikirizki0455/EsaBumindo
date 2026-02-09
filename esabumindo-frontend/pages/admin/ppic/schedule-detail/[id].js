import { useState, useEffect, useCallback } from "react";
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
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        zIndex: 9999,
        minWidth: "320px",
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
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.target.style.background = "rgba(255,255,255,0.3)")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "rgba(255,255,255,0.2)")
        }
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
 * Status Badge Component
 */
const StatusBadge = ({ status, onClick, showDropdown }) => {
  const statusConfig = {
    DRAFT: { bg: "#f3f4f6", text: "#6b7280", label: "Draft", icon: "📝" },
    CONFIRMED: {
      bg: "#dbeafe",
      text: "#1d4ed8",
      label: "Confirmed",
      icon: "✅",
    },
    IN_PROGRESS: {
      bg: "#fef3c7",
      text: "#d97706",
      label: "In Progress",
      icon: "🔄",
    },
    COMPLETED: {
      bg: "#d1fae5",
      text: "#059669",
      label: "Completed",
      icon: "🎉",
    },
    CANCELLED: {
      bg: "#fee2e2",
      text: "#dc2626",
      label: "Cancelled",
      icon: "❌",
    },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        background: config.bg,
        color: config.text,
        border: `2px solid ${config.text}`,
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
      <span style={{ marginLeft: "4px" }}>{showDropdown ? "▲" : "▼"}</span>
    </button>
  );
};

/**
 * Info Card Component
 */
const InfoCard = ({ icon, title, children, color = "#0066cc" }) => (
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
      }}
    >
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <h4
        style={{
          margin: 0,
          color: "#1f2937",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        {title}
      </h4>
    </div>
    {children}
  </div>
);

/**
 * Page: Production Schedule Detail
 */
export default function ScheduleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmForm, setConfirmForm] = useState({
    actualQty: "",
    lotNumber: "",
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const fetchScheduleDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      // Try fetch from backend
      const res = await apiFetch(`/production/plans/${id}`);

      if (res.ok) {
        const planData = await res.json();
        setPlan(planData);
        showToast("Data jadwal berhasil dimuat", "success");
      } else {
        // Fallback ke mock data jika backend gagal
        console.warn("Backend fetch failed, using mock data");
        const mockData = getMockScheduleDetail(id);
        setPlan(mockData);
        showToast("Menggunakan data demo (backend tidak tersedia)", "info");
      }
    } catch (err) {
      console.error("Error:", err);
      // Fallback ke mock data
      const mockData = getMockScheduleDetail(id);
      setPlan(mockData);
      showToast("Menggunakan data demo", "info");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchScheduleDetail();
  }, [fetchScheduleDetail]);

  const getMockScheduleDetail = (planId) => {
    return {
      id: planId,
      planDate: "2026-02-09",
      plant: "P1",
      reactor: "A",
      noBatch: "LOT-2026-001",
      noBPM: "P1.202602090",
      productId: "1",
      product: {
        id: "1",
        code: "PROD-001",
        name: "Adhesive PVAC Premium",
        type: "PVAC",
      },
      targetQty: 5400,
      status: "DRAFT",
      notes: "Jadwal produksi untuk testing",
      createdAt: new Date().toISOString(),
      createdBy: "Admin User",
      orderDetails: [
        {
          id: "od1",
          materialId: "m1",
          bomStep: "A",
          requiredQty: 1620,
          actualQty: null,
          material: { id: "m1", code: "W 01", name: "Water", unit: "kg" },
          warehouseConfirmedAt: null,
        },
        {
          id: "od2",
          materialId: "m2",
          bomStep: "B",
          requiredQty: 1080,
          actualQty: null,
          material: { id: "m2", code: "A 05", name: "Additive A", unit: "kg" },
          warehouseConfirmedAt: null,
        },
        {
          id: "od3",
          materialId: "m3",
          bomStep: "C",
          requiredQty: 540,
          actualQty: null,
          material: { id: "m3", code: "V 03 A", name: "Vinyl A", unit: "kg" },
          warehouseConfirmedAt: null,
        },
        {
          id: "od4",
          materialId: "m4",
          bomStep: "D",
          requiredQty: 810,
          actualQty: null,
          material: {
            id: "m4",
            code: "V 01 A",
            name: "Vinyl Comp A",
            unit: "kg",
          },
          warehouseConfirmedAt: null,
        },
        {
          id: "od5",
          materialId: "m5",
          bomStep: "E",
          requiredQty: 1350,
          actualQty: null,
          material: {
            id: "m5",
            code: "V 04 A",
            name: "Vinyl Comp B",
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
          message: "Rencana produksi dibuat - Target: 5400 kg, Plant: P1",
          createdAt: new Date(Date.now() - 300000).toISOString(),
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
        showToast(`Status berhasil diubah ke ${newStatus}`, "success");
      } else {
        // Fallback: update locally for demo
        setPlan({ ...plan, status: newStatus });
        showToast(`Status diupdate ke ${newStatus} (Mode Demo)`, "info");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setPlan({ ...plan, status: newStatus });
      showToast("Status diupdate secara lokal", "info");
    }

    setStatusDropdown(false);
  };

  const handleBack = () => {
    router.push("/admin/ppic/dashboard");
  };

  const openConfirmModal = (detail) => {
    setConfirmModal({
      orderDetailId: detail.id,
      material: detail.material,
      requiredQty: detail.requiredQty,
      bomStep: detail.bomStep,
    });
    setConfirmForm({
      actualQty: detail.requiredQty?.toString() || "",
      lotNumber: plan?.noBatch || "",
    });
  };

  const handleWarehouseConfirm = async () => {
    if (!confirmModal) return;

    // Validasi input
    if (!confirmForm.actualQty || parseFloat(confirmForm.actualQty) <= 0) {
      showToast("Actual Qty harus lebih besar dari 0", "error");
      return;
    }
    if (!confirmForm.lotNumber.trim()) {
      showToast("Lot Number tidak boleh kosong", "error");
      return;
    }

    try {
      setConfirmLoading(true);

      const res = await apiFetch(
        `/production/order-details/${confirmModal.orderDetailId}/warehouse-confirm`,
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
        showToast("Material berhasil dikonfirmasi!", "success");

        // Update plan data
        const updatedPlan = { ...plan };
        const detailIdx = updatedPlan.orderDetails.findIndex(
          (od) => od.id === confirmModal.orderDetailId
        );
        if (detailIdx >= 0) {
          updatedPlan.orderDetails[detailIdx] = {
            ...updatedPlan.orderDetails[detailIdx],
            ...updated,
            warehouseConfirmedAt: new Date().toISOString(),
          };
        }
        setPlan(updatedPlan);
      } else {
        // Fallback for demo mode
        const updatedPlan = { ...plan };
        const detailIdx = updatedPlan.orderDetails.findIndex(
          (od) => od.id === confirmModal.orderDetailId
        );
        if (detailIdx >= 0) {
          updatedPlan.orderDetails[detailIdx] = {
            ...updatedPlan.orderDetails[detailIdx],
            actualQty: parseFloat(confirmForm.actualQty),
            lotNumber: confirmForm.lotNumber,
            warehouseConfirmedAt: new Date().toISOString(),
          };
        }
        // Add log
        updatedPlan.logs = [
          ...(updatedPlan.logs || []),
          {
            id: `log-${Date.now()}`,
            type: "MATERIAL_OUT",
            role: "WAREHOUSE",
            message: `Material ${confirmModal.material?.name} dikonfirmasi - Qty: ${confirmForm.actualQty} ${confirmModal.material?.unit}, Lot: ${confirmForm.lotNumber}`,
            createdAt: new Date().toISOString(),
          },
        ];
        setPlan(updatedPlan);
        showToast("Material dikonfirmasi (Mode Demo)", "success");
      }

      // Reset dan tutup modal
      setConfirmModal(null);
      setConfirmForm({ actualQty: "", lotNumber: "" });
    } catch (err) {
      console.error("Error confirming material:", err);
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Calculate progress
  const getProgress = () => {
    if (!plan?.orderDetails?.length)
      return { confirmed: 0, total: 0, percent: 0 };
    const confirmed = plan.orderDetails.filter(
      (od) => od.warehouseConfirmedAt
    ).length;
    const total = plan.orderDetails.length;
    return {
      confirmed,
      total,
      percent: Math.round((confirmed / total) * 100),
    };
  };

  const progress = getProgress();

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Memuat detail jadwal...
          </p>
          <style jsx>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !plan) {
    return (
      <div className={styles.container}>
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <span
            style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}
          >
            ⚠️
          </span>
          <p
            style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}
          >
            {error || "Jadwal tidak ditemukan"}
          </p>
          <button className={styles.btnPrimary} onClick={handleBack}>
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    DRAFT: { bg: "#f3f4f6", text: "#6b7280", label: "Draft", icon: "📝" },
    CONFIRMED: {
      bg: "#dbeafe",
      text: "#1d4ed8",
      label: "Confirmed",
      icon: "✅",
    },
    IN_PROGRESS: {
      bg: "#fef3c7",
      text: "#d97706",
      label: "In Progress",
      icon: "🔄",
    },
    COMPLETED: {
      bg: "#d1fae5",
      text: "#059669",
      label: "Completed",
      icon: "🎉",
    },
    CANCELLED: {
      bg: "#fee2e2",
      text: "#dc2626",
      label: "Cancelled",
      icon: "❌",
    },
  };

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

      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.btnSecondary}
          onClick={handleBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "8px",
            transition: "all 0.2s",
          }}
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: 700 }}
            >
              📋 Detail Jadwal Produksi
            </h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <code
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                ID: {plan.id?.slice(0, 8)}...
              </code>
              {plan.noBatch && (
                <code
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  Lot: {plan.noBatch}
                </code>
              )}
              {plan.noBPM && (
                <code
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  BPM: {plan.noBPM}
                </code>
              )}
            </div>
          </div>

          {/* Status Dropdown */}
          <div style={{ position: "relative" }}>
            <StatusBadge
              status={plan.status}
              onClick={() => setStatusDropdown(!statusDropdown)}
              showDropdown={statusDropdown}
            />

            {statusDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  minWidth: "180px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  zIndex: 100,
                  marginTop: "8px",
                  overflow: "hidden",
                }}
              >
                {Object.entries(statusColors).map(([statusKey, statusData]) => (
                  <button
                    key={statusKey}
                    onClick={() => handleStatusChange(statusKey)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background:
                        plan.status === statusKey
                          ? statusData.bg
                          : "transparent",
                      textAlign: "left",
                      color: statusData.text,
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: plan.status === statusKey ? 600 : 400,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (plan.status !== statusKey) {
                        e.target.style.background = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.status !== statusKey) {
                        e.target.style.background = "transparent";
                      }
                    }}
                  >
                    <span>{statusData.icon}</span>
                    <span>{statusData.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            <span>
              Progress Material: {progress.confirmed} / {progress.total}
            </span>
            <span>{progress.percent}%</span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.3)",
              borderRadius: "8px",
              height: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress.percent}%`,
                height: "100%",
                background: progress.percent === 100 ? "#10b981" : "#fbbf24",
                borderRadius: "8px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Tab Headers */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          {[
            { key: "details", label: "Detail", icon: "📋" },
            {
              key: "materials",
              label: `Material (${plan.orderDetails?.length || 0})`,
              icon: "📦",
            },
            { key: "logs", label: "Timeline", icon: "📝" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "16px 20px",
                border: "none",
                background: activeTab === tab.key ? "white" : "transparent",
                borderBottom:
                  activeTab === tab.key
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                color: activeTab === tab.key ? "#1e40af" : "#6b7280",
                fontWeight: activeTab === tab.key ? 600 : 400,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "24px" }}>
          {/* Details Tab */}
          {activeTab === "details" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              <InfoCard icon="📅" title="Informasi Jadwal">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Tanggal Rencana
                    </span>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#1f2937",
                        marginTop: "4px",
                      }}
                    >
                      {new Date(plan.planDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                        }}
                      >
                        Plant
                      </span>
                      <div
                        style={{
                          marginTop: "4px",
                          padding: "8px 12px",
                          background: "#eff6ff",
                          borderRadius: "6px",
                          fontWeight: 600,
                          color: "#1d4ed8",
                          display: "inline-block",
                        }}
                      >
                        {plan.plant}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                        }}
                      >
                        Reactor
                      </span>
                      <div
                        style={{
                          marginTop: "4px",
                          padding: "8px 12px",
                          background: "#f0fdf4",
                          borderRadius: "6px",
                          fontWeight: 600,
                          color: "#15803d",
                          display: "inline-block",
                        }}
                      >
                        Reactor {plan.reactor}
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard icon="🏭" title="Informasi Produk">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Kode Produk
                    </span>
                    <div
                      style={{
                        marginTop: "4px",
                        fontFamily: "monospace",
                        background: "#f3f4f6",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    >
                      {plan.product?.code || "-"}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Nama Produk
                    </span>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#1f2937",
                        marginTop: "4px",
                      }}
                    >
                      {plan.product?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Tipe
                    </span>
                    <div
                      style={{
                        marginTop: "4px",
                        display: "inline-block",
                        padding: "6px 12px",
                        background: "#fef3c7",
                        color: "#b45309",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {plan.product?.type || "-"}
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard icon="🎯" title="Target Produksi">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      Target Quantity
                    </span>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "#1d4ed8",
                        marginTop: "4px",
                      }}
                    >
                      {Number(plan.targetQty).toLocaleString("id-ID")}
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#6b7280",
                          marginLeft: "8px",
                        }}
                      >
                        kg
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      padding: "12px",
                      background: "#f9fafb",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#059669",
                        }}
                      >
                        {progress.confirmed}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>
                        Material OK
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#d97706",
                        }}
                      >
                        {progress.total - progress.confirmed}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>
                        Pending
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>

              {plan.notes && (
                <InfoCard icon="📝" title="Catatan">
                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      lineHeight: "1.6",
                      fontSize: "14px",
                    }}
                  >
                    {plan.notes}
                  </p>
                </InfoCard>
              )}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div>
              {/* Summary Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    background: "#eff6ff",
                    padding: "16px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1d4ed8",
                    }}
                  >
                    {plan.orderDetails?.length || 0}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Total Material
                  </div>
                </div>
                <div
                  style={{
                    background: "#f0fdf4",
                    padding: "16px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#059669",
                    }}
                  >
                    {progress.confirmed}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Confirmed
                  </div>
                </div>
                <div
                  style={{
                    background: "#fef3c7",
                    padding: "16px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#d97706",
                    }}
                  >
                    {progress.total - progress.confirmed}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Pending
                  </div>
                </div>
              </div>

              {/* Materials Table */}
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "center",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Step
                      </th>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Kode
                      </th>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Material
                      </th>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "right",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Qty Diperlukan
                      </th>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "right",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Qty Actual
                      </th>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "center",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "14px 16px",
                          textAlign: "center",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#374151",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.orderDetails?.map((detail, idx) => {
                      const isConfirmed = detail.warehouseConfirmedAt !== null;
                      return (
                        <tr
                          key={detail.id}
                          style={{
                            background: idx % 2 === 0 ? "white" : "#fafafa",
                            transition: "background 0.2s",
                          }}
                        >
                          <td
                            style={{
                              padding: "14px 16px",
                              textAlign: "center",
                              fontWeight: 700,
                              color: "#1d4ed8",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {detail.bomStep || "-"}
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            <code
                              style={{
                                background: "#f3f4f6",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                              }}
                            >
                              {detail.material?.code || "-"}
                            </code>
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              fontWeight: 500,
                              color: "#1f2937",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {detail.material?.name || "-"}
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              textAlign: "right",
                              fontWeight: 600,
                              color: "#1f2937",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {Number(detail.requiredQty).toLocaleString("id-ID")}{" "}
                            {detail.material?.unit}
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              textAlign: "right",
                              color: isConfirmed ? "#059669" : "#9ca3af",
                              fontWeight: isConfirmed ? 600 : 400,
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {detail.actualQty
                              ? `${Number(detail.actualQty).toLocaleString(
                                  "id-ID"
                                )} ${detail.material?.unit}`
                              : "-"}
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              textAlign: "center",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                background: isConfirmed ? "#d1fae5" : "#fef3c7",
                                color: isConfirmed ? "#059669" : "#d97706",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {isConfirmed ? "✓ OK" : "⏳ Pending"}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              textAlign: "center",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {!isConfirmed && (
                              <button
                                onClick={() => openConfirmModal(detail)}
                                style={{
                                  padding: "8px 16px",
                                  background: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.background = "#2563eb")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background = "#3b82f6")
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

              {/* Info Box */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: "#eff6ff",
                  borderRadius: "8px",
                  borderLeft: "4px solid #3b82f6",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", color: "#1e40af" }}>
                  💡 <strong>Info:</strong> Konfirmasi material akan mengurangi
                  stok dari warehouse dan mencatat log aktivitas secara
                  otomatis.
                </p>
              </div>
            </div>
          )}

          {/* Timeline/Logs Tab */}
          {activeTab === "logs" && (
            <div>
              {plan.logs && plan.logs.length > 0 ? (
                <div style={{ maxWidth: "700px" }}>
                  {plan.logs.map((log, idx) => {
                    const logTypeConfig = {
                      INFO: { icon: "ℹ️", color: "#3b82f6", bg: "#eff6ff" },
                      MATERIAL_OUT: {
                        icon: "📦",
                        color: "#059669",
                        bg: "#f0fdf4",
                      },
                      ADJUST: { icon: "⚙️", color: "#d97706", bg: "#fef3c7" },
                      DELAY: { icon: "⏰", color: "#dc2626", bg: "#fef2f2" },
                      QC_REJECT: {
                        icon: "❌",
                        color: "#dc2626",
                        bg: "#fef2f2",
                      },
                    };

                    const config =
                      logTypeConfig[log.type] || logTypeConfig.INFO;

                    return (
                      <div
                        key={log.id || idx}
                        style={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "0",
                          position: "relative",
                        }}
                      >
                        {/* Timeline Line */}
                        {idx < (plan.logs?.length || 0) - 1 && (
                          <div
                            style={{
                              position: "absolute",
                              left: "23px",
                              top: "48px",
                              bottom: "-20px",
                              width: "2px",
                              background: "#e5e7eb",
                            }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            background: config.bg,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            flexShrink: 0,
                            border: `2px solid ${config.color}`,
                            zIndex: 1,
                          }}
                        >
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div
                          style={{
                            flex: 1,
                            background: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  padding: "4px 10px",
                                  background: config.bg,
                                  color: config.color,
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                }}
                              >
                                {log.type}
                              </span>
                              {log.role && (
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    background: "#f3f4f6",
                                    color: "#6b7280",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {log.role}
                                </span>
                              )}
                            </div>
                            <span
                              style={{ color: "#9ca3af", fontSize: "12px" }}
                            >
                              {new Date(log.createdAt).toLocaleString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              color: "#374151",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                          >
                            {log.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#9ca3af",
                  }}
                >
                  <span
                    style={{
                      fontSize: "48px",
                      display: "block",
                      marginBottom: "16px",
                    }}
                  >
                    📭
                  </span>
                  <p style={{ fontSize: "16px", margin: 0 }}>
                    Belum ada aktivitas tercatat
                  </p>
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
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => !confirmLoading && setConfirmModal(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "0",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                padding: "20px 24px",
                color: "white",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                📦 Konfirmasi Material Warehouse
              </h2>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              {/* Material Info */}
              <div
                style={{
                  background: "#f9fafb",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "11px",
                        textTransform: "uppercase",
                      }}
                    >
                      Step {confirmModal.bomStep}
                    </span>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#1f2937",
                      }}
                    >
                      {confirmModal.material?.name}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Kode
                      </span>
                      <div
                        style={{
                          fontFamily: "monospace",
                          background: "white",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        {confirmModal.material?.code}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Qty Diperlukan
                      </span>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#1d4ed8",
                          marginTop: "4px",
                        }}
                      >
                        {Number(confirmModal.requiredQty).toLocaleString(
                          "id-ID"
                        )}{" "}
                        {confirmModal.material?.unit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#374151",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Actual Quantity ({confirmModal.material?.unit}){" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={confirmForm.actualQty}
                    onChange={(e) =>
                      setConfirmForm({
                        ...confirmForm,
                        actualQty: e.target.value,
                      })
                    }
                    placeholder={`Masukkan qty aktual dalam ${confirmModal.material?.unit}`}
                    disabled={confirmLoading}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#374151",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Lot Number <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={confirmForm.lotNumber}
                    onChange={(e) =>
                      setConfirmForm({
                        ...confirmForm,
                        lotNumber: e.target.value,
                      })
                    }
                    placeholder="Masukkan lot number (misal: LOT-2026-001)"
                    disabled={confirmLoading}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                background: "#f9fafb",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setConfirmModal(null)}
                disabled={confirmLoading}
                style={{
                  padding: "10px 20px",
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: confirmLoading ? "not-allowed" : "pointer",
                  opacity: confirmLoading ? 0.6 : 1,
                }}
              >
                Batal
              </button>
              <button
                onClick={handleWarehouseConfirm}
                disabled={confirmLoading}
                style={{
                  padding: "10px 24px",
                  background: confirmLoading ? "#9ca3af" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: confirmLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {confirmLoading ? (
                  <>
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Processing...
                  </>
                ) : (
                  <>✓ Konfirmasi</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
