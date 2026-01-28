import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import ProductionScheduleTable from "@/components/admin/production/ProductionScheduleTable";
import styles from "@/styles/admin.module.css";

/**
 * Page: PPIC Production Schedule List
 *
 * Features:
 * - List jadwal produksi dengan status
 * - Filter by status, reactor, plant
 * - Back button navigation
 * - Link ke halaman detail
 * - Link ke create halaman terpisah (bukan modal)
 */
export default function ProductionSchedulePage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    reactor: "",
    plant: "",
  });

  useEffect(() => {
    fetchPlans();
  }, [filters]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.status) query.append("status", filters.status);
      if (filters.reactor) query.append("reactor", filters.reactor);
      if (filters.plant) query.append("plant", filters.plant);

      const res = await apiFetch(`/production/plans?${query.toString()}`);
      const data = await res.json();

      let plansArray = [];
      if (Array.isArray(data)) {
        plansArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        plansArray = data.data;
      } else if (data.plans && Array.isArray(data.plans)) {
        plansArray = data.plans;
      }

      setPlans(plansArray);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push("/admin/ppic/schedule-create");
  };

  const handleViewDetails = (planId) => {
    router.push(`/admin/ppic/schedule-detail/${planId}`);
  };

  const handleViewDashboard = () => {
    router.push("/admin/ppic/dashboard");
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          className={styles.btnSecondary}
          onClick={handleViewDashboard}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          ← Dashboard
        </button>
      </div>

      <div className={styles.header}>
        <h1>📅 Jadwal Produksi</h1>
        <button className={styles.btnPrimary} onClick={handleCreateNew}>
          ➕ Buat Jadwal Baru
        </button>
      </div>

      <div className={styles.filters}>
        <select
          value={filters.plant}
          onChange={(e) => setFilters({ ...filters, plant: e.target.value })}
        >
          <option value="">Semua Plant</option>
          <option value="P1">Plant 1</option>
          <option value="P2">Plant 2</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filters.reactor}
          onChange={(e) => setFilters({ ...filters, reactor: e.target.value })}
        >
          <option value="">Semua Reactor</option>
          <option value="A">Reactor A</option>
          <option value="B">Reactor B</option>
          <option value="C">Reactor C</option>
          <option value="D">Reactor D</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <ProductionScheduleListTable
          plans={plans}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}

/**
 * Component: Production Schedule List Table
 */
function ProductionScheduleListTable({ plans, onViewDetails }) {
  if (plans.length === 0) {
    return <div className={styles.emptyState}>Tidak ada jadwal produksi</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: "#999",
      CONFIRMED: "#0066cc",
      IN_PROGRESS: "#ff9900",
      COMPLETED: "#00aa00",
      CANCELLED: "#cc0000",
    };
    return colors[status] || "#666";
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No BPM</th>
            <th>Tanggal</th>
            <th>Produk</th>
            <th>Plant</th>
            <th>Reactor</th>
            <th>Target Qty</th>
            <th>Status</th>
            <th>Material</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const confirmedMaterials =
              plan.orderDetails?.filter((od) => od.warehouseConfirmedAt)
                .length || 0;
            const totalMaterials = plan.orderDetails?.length || 0;

            return (
              <tr key={plan.id} className={styles.tableRow}>
                <td>
                  <code
                    style={{
                      fontSize: "11px",
                      background: "#f5f5f5",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {plan.noBPM || "-"}
                  </code>
                </td>
                <td style={{ fontSize: "13px" }}>
                  {new Date(plan.planDate).toLocaleDateString("id-ID")}
                </td>
                <td style={{ fontWeight: 600 }}>{plan.product?.name}</td>
                <td style={{ textAlign: "center" }}>
                  <span style={{ fontWeight: 600, color: "#0066cc" }}>
                    {plan.plant}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>{plan.reactor}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>
                  {plan.targetQty}
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      background: getStatusColor(plan.status),
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {plan.status}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background:
                        confirmedMaterials === totalMaterials
                          ? "#e6ffe6"
                          : "#fff3e6",
                      color:
                        confirmedMaterials === totalMaterials
                          ? "#00aa00"
                          : "#ff9900",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {confirmedMaterials}/{totalMaterials}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.btnAction}
                    onClick={() => onViewDetails(plan.id)}
                  >
                    👁️ Detail
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
