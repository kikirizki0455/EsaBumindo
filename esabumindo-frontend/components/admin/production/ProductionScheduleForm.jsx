import { useState, useEffect } from "react";
import {
  fetchProducts,
  calculateBOMRequirements,
  formatQuantity,
} from "@/lib/masterDataService";
import styles from "@/styles/production.module.css";

/**
 * ProductionScheduleForm: Modal form untuk membuat production schedule
 * - Input: date, reactor, product, target_qty
 * - Auto-generates material requirements dari BOM dengan preview
 * - Shows BOM details dengan calculated quantities
 */
export default function ProductionScheduleForm({ onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bomRequirements, setBomRequirements] = useState([]);
  const [formData, setFormData] = useState({
    planDate: new Date().toISOString().split("T")[0],
    reactor: "A",
    productId: "",
    targetQty: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products dari master data
  useEffect(() => {
    loadProducts();
  }, []);

  // Hitung BOM requirements saat product atau targetQty berubah
  useEffect(() => {
    if (selectedProduct && formData.targetQty > 0) {
      const requirements = calculateBOMRequirements(
        selectedProduct,
        formData.targetQty
      );
      setBomRequirements(requirements);
    } else {
      setBomRequirements([]);
    }
  }, [selectedProduct, formData.targetQty]);

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Gagal memuat data produk");
      setProducts([]);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setFormData({ ...formData, productId });

    // Find selected product dan set selectedProduct untuk BOM calculation
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate BOM exists
    if (!selectedProduct || !selectedProduct.bom) {
      setError("Produk yang dipilih tidak memiliki BOM");
      return;
    }

    if (bomRequirements.length === 0) {
      setError("BOM belum memiliki material detail");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/production/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal membuat jadwal produksi");
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
      console.error("Error creating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalLarge}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>📋 Buat Jadwal Produksi</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formSection}>
            <h3>📅 Informasi Produksi</h3>

            <div className={styles.formGroup}>
              <label>Tanggal Rencana *</label>
              <input
                type="date"
                value={formData.planDate}
                onChange={(e) =>
                  setFormData({ ...formData, planDate: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Reactor *</label>
                <select
                  value={formData.reactor}
                  onChange={(e) =>
                    setFormData({ ...formData, reactor: e.target.value })
                  }
                  required
                >
                  <option value="A">Reactor A</option>
                  <option value="B">Reactor B</option>
                  <option value="C">Reactor C</option>
                  <option value="D">Reactor D</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Target Quantity *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.targetQty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetQty: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Produk *</label>
              <select
                value={formData.productId}
                onChange={handleProductChange}
                required
              >
                <option value="">-- Pilih Produk --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <small className={styles.helpText}>
                  Base Qty: {selectedProduct.baseQty} kg | Type:{" "}
                  {selectedProduct.type}
                </small>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Catatan (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
                placeholder="Catatan tambahan untuk produksi..."
              />
            </div>
          </div>

          {/* BOM Requirements Preview */}
          {selectedProduct && bomRequirements.length > 0 && (
            <div className={styles.formSection}>
              <h3>📦 Kebutuhan Material (BOM)</h3>
              <p className={styles.sectionDescription}>
                Material yang dibutuhkan akan otomatis disiapkan berdasarkan BOM
              </p>

              <div className={styles.bomTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Material</th>
                      <th>Kategori</th>
                      <th>Percentage</th>
                      <th>Qty Dibutuhkan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomRequirements.map((req, idx) => (
                      <tr key={idx}>
                        <td>{req.bomStep}</td>
                        <td>
                          <strong>{req.material?.name}</strong>
                          <br />
                          <small>{req.material?.code}</small>
                        </td>
                        <td>{req.material?.category || "—"}</td>
                        <td>{req.percentage}%</td>
                        <td className={styles.quantityCell}>
                          {formatQuantity(req.requiredQty, req.material?.unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.bomSummary}>
                <p>
                  Total Material: <strong>{bomRequirements.length}</strong>{" "}
                  jenis
                </p>
              </div>
            </div>
          )}

          {selectedProduct && !selectedProduct.bom && (
            <div className={styles.warningBox}>
              ⚠️ Produk ini belum memiliki BOM. Silakan buat BOM terlebih
              dahulu.
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={loading || !selectedProduct || !selectedProduct.bom}
            >
              {loading ? "Membuat..." : "Buat Jadwal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
