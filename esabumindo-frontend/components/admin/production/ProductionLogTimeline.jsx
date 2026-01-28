import styles from "@/styles/production.module.css";

/**
 * ProductionLogTimeline: Timeline view untuk production logs
 * Immutable - append only
 */
export default function ProductionLogTimeline({ logs }) {
  const getRoleIcon = (role) => {
    const icons = {
      PPIC: "📋",
      WAREHOUSE: "📦",
      QC: "✔️",
      PRODUCTION: "🏭",
    };
    return icons[role] || "📝";
  };

  const getTypeColor = (type) => {
    const colors = {
      INFO: "#0066cc",
      DELAY: "#ff9900",
      QC_REJECT: "#cc0000",
      ADJUST: "#6600cc",
      MATERIAL_OUT: "#00aa00",
    };
    return colors[type] || "#999999";
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.timelineContainer}>
      {logs.length === 0 ? (
        <div className={styles.emptyState}>Belum ada log timeline</div>
      ) : (
        <div className={styles.timeline}>
          {logs.map((log, index) => (
            <div key={log.id} className={styles.timelineItem}>
              <div className={styles.timelineMarker}>
                <div
                  className={styles.timelineCircle}
                  style={{ backgroundColor: getTypeColor(log.type) }}
                >
                  {getRoleIcon(log.role)}
                </div>
                {index < logs.length - 1 && (
                  <div className={styles.timelineLine} />
                )}
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <span className={styles.role}>{log.role}</span>
                  <span
                    className={styles.type}
                    style={{ backgroundColor: getTypeColor(log.type) }}
                  >
                    {log.type}
                  </span>
                  <span className={styles.time}>
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
                <p className={styles.message}>{log.message}</p>
                {log.metadata && (
                  <div className={styles.metadata}>
                    <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
