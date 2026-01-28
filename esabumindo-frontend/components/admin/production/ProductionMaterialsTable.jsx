import { useState, useMemo } from "react";
import styles from "@/styles/production.module.css";

/**
 * ProductionMaterialsTable: Tabel material requirements grouped by step
 * - Menampilkan warehouse stock availability
 * - Auto-generated dari BOM
 * - Warehouse confirmation status
 * - Material batch tracking
 */
export default function ProductionMaterialsTable({
  materials = [],
  warehouseStock = {},
}) {
  const [expandedSteps, setExpandedSteps] = useState(new Set());

  // Group materials by step
  const groupedByStep = useMemo(() => {
    return materials.reduce((acc, material) => {
      if (!acc[material.bomStep]) {
        acc[material.bomStep] = [];
      }
      acc[material.bomStep].push(material);
      return acc;
    }, {});
  }, [materials]);

  const steps = useMemo(
    () => Object.keys(groupedByStep).sort((a, b) => parseInt(a) - parseInt(b)),
    [groupedByStep]
  );

  const toggleStep = (step) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(step)) {
      newExpanded.delete(step);
    } else {
      newExpanded.add(step);
    }
    setExpandedSteps(newExpanded);
  };

  const getWarehouseStock = (materialCode) => {
    return warehouseStock[materialCode] || null;
  };

  const getAvailabilityStatus = (material) => {
    const stock = getWarehouseStock(material.material?.code);
    const required = parseFloat(material.requiredQty);

    if (!stock) {
      return {
        status: "UNKNOWN",
        icon: "❓",
        color: "#999",
        label: "Stock Unknown",
      };
    }

    const available = parseFloat(stock.availableQty || 0);
    const reserved = parseFloat(stock.reservedQty || 0);
    const free = available - reserved;

    if (free >= required) {
      return {
        status: "AVAILABLE",
        icon: "✅",
        color: "#00cc66",
        label: "Available",
        available,
        required,
        free,
        reserved,
      };
    } else if (free > 0) {
      return {
        status: "PARTIAL",
        icon: "⚠️",
        color: "#ff9900",
        label: "Partial",
        available,
        required,
        free,
        reserved,
      };
    } else {
      return {
        status: "UNAVAILABLE",
        icon: "❌",
        color: "#cc0000",
        label: "Unavailable",
        available,
        required,
        free,
        reserved,
      };
    }
  };

  const getConfirmationStatus = (material) => {
    if (material.warehouseConfirmedAt) {
      return { icon: "✓", label: "Confirmed", color: "#00cc66" };
    } else if (material.warehousePendingAt) {
      return { icon: "⏳", label: "Pending", color: "#ff9900" };
    } else {
      return { icon: "—", label: "Not Requested", color: "#999" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalStats = (stepMaterials) => {
    return {
      requiredCount: stepMaterials.length,
      confirmedCount: stepMaterials.filter((m) => m.warehouseConfirmedAt)
        .length,
      availableCount: stepMaterials.filter(
        (m) => getAvailabilityStatus(m).status === "AVAILABLE"
      ).length,
    };
  };

  return (
    <div className={styles.materialsContainer}>
      {steps.length === 0 ? (
        <div className={styles.emptyState}>Tidak ada material requirements</div>
      ) : (
        steps.map((step) => {
          const stepMaterials = groupedByStep[step];
          const stats = getTotalStats(stepMaterials);
          const isExpanded = expandedSteps.has(step);

          return (
            <div key={step} className={styles.stepSection}>
              <div
                className={styles.stepHeader}
                onClick={() => toggleStep(step)}
                style={{ cursor: "pointer" }}
              >
                <button className={styles.expandBtn}>
                  {isExpanded ? "▼" : "▶"} Step {step}
                </button>
                <div className={styles.stepStats}>
                  <span className={styles.statBadge}>
                    📦 {stats.requiredCount} items
                  </span>
                  <span
                    className={styles.statBadge}
                    style={{ color: "#00cc66" }}
                  >
                    ✅ {stats.confirmedCount} confirmed
                  </span>
                  <span
                    className={styles.statBadge}
                    style={{ color: "#0066cc" }}
                  >
                    📊 {stats.availableCount} available
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.stepContent}>
                  <table className={styles.stepTable}>
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Unit</th>
                        <th>📋 Required</th>
                        <th>📦 Warehouse Stock</th>
                        <th>📊 Availability</th>
                        <th>📝 Lot Number</th>
                        <th>✓ Warehouse Confirmation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stepMaterials.map((material) => {
                        const availStatus = getAvailabilityStatus(material);
                        const confirmStatus = getConfirmationStatus(material);
                        const stock = getWarehouseStock(
                          material.material?.code
                        );

                        return (
                          <tr key={material.id} className={styles.materialRow}>
                            <td>
                              <strong>{material.material?.name}</strong>
                              <br />
                              <small className={styles.materialCode}>
                                {material.material?.code}
                              </small>
                            </td>
                            <td className={styles.center}>
                              {material.material?.unit}
                            </td>
                            <td className={styles.right}>
                              <strong>
                                {parseFloat(material.requiredQty).toFixed(2)}
                              </strong>
                            </td>
                            <td className={styles.stockCell}>
                              {stock ? (
                                <div className={styles.stockDetails}>
                                  <div className={styles.stockLine}>
                                    <span className={styles.label}>
                                      Available:
                                    </span>
                                    <span className={styles.value}>
                                      {parseFloat(
                                        stock.availableQty || 0
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                  {stock.reservedQty > 0 && (
                                    <div className={styles.stockLine}>
                                      <span className={styles.label}>
                                        Reserved:
                                      </span>
                                      <span
                                        className={styles.value}
                                        style={{ color: "#ff9900" }}
                                      >
                                        -
                                        {parseFloat(stock.reservedQty).toFixed(
                                          2
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  <div className={styles.stockLine}>
                                    <span className={styles.label}>Free:</span>
                                    <span
                                      className={styles.value}
                                      style={{ color: "#0066cc" }}
                                    >
                                      {parseFloat(
                                        (stock.availableQty || 0) -
                                          (stock.reservedQty || 0)
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className={styles.noStock}>No data</span>
                              )}
                            </td>
                            <td className={styles.statusCell}>
                              <span
                                className={styles.availabilityBadge}
                                style={{ backgroundColor: availStatus.color }}
                                title={availStatus.label}
                              >
                                {availStatus.icon} {availStatus.label}
                              </span>
                              {availStatus.status === "PARTIAL" && (
                                <small className={styles.availabilityNote}>
                                  Need{" "}
                                  {(
                                    availStatus.required - availStatus.free
                                  ).toFixed(2)}{" "}
                                  more
                                </small>
                              )}
                            </td>
                            <td className={styles.center}>
                              {material.lotNumber ? (
                                <span className={styles.lotBadge}>
                                  {material.lotNumber}
                                </span>
                              ) : (
                                <span className={styles.notAssigned}>-</span>
                              )}
                            </td>
                            <td className={styles.confirmationCell}>
                              <div className={styles.confirmationStatus}>
                                <span
                                  className={styles.confirmBadge}
                                  style={{
                                    backgroundColor: confirmStatus.color,
                                  }}
                                >
                                  {confirmStatus.icon} {confirmStatus.label}
                                </span>
                                {material.warehouseConfirmedAt && (
                                  <small className={styles.confirmDate}>
                                    {formatDate(material.warehouseConfirmedAt)}
                                  </small>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
