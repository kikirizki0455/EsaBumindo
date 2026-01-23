"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "@/hooks/use-translation";
import { useProductFilters } from "@/hooks/use-product-filters";
import ProductHero from "@/components/product/product-hero";
import ProductFilters from "@/components/product/product-filters";
import ProductPagination from "@/components/product/product-pagination";
import {
  BEST_SELLER_PRODUCTS,
  NEW_PRODUCTS,
  APPLICATIONS,
} from "@/data/products";
import MainLayout from "./layouts/main-layout";
import { generatePageMeta, generateBreadcrumbSchema } from "@/lib/seo-utils";

// Lazy load heavy components with ssr: false to avoid hydration issues
const ApplicationsSection = dynamic(
  () => import("@/components/product/applications-section"),
  {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
    ssr: false,
  }
);

// Combine all products into one list
const ALL_PRODUCTS = [...BEST_SELLER_PRODUCTS, ...NEW_PRODUCTS];

// ✅ SEO Meta Data
const seoMeta = generatePageMeta({
  title: "Produk Adhesive Berkualitas - Esabumindo",
  description:
    "Jelajahi katalog lengkap produk adhesive dari Esabumindo. Tersedia berbagai tipe adhesive untuk kebutuhan industri dengan kualitas terjamin.",
  keywords:
    "produk adhesive, katalog adhesive, jenis lem, adhesive industrial, adhesive berkualitas",
  image: "https://esabumindo.com/og-products.png",
  url: "https://esabumindo.com/product",
  type: "website",
});

// ✅ Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Products", url: "https://esabumindo.com/product" },
]);

