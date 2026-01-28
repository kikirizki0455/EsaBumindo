import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

/**
 * Page: PPIC Dashboard
 *
 * Features:
 * - Overview schedule changes tracking
 * - Monthly report perubahan jadwal
 * - Breakdown by change type (DATE, QUANTITY, REACTOR, PRODUCT, NOTES)
 * - Impact analysis (berapa material sudah ditimbang saat perubahan)
 * - Production schedule status summary
 */
export default function PPICDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSchedules: 0,
    draftSchedules: 0,
    confirmedSchedules: 0,
    inProgressSchedules: 0,
    completedSchedules: 0,
    totalChanges: 0,
    affectedPlans: 0,
    changesSummary: {
      DATE: 0,
      QUANTITY: 0,
      REACTOR: 0,
      PRODUCT: 0,
      NOTES: 0,
    },
    scheduleChanges: [],
    statusDistribution: [],
    weeklyScheduleData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    plant: "P1",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        plant: filter.plant,
        month: filter.month,
        year: filter.year,
      });

      const res = await apiFetch(`/production/ppic/dashboard?${query}`);
      
      // Gunakan dummy data jika endpoint belum ready
      if (!res.ok) {
        console.warn("Using dummy data for dashboard");
        setStats(getDummyDashboardData());
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
      // Fallback ke dummy data
      setStats(getDummyDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const getDummyDashboardData = () => ({
    totalSchedules: 5,
    draftSchedules: 2,
    confirmedSchedules: 2,
    inProgressSchedules: 1,
    completedSchedules: 0,
    totalChanges: 2,
    affectedPlans: 1,
    changesSummary: {
      DATE: 1,
      QUANTITY: 1,
      REACTOR: 0,
      PRODUCT: 0,
      NOTES: 0,
    },
    scheduleChanges: [],
    weeklyScheduleData: [
      { label: "Sen", value: 1 },
      { label: "Sel", value: 2 },
      { label: "Rab", value: 1 },
      { label: "Kam", value: 0 },
      { label: "Jum", value: 1 },
      { label: "Sab", value: 0 },
      { label: "Min", value: 0 },
    ],
  });

  const handleCreateSchedule = () => {
    router.push("/admin/ppic/schedule-create");
  };

  const handleViewSchedules = () => {
    router.push("/admin/ppic/schedule");
  };

  const handleManageProducts = () => {
    router.push("/admin/ppic/products");
  };

  const handleManageMaterials = () => {
    router.push("/admin/ppic/materials");
  };

  if (loading)
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading dashboard...</div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📈 PPIC Dashboard</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className={styles.btnSecondary} onClick={handleManageProducts}>
            📦 Produk
          </button>
          <button className={styles.btnSecondary} onClick={handleManageMaterials}>
            🧪 Bahan Baku
          </button>
          <button className={styles.btnSecondary} onClick={handleViewSchedules}>
            📅 Lihat Jadwal
          </button>
          <button className={styles.btnPrimary} onClick={handleCreateSchedule}>
            ➕ Buat Jadwal Baru
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={filter.plant}
          onChange={(e) => setFilter({ ...filter, plant: e.target.value })}
        >
          <option value="P1">Plant 1</option>
          <option value="P2">Plant 2</option>
        </select>

        <select
          value={filter.month}
          onChange={(e) =>
            setFilter({ ...filter, month: parseInt(e.target.value) })
          }
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(filter.year, m - 1).toLocaleDateString("id-ID", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={filter.year}
          onChange={(e) =>
            setFilter({ ...filter, year: parseInt(e.target.value) })
          }
        >
          {Array.from(
            { length: 5 },
            (_, i) => new Date().getFullYear() - i
          ).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <KPICard
          title="Total Jadwal"
          value={stats.totalSchedules}
          icon="📅"
          color="#0066cc"
        />
        <KPICard
          title="Draft"
          value={stats.draftSchedules}
          icon="📝"
          color="#999"
        />
        <KPICard
          title="Confirmed"
          value={stats.confirmedSchedules}
          icon="✓"
          color="#0066cc"
        />
        <KPICard
          title="In Progress"
          value={stats.inProgressSchedules}
          icon="⏳"
          color="#ff9900"
        />
        <KPICard
          title="Completed"
          value={stats.completedSchedules}
          icon="✓✓"
          color="#00aa00"
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "changes" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("changes")}
          >
            ⚠️ Tracking Perubahan ({stats.totalChanges})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "analysis" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("analysis")}
          >
            📈 Analisis
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "overview" && <OverviewTab stats={stats} />}

          {activeTab === "changes" && (
            <ChangesTab changes={stats.scheduleChanges} />
          )}

          {activeTab === "analysis" && (
            <AnalysisTab
              changesSummary={stats.changesSummary}
              scheduleChanges={stats.scheduleChanges}
              affectedPlans={stats.affectedPlans}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Component: Overview Tab
 */
function OverviewTab({ stats }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Schedule Status Distribution */}
        <div
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
            📊 Distribusi Status Jadwal
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <StatusBar
              label="Draft"
              value={stats.draftSchedules}
              total={stats.totalSchedules}
              color="#999"
            />
            <StatusBar
              label="Confirmed"
              value={stats.confirmedSchedules}
              total={stats.totalSchedules}
              color="#0066cc"
            />
            <StatusBar
              label="In Progress"
              value={stats.inProgressSchedules}
              total={stats.totalSchedules}
              color="#ff9900"
            />
            <StatusBar
              label="Completed"
              value={stats.completedSchedules}
              total={stats.totalSchedules}
              color="#00aa00"
            />
          </div>
        </div>

        {/* Schedule Changes Summary */}
        <div
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
            ⚠️ Ringkasan Perubahan
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Total Perubahan Tercatat:</span>
              <span style={{ fontWeight: 600, color: "#0066cc" }}>
                {stats.totalChanges}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Jadwal Terpengaruh:</span>
              <span style={{ fontWeight: 600, color: "#ff6600" }}>
                {stats.affectedPlans}
              </span>
            </div>
            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "8px",
                marginTop: "8px",
              }}
            >
              <div
                style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}
              >
                Catatan: Perubahan dicatat hanya jika ada material yang sudah
                ditimbang
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Chart */}
      <div
        style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
          📈 Jadwal Mingguan
        </h4>
        <div style={{ height: "250px" }}>
          <SimpleBarChart data={stats.weeklyScheduleData} />
        </div>
      </div>
    </div>
  );
}

