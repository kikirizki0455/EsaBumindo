import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/admin.module.css";

/**
 * Page: Warehouse Dashboard
 *
 * Features:
 * - Overview grafik material confirmation rate
 * - Stock status per material
 * - Production orders yang perlu dikonfirmasi
 * - Material weight statistics
 * - Warehouse activity timeline
 */
export default function WarehouseDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPlans: 0,
    confirmedMaterials: 0,
    pendingMaterials: 0,
    confirmationRate: 0,
    lowStockMaterials: [],
    recentActivities: [],
    dailyConfirmations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    plant: "P1",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

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

      const res = await apiFetch(`/production/warehouse/dashboard?${query}`);
      if (!res.ok) throw new Error("Gagal memuat data dashboard");

      const data = await res.json();
      setStats(data);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    router.push("/admin/warehouse/confirm");
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
        <h1>📊 Warehouse Dashboard</h1>
        <button className={styles.btnPrimary} onClick={handleViewDetails}>
          📋 Konfirmasi Material
        </button>
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
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <KPICard
          title="Total Jadwal"
          value={stats.totalPlans}
          subtitle="Bulan ini"
          icon="📅"
          color="#0066cc"
        />
        <KPICard
          title="Material Terkonfirmasi"
          value={stats.confirmedMaterials}
          subtitle="Total dikonfirmasi"
          icon="✓"
          color="#00aa00"
        />
        <KPICard
          title="Material Pending"
          value={stats.pendingMaterials}
          subtitle="Menunggu konfirmasi"
          icon="⏳"
          color="#ff9900"
        />
        <KPICard
          title="Confirmation Rate"
          value={`${stats.confirmationRate}%`}
          subtitle="Tingkat konfirmasi"
          icon="📈"
          color={stats.confirmationRate > 80 ? "#00aa00" : "#ff9900"}
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Confirmation Rate Chart */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            📊 Tingkat Konfirmasi Harian
          </h3>
          <div style={{ height: "250px", position: "relative" }}>
            <SimpleBarChart data={stats.dailyConfirmations} />
          </div>
        </div>

        {/* Low Stock Materials */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            ⚠️ Material Stok Rendah
          </h3>
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {stats.lowStockMaterials.length === 0 ? (
              <p style={{ color: "#999", margin: 0 }}>
                Semua stok material normal
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {stats.lowStockMaterials.map((material, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px",
                      background: "#fff3e6",
                      borderRadius: "4px",
                      borderLeft: "4px solid #ff9900",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "13px",
                      }}
                    >
                      {material.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      Stok: {material.quantity} / Min: {material.minStock}{" "}
                      {material.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
          🕐 Aktivitas Terbaru
        </h3>
        <div className={styles.timelineContainer}>
          {stats.recentActivities.length === 0 ? (
            <div className={styles.emptyState}>Tidak ada aktivitas</div>
          ) : (
            stats.recentActivities.slice(0, 10).map((activity, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 0",
                  borderBottom: idx < 9 ? "1px solid #eee" : "none",
                  fontSize: "13px",
                }}
              >
                <div style={{ fontWeight: 600, color: "#0066cc" }}>
                  {activity.material}
                </div>
                <div style={{ color: "#666", marginTop: "4px" }}>
                  {activity.message}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "4px",
                  }}
                >
                  {new Date(activity.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Component: KPI Card
 */
function KPICard({ title, value, subtitle, icon, color }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderTop: `4px solid ${color}`,
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
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: color,
              lineHeight: 1,
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            {subtitle}
          </div>
        </div>
        <div style={{ fontSize: "36px" }}>{icon}</div>
      </div>
    </div>
  );
}

/**
 * Component: Simple Bar Chart (menggunakan div dan background)
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
              height: `${(item.value / maxValue) * 200}px`,
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
