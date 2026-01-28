import { useState, useMemo } from "react";
import styles from "@/styles/production.module.css";

/**
 * ProductionScheduleTable: Tabel list production plans dengan filtering & sorting
 * - Status filtering (Draft, Confirmed, In Progress, Completed, Cancelled)
 * - Reactor filtering
 * - Date range filtering
 * - Sort by date, status, atau reactor
 */
export default function ProductionScheduleTable({
  plans = [],
  onViewDetails,
  onEdit,
  onDelete,
}) {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterReactor, setFilterReactor] = useState("");
  const [sortBy, setSortBy] = useState("planDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get unique reactors dari plans
  const reactors = useMemo(
    () => [...new Set(plans.map((p) => p.reactor))].sort(),
    [plans]
  );

  // Filter dan sort plans
  const filteredPlans = useMemo(() => {
    let result = [...plans];

    // Filter by status
    if (filterStatus) {
      result = result.filter((p) => p.status === filterStatus);
    }

    // Filter by reactor
    if (filterReactor) {
      result = result.filter((p) => p.reactor === filterReactor);
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "planDate":
          aVal = new Date(a.planDate).getTime();
          bVal = new Date(b.planDate).getTime();
          break;
        case "reactor":
          aVal = a.reactor;
          bVal = b.reactor;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "product":
          aVal = a.product?.name || "";
          bVal = b.product?.name || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return result;
  }, [plans, filterStatus, filterReactor, sortBy, sortOrder]);

  const getStatusBadge = (status) => {
    const statusMap = {
      DRAFT: { icon: "📝", color: "#999", label: "Draft" },
      CONFIRMED: { icon: "✅", color: "#0066cc", label: "Confirmed" },
      IN_PROGRESS: { icon: "⚙️", color: "#ff9900", label: "In Progress" },
      COMPLETED: { icon: "✔️", color: "#00cc66", label: "Completed" },
      CANCELLED: { icon: "❌", color: "#cc0000", label: "Cancelled" },
    };
    const statusInfo = statusMap[status] || {
      icon: "❓",
      color: "#999",
      label: status,
    };
    return (
      <span
        className={styles.badge}
        style={{ backgroundColor: statusInfo.color }}
        title={statusInfo.label}
      >
        {statusInfo.icon} {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIndicator = (field) => {
    if (sortBy !== field) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className={styles.scheduleTableContainer}>
      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">-- Semua --</option>
            <option value="DRAFT">📝 Draft</option>
            <option value="CONFIRMED">✅ Confirmed</option>
            <option value="IN_PROGRESS">⚙️ In Progress</option>
            <option value="COMPLETED">✔️ Completed</option>
            <option value="CANCELLED">❌ Cancelled</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Reactor:</label>
          <select
            value={filterReactor}
            onChange={(e) => setFilterReactor(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">-- Semua --</option>
            {reactors.map((reactor) => (
              <option key={reactor} value={reactor}>
                Reactor {reactor}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.resultCount}>
            {filteredPlans.length} dari {plans.length} jadwal
          </span>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <button
                  className={styles.sortBtn}
                  onClick={() => toggleSort("planDate")}
                  title="Urutkan berdasarkan tanggal"
                >
                  📅 Tanggal {getSortIndicator("planDate")}
                </button>
              </th>
              <th>
                <button
                  className={styles.sortBtn}
                  onClick={() => toggleSort("reactor")}
                  title="Urutkan berdasarkan reactor"
                >
                  ⚗️ Reactor {getSortIndicator("reactor")}
                </button>
              </th>
              <th>
                <button
                  className={styles.sortBtn}
                  onClick={() => toggleSort("product")}
                  title="Urutkan berdasarkan produk"
                >
                  📦 Produk {getSortIndicator("product")}
                </button>
              </th>
              <th>📏 Target Qty</th>
              <th>
                <button
                  className={styles.sortBtn}
                  onClick={() => toggleSort("status")}
                  title="Urutkan berdasarkan status"
                >
                  📊 Status {getSortIndicator("status")}
                </button>
              </th>
              <th>⚡ Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyState}>
                  {plans.length === 0
                    ? "Tidak ada jadwal produksi"
                    : "Tidak ada jadwal sesuai filter"}
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr key={plan.id} className={styles.tableRow}>
                  <td className={styles.dateCell}>
                    <strong>{formatDate(plan.planDate)}</strong>
                    {plan.createdAt && (
                      <small className={styles.createdInfo}>
                        Dibuat: {formatDateTime(plan.createdAt)}
                      </small>
                    )}
                  </td>
                  <td className={styles.reactorCell}>
                    <strong>🔬 Reactor {plan.reactor}</strong>
                  </td>
                  <td className={styles.productCell}>
                    <div className={styles.productInfo}>
                      <strong>{plan.product?.name}</strong>
                      <small>{plan.product?.code}</small>
                    </div>
                  </td>
                  <td className={styles.quantityCell}>
                    <span className={styles.quantity}>
                      {plan.targetQty} kg
                    </span>
                  </td>
                  <td className={styles.statusCell}>
                    {getStatusBadge(plan.status)}
                  </td>
                  <td className={styles.actionCell}>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.btnAction} ${styles.btnView}`}
                        onClick={() => onViewDetails(plan)}
                        title="Lihat detail"
                      >
                        👁️
                      </button>
                      {plan.status === "DRAFT" && onEdit && (
                        <button
                          className={`${styles.btnAction} ${styles.btnEdit}`}
                          onClick={() => onEdit(plan)}
                          title="Edit jadwal"
                        >
                          ✏️
                        </button>
                      )}
                      {plan.status === "DRAFT" && onDelete && (
                        <button
                          className={`${styles.btnAction} ${styles.btnDelete}`}
                          onClick={() => {
                            if (
                              confirm(
                                "Yakin ingin menghapus jadwal ini?"
                              )
                            ) {
                              onDelete(plan.id);
                            }
                          }}
                          title="Hapus jadwal"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {filteredPlans.length > 0 && (
        <div className={styles.tableFooter}>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Qty:</span>
              <span className={styles.statValue}>
                {filteredPlans
                  .reduce((sum, p) => sum + (p.targetQty || 0), 0)
                  .toFixed(2)}{" "}
                kg
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Reactors:</span>
              <span className={styles.statValue}>
                {[...new Set(filteredPlans.map((p) => p.reactor))].length}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Statuses:</span>
              <span className={styles.statValue}>
                {
                  [...new Set(filteredPlans.map((p) => p.status))].length
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
