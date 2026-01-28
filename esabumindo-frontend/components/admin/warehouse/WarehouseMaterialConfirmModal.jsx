import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import styles from "@/styles/production.module.css";

/**
 * WarehouseMaterialConfirmModal: Modal untuk warehouse confirm material
 * - Input: lot number, actual quantity
 * - Shows: available stock, tolerance limits
 * - Validates & deducts stock on submit
 */
export default function WarehouseMaterialConfirmModal({
  orderDetail,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    lotNumber: "",
    actualQty: orderDetail?.requiredQty || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stock, setStock] = useState(null);

  useEffect(() => {
    // In production, you would fetch available stock here
    // For now, we'll just display placeholder
    setStock({
      available: 100, // This should come from backend
      unit: orderDetail?.material?.unit || "pcs",
    });
  }, [orderDetail]);

  const requiredQty = parseFloat(orderDetail?.requiredQty || 0);
  const minTolerance = requiredQty * 0.8; // 80% of required
  const maxTolerance = requiredQty * 1.2; // 120% of required
  const actualQty = parseFloat(formData.actualQty || 0);
  const isWithinTolerance =
    actualQty >= minTolerance && actualQty <= maxTolerance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.lotNumber.trim()) {
      setError("Lot number harus diisi");
      return;
    }

    if (actualQty <= 0) {
      setError("Actual quantity harus lebih dari 0");
      return;
    }

    if (!isWithinTolerance) {
      setError(
        `Actual quantity harus antara ${minTolerance.toFixed(
          2
        )} - ${maxTolerance.toFixed(2)} ${stock?.unit}`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch(
        `/production/order-details/${orderDetail.id}/warehouse-confirm`,
        {
          method: "POST",
          body: JSON.stringify({
            lotNumber: formData.lotNumber,
            actualQty: actualQty,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to confirm material");
      }

      onSuccess();
    } catch (error) {
      setError(error.message);
      console.error("Error confirming material:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!orderDetail) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>✓ Konfirmasi Material</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.form}>
          {/* Info Section */}
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Material:</span>
              <span>
                <strong>{orderDetail.material?.name}</strong>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Kode:</span>
              <span>{orderDetail.material?.code}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Unit:</span>
              <span>{orderDetail.material?.unit}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Required Quantity Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Required Qty:</span>
              <span className={styles.highlight}>{requiredQty.toFixed(2)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Tolerance Range:</span>
              <span>
                {minTolerance.toFixed(2)} - {maxTolerance.toFixed(2)}
              </span>
            </div>
            {stock && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Available Stock:</span>
                <span className={styles.highlight}>{stock.available}</span>
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {error && <div className={styles.error}>{error}</div>}

          {/* Form Inputs */}
          <div className={styles.formGroup}>
            <label>Lot Number *</label>
            <div className={styles.inputWithHint}>
              <input
                type="text"
                value={formData.lotNumber}
                onChange={(e) =>
                  setFormData({ ...formData, lotNumber: e.target.value })
                }
                placeholder="Contoh: LOT-2024-001"
                required
              />
              <span className={styles.hint}>
                Format: LOT-YYYY-NNN (harus unik)
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Actual Quantity *</label>
            <div className={styles.inputWithHint}>
              <input
                type="number"
                step="0.01"
                value={formData.actualQty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    actualQty: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
              <span className={styles.hint}>
                {isWithinTolerance ? (
                  <span style={{ color: "#00aa00" }}>
                    ✓ Dalam range toleransi
                  </span>
                ) : actualQty > 0 ? (
                  <span style={{ color: "#cc0000" }}>
                    ✗ Diluar range toleransi
                  </span>
                ) : (
                  <span>
                    Masukkan nilai antara {minTolerance.toFixed(2)} -{" "}
                    {maxTolerance.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Tolerance Info Box */}
          <div
            style={{
              padding: "10px 15px",
              background: "#f0f7ff",
              border: "1px solid #0066cc",
              borderRadius: "6px",
              fontSize: "13px",
              marginTop: "15px",
            }}
          >
            <strong>ℹ️ Informasi Toleransi:</strong>
            <p style={{ margin: "5px 0 0 0" }}>
              Sistem mengizinkan perbedaan ±20% dari quantity yang diperlukan.
              Masukkan actual quantity sesuai dengan material fisik yang
              dikeluarkan dari gudang.
            </p>
          </div>

          <div className={styles.formActions}>
            <button className={styles.btnSecondary} onClick={onClose}>
              Batal
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={loading || !isWithinTolerance || !formData.lotNumber}
            >
              {loading ? "Memproses..." : "✓ Konfirmasi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