/**
 * Component: Changes Tab
 */
function ChangesTab({ changes }) {
  return (
    <div style={{ overflowX: "auto" }}>
      {changes.length === 0 ? (
        <div className={styles.emptyState}>
          Tidak ada perubahan jadwal pada periode ini
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Produk</th>
              <th>Tipe Perubahan</th>
              <th>Dari → Ke</th>
              <th>Material Ditimbang</th>
              <th>Impact</th>
              <th>Alasan</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => {
              const impactPercent = Math.round(
                (change.materialWeighedCount / change.materialTotalCount) * 100
              );
              const isHighImpact = impactPercent > 50;

              return (
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
                  <td style={{ fontWeight: 600 }}>
                    {change.productionPlan?.product?.name || "N/A"}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        background: "#fff3e6",
                        color: "#ff6600",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {change.changeType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "12px" }}>
                      <code
                        style={{ background: "#f5f5f5", padding: "2px 6px" }}
                      >
                        {change.oldValue}
                      </code>
                      {" → "}
                      <code
                        style={{ background: "#f5f5f5", padding: "2px 6px" }}
                      >
                        {change.newValue}
                      </code>
                    </div>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {change.materialWeighedCount}/{change.materialTotalCount}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        background: isHighImpact ? "#ffe6e6" : "#e6f2ff",
                        color: isHighImpact ? "#cc0000" : "#0066cc",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {impactPercent}%{isHighImpact && " ⚠️"}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", maxWidth: "200px" }}>
                    {change.reason ? (
                      <span title={change.reason}>
                        {change.reason.substring(0, 30)}
                        {change.reason.length > 30 ? "..." : ""}
                      </span>
                    ) : (
                      <span style={{ color: "#999" }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/**
 * Component: Analysis Tab
 */
function AnalysisTab({ changesSummary, scheduleChanges, affectedPlans }) {
  const totalChanges = Object.values(changesSummary).reduce((a, b) => a + b, 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "20px",
      }}
    >
      {/* Change Type Distribution */}
      <div
        style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
          📊 Distribusi Tipe Perubahan
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.entries(changesSummary).map(([type, count]) => {
            const percentage =
              totalChanges > 0 ? Math.round((count / totalChanges) * 100) : 0;
            return (
              <div key={type}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#666", fontWeight: 600 }}>
                    {getChangeTypeLabel(type)}
                  </span>
                  <span style={{ color: "#0066cc", fontWeight: 600 }}>
                    {count} ({percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    background: "#e6f2ff",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: getChangeTypeColor(type),
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Impact Changes */}
      <div
        style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
          ⚠️ Perubahan Berdampak Tinggi ({affectedPlans})
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {scheduleChanges
            .filter(
              (c) => (c.materialWeighedCount / c.materialTotalCount) * 100 > 50
            )
            .slice(0, 10)
            .map((change) => (
              <div
                key={change.id}
                style={{
                  padding: "10px",
                  background: "#ffe6e6",
                  borderLeft: "3px solid #cc0000",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}
                >
                  {change.productionPlan?.product?.name}
                </div>
                <div
                  style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}
                >
                  {change.changeType}: {change.oldValue} → {change.newValue}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#cc0000",
                    marginTop: "4px",
                  }}
                >
                  ⚠️{" "}
                  {Math.round(
                    (change.materialWeighedCount / change.materialTotalCount) *
                      100
                  )}
                  % material sudah ditimbang
                </div>
              </div>
            ))}
          {scheduleChanges.filter(
            (c) => (c.materialWeighedCount / c.materialTotalCount) * 100 > 50
          ).length === 0 && (
            <p style={{ color: "#999", margin: 0, fontSize: "13px" }}>
              Tidak ada perubahan berdampak tinggi
            </p>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          gridColumn: "1 / -1",
        }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>💡 Insights</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          <InsightCard
            title="Tipe Perubahan Terbanyak"
            value={
              Object.entries(changesSummary).length > 0
                ? Object.entries(changesSummary).reduce((a, b) =>
                    b[1] > a[1] ? b : a
                  )[0]
                : "N/A"
            }
            icon="📌"
          />
          <InsightCard
            title="Total Jadwal Terpengaruh"
            value={affectedPlans}
            icon="⚠️"
          />
          <InsightCard
            title="Rata-rata Impact Per Perubahan"
            value={
              scheduleChanges.length > 0
                ? Math.round(
                    (scheduleChanges.reduce(
                      (sum, c) =>
                        sum +
                        (c.materialWeighedCount / c.materialTotalCount) * 100,
                      0
                    ) /
                      scheduleChanges.length) *
                      100
                  ) / 100
                : 0
            }
            unit="%"
            icon="📊"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Component: KPI Card
 */
function KPICard({ title, value, icon, color }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderTop: `4px solid ${color}`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: color }}>
        {value}
      </div>
      <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
        {title}
      </div>
    </div>
  );
}

/**
 * Component: Status Bar
 */
function StatusBar({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
          fontSize: "13px",
        }}
      >
        <span style={{ color: "#666" }}>{label}</span>
        <span style={{ fontWeight: 600, color: color }}>
          {value} ({percentage}%)
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#eee",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Component: Simple Bar Chart
 */
function SimpleBarChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ color: "#999" }}>Data tidak tersedia</div>;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
        height: "100%",
      }}
    >
      {data.map((item, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${(item.value / maxValue) * 180}px`,
              background: "#0066cc",
              borderRadius: "4px 4px 0 0",
            }}
            title={`${item.label}: ${item.value}`}
          />
          <div style={{ fontSize: "11px", color: "#666", textAlign: "center" }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Component: Insight Card
 */
function InsightCard({ title, value, unit, icon }) {
  return (
    <div
      style={{
        padding: "15px",
        background: "white",
        borderRadius: "6px",
        border: "1px solid #eee",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
            {title}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#0066cc" }}>
            {value}
            {unit && <span style={{ fontSize: "16px" }}>{unit}</span>}
          </div>
        </div>
        <div style={{ fontSize: "24px" }}>{icon}</div>
      </div>
    </div>
  );
}

/**
 * Helper: Get change type label
 */
function getChangeTypeLabel(type) {
  const labels = {
    DATE: "Perubahan Tanggal",
    QUANTITY: "Perubahan Qty",
    REACTOR: "Perubahan Reactor",
    PRODUCT: "Perubahan Produk",
    NOTES: "Perubahan Catatan",
  };
  return labels[type] || type;
}

/**
 * Helper: Get change type color
 */
function getChangeTypeColor(type) {
  const colors = {
    DATE: "#0066cc",
    QUANTITY: "#ff6600",
    REACTOR: "#ff9900",
    PRODUCT: "#cc0000",
    NOTES: "#00aa00",
  };
  return colors[type] || "#999";
}
