import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import ProductionMaterialsTable from "./ProductionMaterialsTable";
import ProductionLogTimeline from "./ProductionLogTimeline";
import styles from "@/styles/production.module.css";

/**
 * ProductionScheduleModal: Detail modal jadwal produksi
 * Display:
 * - Production info
 * - Material table grouped by step (read-only)
 * - Production logs timeline
 * - Add new log (append only)
 */
export default function ProductionScheduleModal({ plan, onClose, onRefresh }) {
  const [fullPlan, setFullPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("materials");
  const [newLogMessage, setNewLogMessage] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  useEffect(() => {
    fetchPlanDetails();
  }, [plan.id]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/production/plans/${plan.id}`);
      const data = await res.json();
      setFullPlan(data);
    } catch (error) {
      console.error("Error fetching plan details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async () => {
    if (!newLogMessage.trim()) return;

    try {
      setSubmittingLog(true);
      const res = await apiFetch(`/production/plans/${plan.id}/logs`, {
        method: "POST",
        body: JSON.stringify({
          role: "PPIC",
          type: "INFO",
          message: newLogMessage,
        }),
      });

      if (res.ok) {
        setNewLogMessage("");
        fetchPlanDetails();
      }
    } catch (error) {
      console.error("Error adding log:", error);
    } finally {
      setSubmittingLog(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!fullPlan) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>📋 Detail Jadwal Produksi</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Plan Info Header */}
        <div className={styles.planInfoHeader}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Tanggal:</span>
            <span>
              {new Date(fullPlan.planDate).toLocaleDateString("id-ID")}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Reactor:</span>
            <span>
              <strong>{fullPlan.reactor}</strong>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Produk:</span>
            <span>{fullPlan.product?.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Target Qty:</span>
            <span>{fullPlan.targetQty}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Status:</span>
            <span
              className={styles.badge}
              style={{ backgroundColor: "#0066cc" }}
            >
              {fullPlan.status}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "materials" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("materials")}
          >
            📦 Material BON
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "logs" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("logs")}
          >
            📝 Timeline Log
          </button>
        </div>

        {/* Content */}
        <div className={styles.tabContent}>
          {activeTab === "materials" && (
            <div>
              <p className={styles.note}>
                ⓘ Material requirements auto-generated dari BOM (Read-only)
              </p>
              <ProductionMaterialsTable materials={fullPlan.orderDetails} />
            </div>
          )}

          {activeTab === "logs" && (
            <div>
              <ProductionLogTimeline logs={fullPlan.logs} />

              {/* Add new log */}
              <div className={styles.addLogSection}>
                <h4>Tambah Log Baru</h4>
                <div className={styles.addLogForm}>
                  <textarea
                    value={newLogMessage}
                    onChange={(e) => setNewLogMessage(e.target.value)}
                    placeholder="Masukkan catatan timeline..."
                    rows={3}
                  />
                  <button
                    className={styles.btnPrimary}
                    onClick={handleAddLog}
                    disabled={submittingLog || !newLogMessage.trim()}
                  >
                    {submittingLog ? "Menambah..." : "+ Tambah Log"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