export default function ProductPage() {
  const router = useRouter();
  const { t, isHydrated } = useTranslation();
  const [isPageHydrated, setIsPageHydrated] = useState(false);

  // Use the custom hook for filtering
  const {
    searchQuery,
    selectedType,
    selectedApplication,
    currentPage,
    itemsPerPage,
    availableTypes,
    availableApplications,
    paginatedProducts,
    totalPages,
    totalItems,
    hasActiveFilters,
    handleSearchChange,
    handleTypeChange,
    handleApplicationChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleClearFilters,
  } = useProductFilters(ALL_PRODUCTS);

  // Fix hydration mismatch - only render after component mounts on client
  useEffect(() => {
    setIsPageHydrated(true);
  }, []);

  // Memoize data untuk menghindari re-render yang tidak perlu
  const applicationsData = useMemo(() => APPLICATIONS, []);

  // Handler untuk detail produk - navigate ke halaman detail
  const handleDetail = useCallback(
    (productId) => {
      if (router.isReady) {
        router.push(`/product/${productId}`);
      }
    },
    [router]
  );

  // Handler untuk pre-order - navigate ke halaman pre-order
  const handleRequest = useCallback(
    (productId) => {
      if (router.isReady) {
        router.push(`/pre-order/${productId}`);
      }
    },
    [router]
  );

  // Handle contact button
  const handleContact = useCallback(() => {
    if (router.isReady) {
      router.push("/contact");
    }
  }, [router]);

  // Don't render anything until hydration is complete
  if (!isPageHydrated || !isHydrated) {
    return (
      <>
        <Head>
          <title>{t("products.loading")}</title>
        </Head>
        <MainLayout>
          <div className="min-h-screen bg-white">
            <ProductHero />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="animate-pulse space-y-8">
                <div className="h-12 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded w-full" />
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <meta name="viewport" content={seoMeta.viewport} />
        <meta name="robots" content={seoMeta.robots} />

        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.openGraph.title} />
        <meta
          property="og:description"
          content={seoMeta.openGraph.description}
        />
        <meta property="og:type" content={seoMeta.openGraph.type} />
        <meta property="og:url" content={seoMeta.openGraph.url} />
        <meta property="og:image" content={seoMeta.openGraph.images[0].url} />
        <meta property="og:site_name" content={seoMeta.openGraph.siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta
          name="twitter:description"
          content={seoMeta.twitter.description}
        />

        {/* Canonical */}
        <link rel="canonical" href={seoMeta.canonical} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <MainLayout>
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <ProductHero />

          <main className="pb-16">
            {/* Product Section with Filters and Pagination */}
            <section className="py-16 md:py-20 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {t("products.productGrid.title")}
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#0c439a] to-[#ca161e]" />
                </div>

                {/* Filter Section */}
                <ProductFilters
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  selectedType={selectedType}
                  onTypeChange={handleTypeChange}
                  selectedApplication={selectedApplication}
                  onApplicationChange={handleApplicationChange}
                  availableTypes={availableTypes}
                  availableApplications={availableApplications}
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />

                {/* Products Display */}
                {paginatedProducts && paginatedProducts.length > 0 ? (
                  <>
                    {/* Desktop Table View - Hidden on mobile */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/4">
                              {t("products.productCard.specifications")}
                            </th>
                            <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/4">
                              {t("products.productDetail.applicationInfo")}
                            </th>
                            <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/3">
                              {t("products.productCard.features")}
                            </th>
                            <th className="text-center py-4 px-4 font-semibold text-gray-900 w-1/6">
                              {t("products.productCard.viewDetails")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              {/* Product Name & Image */}
                              <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-16 h-16 flex-shrink-0 bg-[#f5f0f0] rounded flex items-center justify-center overflow-hidden">
                                    <img
                                      src={product.image}
                                      alt={product.title}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {product.title}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      {product.type}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Application */}
                              <td className="py-6 px-4">
                                <p className="text-gray-600 text-sm">
                                  {product.application}
                                </p>
                              </td>

                              {/* Features */}
                              <td className="py-6 px-4">
                                <ul className="space-y-1">
                                  {product.features
                                    ?.slice(0, 3)
                                    .map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="text-gray-600 text-sm flex items-center gap-2"
                                      >
                                        <span className="size-1 rounded-full bg-gray-400" />
                                        {feature}
                                      </li>
                                    ))}
                                  {product.features?.length > 3 && (
                                    <li className="text-gray-500 text-sm italic">
                                      +{product.features.length - 3}{" "}
                                      {t("products.productGrid.noResults")}
                                    </li>
                                  )}
                                </ul>
                              </td>

                              {/* Actions */}
                              <td className="py-6 px-4">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleDetail(product.id)}
                                    className="bg-[#ca161e] hover:bg-[#a01318] text-white rounded-sm text-sm px-4 py-2 transition-colors"
                                  >
                                    {t("products.productCard.viewDetails")}
                                  </button>
                                  <button
                                    onClick={() => handleRequest(product.id)}
                                    className="bg-[#1f4faa] hover:bg-[#173d85] text-white rounded-sm text-sm px-4 py-2 transition-colors"
                                  >
                                    {t("products.productCard.addToCart")}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                      {paginatedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative aspect-[4/3] bg-[#f5f0f0] flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="mb-2 font-semibold text-gray-900">
                              {product.title}
                            </h3>
                            <p className="text-gray-600 mb-3 text-sm">
                              {product.application}
                            </p>
                            <ul className="space-y-1 mb-4">
                              {product.features?.map((feature, index) => (
                                <li
                                  key={index}
                                  className="text-gray-600 text-sm flex items-center gap-2"
                                >
                                  <span className="size-1 rounded-full bg-gray-400" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleDetail(product.id)}
                                className="flex-1 bg-[#ca161e] hover:bg-[#a01318] text-white rounded-sm py-2 transition-colors"
                              >
                                {t("products.productCard.viewDetails")}
                              </button>
                              <button
                                onClick={() => handleRequest(product.id)}
                                className="flex-1 bg-[#1f4faa] hover:bg-[#173d85] text-white rounded-sm py-2 transition-colors"
                              >
                                {t("products.productCard.addToCart")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <ProductPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {t("products.productGrid.noResults")}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Applications Section */}
            <ApplicationsSection applications={applicationsData} />

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-[#0c439a] to-[#ca161e]">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {t("products.cta.title")}
                  </h2>
                  <p className="text-lg text-white/90 mb-8">
                    {t("products.cta.description")}
                  </p>
                  <button
                    onClick={handleContact}
                    className="inline-block px-8 py-4 bg-white text-[#0c439a] font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    {t("products.cta.button")}
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </MainLayout>
    </>
  );
}
