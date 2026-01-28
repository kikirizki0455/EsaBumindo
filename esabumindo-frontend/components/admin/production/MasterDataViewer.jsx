import { useState, useEffect } from "react";
import {
  fetchProducts,
  fetchMaterials,
  fetchPackagingTypes,
  fetchWarehouses,
  groupMaterialsByCategory,
  getStockColorIndicator,
  isLowStock,
} from "@/lib/masterDataService";
import styles from "@/styles/production.module.css";

/**
 * MasterDataViewer: Component untuk menampilkan dan manage master data dari database
 * - Products dengan BOM details
 * - Materials dengan stock info per warehouse
 * - Packaging types
 * - Warehouses
 */
export default function MasterDataViewer() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load data saat tab berubah
  useEffect(() => {
    loadMasterData();
  }, [activeTab]);

  const loadMasterData = async () => {
    try {
      setLoading(true);
      setError("");

      if (activeTab === "products") {
        const data = await fetchProducts();
        setProducts(data);
      } else if (activeTab === "materials") {
        const [materialsData, warehousesData] = await Promise.all([
          fetchMaterials(),
          fetchWarehouses(),
        ]);
        setMaterials(materialsData);
        setWarehouses(warehousesData);
      } else if (activeTab === "packaging") {
        const data = await fetchPackagingTypes();
        setPackagingTypes(data);
      } else if (activeTab === "warehouses") {
        const data = await fetchWarehouses();
        setWarehouses(data);
      }
    } catch (err) {
      setError(err.message || "Gagal memuat master data");
      console.error("Error loading master data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products berdasarkan search query
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter materials berdasarkan search query
  const filteredMaterials = materials.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.masterDataContainer}>
      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "products" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            📦 Products ({products.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "materials" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("materials")}
          >
            🧪 Materials ({materials.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "packaging" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("packaging")}
          >
            📫 Packaging ({packagingTypes.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "warehouses" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("warehouses")}
          >
            🏢 Warehouses ({warehouses.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {(activeTab === "products" || activeTab === "materials") && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={`Cari ${
              activeTab === "products" ? "produk" : "material"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* Error Message */}
      {error && <div className={styles.error}>⚠️ {error}</div>}

      {/* Loading State */}
      {loading && <div className={styles.loading}>⏳ Loading data...</div>}

      {/* Tab Content */}
      {!loading && (
        <>
          {/* Products Tab */}
          {activeTab === "products" && (
            <div className={styles.tabContent}>
              {filteredProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  {searchQuery
                    ? "Tidak ada produk yang cocok"
                    : "Tidak ada produk"}
                </div>
              ) : (
                <div className={styles.productsList}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productCardHeader}>
                        <div className={styles.productInfo}>
                          <h3>{product.code}</h3>
                          <p className={styles.productName}>{product.name}</p>
                          {product.description && (
                            <p className={styles.description}>
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className={styles.productMeta}>
                          <span className={styles.productType}>
                            {product.type}
                          </span>
                          <span
                            className={`${styles.productStatus} ${
                              product.status === "active"
                                ? styles.statusActive
                                : styles.statusInactive
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>

                      <div className={styles.productDetails}>
                        <span>📏 Base Qty: {product.baseQty} kg</span>
                        <button
                          className={styles.expandBtn}
                          onClick={() =>
                            setExpandedProduct(
                              expandedProduct === product.id ? null : product.id
                            )
                          }
                        >
                          {expandedProduct === product.id
                            ? "▼ BOM Details"
                            : "▶ BOM Details"}
                        </button>
                      </div>

                      {/* BOM Details Section */}
                      {expandedProduct === product.id &&
                        product.bom &&
                        product.bom.details &&
                        product.bom.details.length > 0 && (
                          <div className={styles.bomSection}>
                            <h4>📋 Bill of Materials</h4>
                            <table className={styles.bomTable}>
                              <thead>
                                <tr>
                                  <th>Step</th>
                                  <th>Material</th>
                                  <th>Code</th>
                                  <th>Percentage</th>
                                  <th>Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.bom.details.map((detail, idx) => (
                                  <tr key={idx}>
                                    <td className={styles.centered}>
                                      {detail.step}
                                    </td>
                                    <td>
                                      <strong>{detail.material?.name}</strong>
                                    </td>
                                    <td>
                                      <code>{detail.material?.code}</code>
                                    </td>
                                    <td className={styles.centered}>
                                      <span className={styles.percentageBadge}>
                                        {detail.percentage}%
                                      </span>
                                    </td>
                                    <td>{detail.notes || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                      {expandedProduct === product.id &&
                        (!product.bom || !product.bom.details) && (
                          <div className={styles.emptyBOM}>
                            ⚠️ Produk ini belum memiliki BOM
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div className={styles.tabContent}>
              {filteredMaterials.length === 0 ? (
                <div className={styles.emptyState}>
                  {searchQuery
                    ? "Tidak ada material yang cocok"
                    : "Tidak ada material"}
                </div>
              ) : (
                <div className={styles.materialsGrid}>
                  {filteredMaterials.map((material) => (
                    <div key={material.id} className={styles.materialCard}>
                      <div className={styles.materialHeader}>
                        <h3>{material.code}</h3>
                        <span className={styles.category}>
                          {material.category}
                        </span>
                      </div>
                      <p className={styles.materialName}>{material.name}</p>
                      <p className={styles.materialUnit}>
                        Unit: {material.unit}
                      </p>

                      {/* Stock Information */}
                      <div className={styles.stockSection}>
                        <h4>📦 Stock Info</h4>
                        {material.materialStocks &&
                        material.materialStocks.length > 0 ? (
                          <div className={styles.stockList}>
                            {material.materialStocks.map((stock, idx) => {
                              const lowStock = isLowStock(stock);
                              const colorIndicator =
                                getStockColorIndicator(stock);
                              return (
                                <div
                                  key={idx}
                                  className={`${styles.stockItem} ${
                                    styles[`stock${colorIndicator}`]
                                  }`}
                                >
                                  <div className={styles.warehouseName}>
                                    {stock.warehouse?.name}
                                  </div>
                                  <div className={styles.stockQuantity}>
                                    {stock.quantity.toFixed(2)} {material.unit}
                                  </div>
                                  <div className={styles.stockThresholds}>
                                    <small>
                                      Min: {stock.minStock?.toFixed(2)} | Max:{" "}
                                      {stock.maxStock?.toFixed(2)}
                                    </small>
                                  </div>
                                  {lowStock && (
                                    <div className={styles.lowStockWarning}>
                                      ⚠️ Stock rendah
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className={styles.noStock}>Tidak ada data stock</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Packaging Types Tab */}
          {activeTab === "packaging" && (
            <div className={styles.tabContent}>
              {packagingTypes.length === 0 ? (
                <div className={styles.emptyState}>
                  Tidak ada packaging types
                </div>
              ) : (
                <div className={styles.packagingGrid}>
                  {packagingTypes.map((pkg) => (
                    <div key={pkg.id} className={styles.packagingCard}>
                      <h3>{pkg.code}</h3>
                      <p className={styles.packagingName}>{pkg.name}</p>
                      <div className={styles.packagingCapacity}>
                        {pkg.capacity} {pkg.unit}
                      </div>
                      {pkg.description && (
                        <p className={styles.description}>{pkg.description}</p>
                      )}
                      <span
                        className={`${styles.status} ${
                          pkg.status === "active"
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Warehouses Tab */}
          {activeTab === "warehouses" && (
            <div className={styles.tabContent}>
              {warehouses.length === 0 ? (
                <div className={styles.emptyState}>Tidak ada warehouse</div>
              ) : (
                <div className={styles.warehousesGrid}>
                  {warehouses.map((warehouse) => (
                    <div key={warehouse.id} className={styles.warehouseCard}>
                      <h3>{warehouse.code}</h3>
                      <p className={styles.warehouseName}>{warehouse.name}</p>
                      <span
                        className={`${styles.status} ${
                          warehouse.status === "active"
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {warehouse.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
