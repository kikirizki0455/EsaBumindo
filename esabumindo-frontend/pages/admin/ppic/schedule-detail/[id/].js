import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

/**
 * Page: Production Schedule Detail
 *
 * Features:
 * - View schedule details dengan No BPM dan No Batch
 * - Material requirements dengan status warehouse confirmation
 * - Production logs timeline
 * - Edit jadwal dengan tracking perubahan
 * - Input No Lot warehouse confirmation
 */
export default function ScheduleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("materials");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [changeReason, setChangeReason] = useState("");

  useEffect(() => {
    if (id) {
      fetchPlanDetail();
    }
  }, [id]);

  const fetchPlanDetail = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/production/plans/${id}`);
      if (!res.ok) throw new Error("Gagal memuat detail jadwal");

      const data = await res.json();
      setPlan(data);
      setEditData({
        planDate: new Date(data.planDate).toISOString().split("T")[0],
        reactor: data.reactor,
        targetQty: data.targetQty,
        notes: data.notes,
      });
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!changeReason.trim()) {
      setError("Silakan masukkan alasan perubahan");
      return;
    }

    try {
      setLoading(true);
      // Implement update API call with change tracking
      // This will use trackScheduleChange method from backend
      const res = await apiFetch(`/production/plans/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...editData,
          changeReason,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan perubahan");

      setEditMode(false);
      setChangeReason("");
      await fetchPlanDetail();
      alert("Perubahan jadwal berhasil disimpan!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/ppic/schedule");
  };

  if (loading && !plan) return <div className={styles.loading}>Loading...</div>;
  if (error && !plan) return <div className={styles.error}>{error}</div>;

  const confirmedMaterialsCount =
    plan?.orderDetails.filter((od) => od.warehouseConfirmedAt).length || 0;
  const totalMaterialsCount = plan?.orderDetails.length || 0;
  const confirmationPercentage =
    totalMaterialsCount > 0
      ? Math.round((confirmedMaterialsCount / totalMaterialsCount) * 100)
      : 0;

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.btnSecondary}
          onClick={handleBack}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          ← Kembali ke Jadwal
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {plan && (
        <>
          <div className={styles.header}>
            <div>
              <h1>📊 Detail Jadwal Produksi</h1>
              <p
                style={{ margin: "5px 0 0 0", color: "#999", fontSize: "14px" }}
              >
                {plan.noBPM ? `No BPM: ${plan.noBPM}` : "Generating No BPM..."}
                {plan.noBatch && ` | No Batch: ${plan.noBatch}`}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {!editMode && (
                <button
                  className={styles.btnPrimary}
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Jadwal
                </button>
              )}
              {editMode && (
                <>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setEditMode(false)}
                  >
                    Batal
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    Simpan Perubahan
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Plan Info Header */}
          <div className={styles.planInfoHeader}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Status</span>
              <span
                style={{ fontWeight: 600, color: getStatusColor(plan.status) }}
              >
                {plan.status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Reactor</span>
              <span>{plan.reactor}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Plant</span>
              <span>{plan.plant}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Produk</span>
              <span>{plan.product?.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Target Qty</span>
              <span className={styles.highlight}>{plan.targetQty}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Material</span>
              <span>
                {confirmedMaterialsCount}/{totalMaterialsCount} (
                {confirmationPercentage}%)
              </span>
            </div>
          </div>

          {editMode && (
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#333" }}>📝 Edit Jadwal</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tanggal Rencana</label>
                  <input
                    type="date"
                    value={editData.planDate}
                    onChange={(e) =>
                      setEditData({ ...editData, planDate: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Reactor</label>
                  <select
                    value={editData.reactor}
                    onChange={(e) =>
                      setEditData({ ...editData, reactor: e.target.value })
                    }
                  >
                    <option value="A">Reactor A</option>
                    <option value="B">Reactor B</option>
                    <option value="C">Reactor C</option>
                    <option value="D">Reactor D</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Target Qty</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editData.targetQty}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        targetQty: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Catatan</label>
                  <input
                    type="text"
                    value={editData.notes || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Alasan Perubahan *</label>
                <textarea
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan alasan perubahan jadwal ini..."
                  required
                />
                <div className={styles.hint}>
                  Perubahan akan dicatat hanya jika ada material yang sudah
                  ditimbang
                </div>
              </div>
            </div>
          )}

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
                  activeTab === "materials" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("materials")}
              >
                📦 Material ({confirmedMaterialsCount}/{totalMaterialsCount})
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "logs" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("logs")}
              >
                📋 Timeline
              </button>
              {plan.scheduledChanges?.length > 0 && (
                <button
                  className={`${styles.tab} ${
                    activeTab === "changes" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("changes")}
                >
                  ⚠️ Perubahan ({plan.scheduledChanges.length})
                </button>
              )}
            </div>

            <div className={styles.tabContent}>
              {activeTab === "materials" && (
                <MaterialsTable
                  materials={plan.orderDetails || []}
                  product={plan.product}
                />
              )}

              {activeTab === "logs" && (
                <ProductionTimeline logs={plan.logs || []} />
              )}

              {activeTab === "changes" && plan.scheduledChanges && (
                <ScheduleChangesTable changes={plan.scheduledChanges} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Component: Materials Table
 */
function MaterialsTable({ materials, product }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Step</th>
            <th>Material</th>
            <th style={{ textAlign: "right" }}>Qty Dibutuhkan</th>
            <th style={{ textAlign: "right" }}>Qty Aktual</th>
            <th>No Lot</th>
            <th>Status</th>
            <th>Dikonfirmasi</th>
          </tr>
        </thead>
        <tbody>
          {materials.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.emptyState}>
                Tidak ada material
              </td>
            </tr>
          ) : (
            materials.map((material) => (
              <tr key={material.id}>
                <td style={{ fontWeight: 600, color: "#0066cc" }}>
                  Step {material.bomStep}
                </td>
                <td>{material.material?.name}</td>
                <td style={{ textAlign: "right" }}>
                  {parseFloat(material.requiredQty).toFixed(2)}{" "}
                  {material.material?.unit}
                </td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>
                  {material.actualQty
                    ? parseFloat(material.actualQty).toFixed(2)
                    : "-"}
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
                    {material.lotNumber || "-"}
                  </code>
                </td>
                <td>
                  <span
                    className={
                      material.warehouseConfirmedAt
                        ? styles.badge
                        : `${styles.badge}` + " pending"
                    }
                    style={{
                      background: material.warehouseConfirmedAt
                        ? "#e6ffe6"
                        : "#fff3e6",
                      color: material.warehouseConfirmedAt
                        ? "#00aa00"
                        : "#ff9900",
                    }}
                  >
                    {material.warehouseConfirmedAt
                      ? "✓ Confirmed"
                      : "⏳ Pending"}
                  </span>
                </td>
                <td style={{ fontSize: "12px", color: "#999" }}>
                  {material.warehouseConfirmedAt
                    ? new Date(
                        material.warehouseConfirmedAt
                      ).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Component: Production Timeline
 */
function ProductionTimeline({ logs }) {
  const getTypeColor = (type) => {
    const colors = {
      INFO: "#0066cc",
      DELAY: "#ff9900",
      QC_REJECT: "#cc0000",
      ADJUST: "#ff6600",
      MATERIAL_OUT: "#00aa00",
    };
    return colors[type] || "#666";
  };

  const getTypeIcon = (type) => {
    const icons = {
      INFO: "ℹ️",
      DELAY: "⏰",
      QC_REJECT: "❌",
      ADJUST: "⚙️",
      MATERIAL_OUT: "📦",
    };
    return icons[type] || "📌";
  };

  return (
    <div className={styles.timelineContainer}>
      {logs.length === 0 ? (
        <div className={styles.emptyState}>Tidak ada log</div>
      ) : (
        logs.map((log, idx) => (
          <div key={log.id} className={styles.timelineItem}>
            <div style={{ position: "relative", minWidth: "40px" }}>
              <div
                className={styles.timelineCircle}
                style={{ background: getTypeColor(log.type) }}
              >
                {getTypeIcon(log.type)}
              </div>
              {idx < logs.length - 1 && (
                <div className={styles.timelineLine}></div>
              )}
            </div>

            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <span className={styles.role}>{log.role}</span>
                <span
                  className={styles.type}
                  style={{ background: getTypeColor(log.type) }}
                >
                  {log.type}
                </span>
                <span className={styles.time}>
                  {new Date(log.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className={styles.message}>{log.message}</div>
              {log.metadata && (
                <div className={styles.metadata}>
                  <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/**
 * Component: Schedule Changes Table
 */
function ScheduleChangesTable({ changes }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Tipe Perubahan</th>
            <th>Dari</th>
            <th>Ke</th>
            <th>Material Timbang</th>
            <th>Alasan</th>
          </tr>
        </thead>
        <tbody>
          {changes.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.emptyState}>
                Tidak ada perubahan jadwal
              </td>
            </tr>
          ) : (
            changes.map((change) => (
              <tr key={change.id}>
                <td style={{ fontSize: "12px" }}>
                  {new Date(change.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td style={{ fontWeight: 600, color: "#ff6600" }}>
                  {change.changeType}
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
                    {change.oldValue}
                  </code>
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
                    {change.newValue}
                  </code>
                </td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>
                  <span
                    style={{
                      background:
                        (change.materialWeighedCount /
                          change.materialTotalCount) *
                          100 >
                        50
                          ? "#ffe6e6"
                          : "#e6f2ff",
                      color:
                        (change.materialWeighedCount /
                          change.materialTotalCount) *
                          100 >
                        50
                          ? "#cc0000"
                          : "#0066cc",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {change.materialWeighedCount}/{change.materialTotalCount}
                  </span>
                </td>
                <td style={{ fontSize: "12px" }}>{change.reason || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Helper function: Get status color
 */
function getStatusColor(status) {
  const colors = {
    DRAFT: "#999",
    CONFIRMED: "#0066cc",
    IN_PROGRESS: "#ff9900",
    COMPLETED: "#00aa00",
    CANCELLED: "#cc0000",
  };
  return colors[status] || "#666";
}
