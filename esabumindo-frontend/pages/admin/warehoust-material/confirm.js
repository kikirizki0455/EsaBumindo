import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import WarehouseMaterialConfirmModal from "@/components/admin/warehouse/WarehouseMaterialConfirmModal";
import styles from "@/styles/production.module.css";

/**
 * Page: Warehouse Material Confirmation
 *
 * Features:
 * - View pending material requirements from production plans
 * - Confirm material with lot number and actual quantity
 * - Validate stock availability
 * - Deduct stock after confirmation
 * - Create stock movements OUT
 * - Add production log with type MATERIAL_OUT
 */
export default function WarehouseConfirmPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [filters, setFilters] = useState({
    status: "CONFIRMED",
  });

  useEffect(() => {
    fetchPlans();
  }, [filters]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.status) query.append("status", filters.status);

      const res = await apiFetch(`/production/plans?${query.toString()}`);
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSuccess = () => {
    setSelectedOrderDetail(null);
    fetchPlans();
  };

  const getPendingMaterials = () => {
    const pending = [];
    plans.forEach((plan) => {
      if (plan.orderDetails) {
        plan.orderDetails.forEach((detail) => {
          if (!detail.warehouseConfirmedAt) {
            pending.push({
              ...detail,
              planId: plan.id,
              planDate: plan.planDate,
              reactor: plan.reactor,
              product: plan.product,
            });
          }
        });
      }
    });
    return pending;
  };

  const pendingMaterials = getPendingMaterials();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📦 Konfirmasi Material Warehouse</h1>
      </div>

      <div className={styles.filters}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="CONFIRMED">Confirmed Plans</option>
          <option value="IN_PROGRESS">In Progress Plans</option>
          <option value="">All Status</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Reactor</th>
                <th>Produk</th>
                <th>Material</th>
                <th>Required Qty</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingMaterials.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    Tidak ada material pending untuk dikonfirmasi
                  </td>
                </tr>
              ) : (
                pendingMaterials.map((material) => (
                  <tr key={material.id} className={styles.tableRow}>
                    <td>
                      {new Date(material.planDate).toLocaleDateString("id-ID")}
                    </td>
                    <td>
                      <strong>Reactor {material.reactor}</strong>
                    </td>
                    <td>{material.product?.name}</td>
                    <td>
                      <strong>{material.material?.name}</strong>
                      <br />
                      <small>{material.material?.code}</small>
                    </td>
                    <td className={styles.right}>
                      {parseFloat(material.requiredQty).toFixed(2)}
                    </td>
                    <td>{material.material?.unit}</td>
                    <td>
                      <span className={styles.status + " " + styles.pending}>
                        ⏳ Pending
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.btnAction}
                        onClick={() => setSelectedOrderDetail(material)}
                      >
                        ✓ Confirm
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrderDetail && (
        <WarehouseMaterialConfirmModal
          orderDetail={selectedOrderDetail}
          onClose={() => setSelectedOrderDetail(null)}
          onSuccess={handleConfirmSuccess}
        />
      )}
    </div>
  );
}
