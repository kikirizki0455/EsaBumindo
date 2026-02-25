"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Download, Share2, ShoppingCart } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalizedProducts } from "@/hooks/use-localized-products";
import MainLayout from "../layouts/main-layout";

// Lazy load components
const ProductDetailSkeleton = dynamic(
  () => import("@/components/product/product-detail-skeleton"),
  { loading: () => <div className="h-screen bg-gray-100 animate-pulse" /> }
);

const RelatedProducts = dynamic(
  () => import("@/components/product/related-products"),
  { loading: () => <div className="h-96 bg-gray-100 animate-pulse" /> }
);

const ProductSpecifications = dynamic(
  () => import("@/components/product/product-specifications"),
  { loading: () => <div className="h-48 bg-gray-100 animate-pulse" /> }
);

const ProductTechnicalInfo = dynamic(
  () => import("@/components/product/product-technical-info"),
  { loading: () => <div className="h-48 bg-gray-100 animate-pulse" /> }
);

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t, isHydrated } = useTranslation();

  // Use localized products hook for multi-language support
  const { products, isLoading: isProductsLoading } = useLocalizedProducts();

  const [activeTab, setActiveTab] = useState("overview");
  const [isCopied, setIsCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Find product by ID with localized content - akan update otomatis saat bahasa berubah
  const product = useMemo(() => {
    if (!id || !isHydrated || isProductsLoading || !products.length)
      return null;
    return products.find((p) => p.id === id) || null;
  }, [id, isHydrated, isProductsLoading, products]);

  // Handle share
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: product?.performance,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  }, [product]);

  // Handle download spec
  const handleDownloadSpec = useCallback(() => {
    console.log("Download specification for:", product?.id);
    // TODO: Implement download specification
  }, [product]);

  // Handle pre-order
  const handlePreOrder = useCallback(() => {
    router.push(`/pre-order/${product?.id}`);
  }, [product, router]);

  // Handle image error - gunakan placeholder SVG inline
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Loading state
  const isLoading = !isHydrated || isProductsLoading;

  // Only render skeleton while loading OR if not hydrated
  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("products.productDetail.productNotFound")}
            </h1>
            <Link
              href="/product"
              className="inline-block px-6 py-3 bg-[#0c439a] text-white rounded-lg hover:bg-[#0a3478] transition-colors"
            >
              {t("products.productDetail.backToProducts")}
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb & Back Button */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0c439a] hover:text-[#0a3478] font-semibold transition-colors"
            >
              <ChevronLeft size={20} />
              {t("products.productDetail.backButton")}
            </button>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative flex items-center justify-center">
                {!imageError ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    onError={handleImageError}
                    unoptimized={false}
                  />
                ) : (
                  <svg
                    className="w-32 h-32 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 200 200"
                  >
                    <rect width="200" height="200" fill="#f3f4f6" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className="text-gray-400"
                      fontSize="14"
                    >
                      {product.name}
                    </text>
                    <path
                      d="M60 80 L140 80 L140 160 L60 160 Z"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="110" r="8" fill="#d1d5db" />
                  </svg>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {t("products.productDetail.category")}:{" "}
                <span className="font-semibold">{product.category}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-2 inline-block px-3 py-1 bg-blue-100 text-[#0c439a] rounded-full text-sm font-semibold">
                  {product.type}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {product.performance}
                </p>

                {/* Features Quick List */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("products.productDetail.mainAdvantages")}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features?.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-[#ca161e] font-bold mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handlePreOrder}
                  className="w-full bg-gradient-to-r from-[#0c439a] to-[#ca161e] text-white py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <ShoppingCart size={20} />
                  {t("products.productDetail.preOrder")}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadSpec}
                    className="border-2 border-[#0c439a] text-[#0c439a] py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    {t("products.productDetail.downloadSpec")}
                  </button>
                  <button
                    onClick={handleShare}
                    className="border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    {isCopied
                      ? t("products.productDetail.copied")
                      : t("products.productDetail.share")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8 overflow-x-auto">
              {[
                {
                  id: "overview",
                  label: t("products.productDetail.tabs.overview"),
                },
                {
                  id: "specifications",
                  label: t("products.productDetail.tabs.specifications"),
                },
                {
                  id: "technical",
                  label: t("products.productDetail.tabs.technical"),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#0c439a] text-[#0c439a]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-16">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t("products.productDetail.description")}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {product.description}
                  </p>
                </div>

                <div className="bg-linear-to-br from-[#0c439a]/10 to-[#ca161e]/10 p-6 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-4">
                    {t("products.productDetail.applicationInfo")}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("products.productDetail.industry")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {product.application}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("products.productDetail.category")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("products.productDetail.adhesiveType")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {product.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <ProductSpecifications product={product} />
            )}

            {activeTab === "technical" && (
              <ProductTechnicalInfo product={product} />
            )}
          </div>

          {/* Related Products */}
          <RelatedProducts currentProductId={product.id} />
        </main>
      </div>
    </MainLayout>
  );
}
