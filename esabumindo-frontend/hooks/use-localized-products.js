import { useMemo } from "react";
import { useTranslation } from "./use-translation";
import {
  getLocalizedProducts,
  getLocalizedApplications,
  getLocalizedProductById,
  getLocalizedProductsByType,
  PRODUCT_TYPES,
} from "@/data/products";

/**
 * Custom hook untuk mengambil data produk yang sudah di-localize
 * berdasarkan bahasa yang sedang aktif
 */
export function useLocalizedProducts() {
  const { t, isHydrated } = useTranslation();

  // Get product data from translations
  // Path yang benar adalah "products.productData" karena di language-context
  // translations disimpan sebagai combined.products = products.default
  const productData = useMemo(() => {
    if (!isHydrated) return null;

    // Get the productData object from translations
    // t() function sudah support mengakses nested object
    const data = t("products.productData");

    // Cek apakah data adalah object yang valid (bukan string key yang dikembalikan saat tidak ditemukan)
    if (typeof data === "object" && data !== null && data.products) {
      return data;
    }

    return null;
  }, [t, isHydrated]);

  // Get localized products
  const products = useMemo(() => {
    return getLocalizedProducts(productData);
  }, [productData]);

  // Get localized applications
  const applications = useMemo(() => {
    return getLocalizedApplications(productData);
  }, [productData]);

  // Helper function to get product by ID
  const getProductById = (id) => {
    return getLocalizedProductById(id, productData);
  };

  // Helper function to get products by type
  const getProductsByType = (type) => {
    return getLocalizedProductsByType(type, productData);
  };

  // Get best seller products (first product of each main type)
  const bestSellerProducts = useMemo(() => {
    return [
      products.find((p) => p.id === "pvac-001"),
      products.find((p) => p.id === "sty-001"),
      products.find((p) => p.id === "eva-001"),
      products.find((p) => p.id === "acr-001"),
    ].filter(Boolean);
  }, [products]);

  // Get new products
  const newProducts = useMemo(() => {
    return [
      products.find((p) => p.id === "psa-001"),
      products.find((p) => p.id === "vnl-001"),
      products.find((p) => p.id === "dmp-001"),
      products.find((p) => p.id === "wip-001"),
    ].filter(Boolean);
  }, [products]);

  return {
    products,
    applications,
    productTypes: PRODUCT_TYPES,
    bestSellerProducts,
    newProducts,
    getProductById,
    getProductsByType,
    isLoading: !isHydrated,
  };
}

export default useLocalizedProducts;
