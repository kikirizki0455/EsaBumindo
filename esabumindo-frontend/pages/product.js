"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ProductTable from "@/components/product/product-table";
import ProductHero from "@/components/product/product-hero";
import {
  BEST_SELLER_PRODUCTS,
  NEW_PRODUCTS,
  APPLICATIONS,
} from "@/data/products";
import MainLayout from "./layouts/main-layout";

// Lazy load heavy components
const ApplicationsSection = dynamic(
  () => import("@/components/product/applications-section"),
  {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
    ssr: true,
  }
);

const ProductPageSkeleton = dynamic(
  () => import("@/components/product/product-page-skeleton"),
  {
    loading: () => <div className="h-screen bg-gray-100 animate-pulse" />,
    ssr: false,
  }
);

export default function ProductPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Only set isHydrated to true after component mounts on client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Memoize data untuk menghindari re-render yang tidak perlu
  const bestSellerProducts = useMemo(() => BEST_SELLER_PRODUCTS, []);
  const newProducts = useMemo(() => NEW_PRODUCTS, []);
  const applicationsData = useMemo(() => APPLICATIONS, []);

  // Handler untuk detail produk - navigate ke halaman detail
  const handleDetail = useCallback(
    (productId) => {
      router.push(`/product/${productId}`);
    },
    [router]
  );

  // Handler untuk pre-order - navigate ke halaman pre-order
  const handleRequest = useCallback(
    (productId) => {
      router.push(`/pre-order/${productId}`);
    },
    [router]
  );

  // Render main content if hydrated, otherwise return null to avoid mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <ProductHero />

        <main className="pb-16">
          {/* Best Seller Products Table */}
          <ProductTable
            title="Produk Best Seller"
            products={bestSellerProducts}
            onDetail={handleDetail}
            onRequest={handleRequest}
          />

          {/* New Products Table */}
          <ProductTable
            title="Produk Terbaru"
            products={newProducts}
            onDetail={handleDetail}
            onRequest={handleRequest}
          />

          {/* Applications Section */}
          <ApplicationsSection applications={applicationsData} />

          {/* CTA Section */}
          <section className="py-16 md:py-20 bg-gradient-to-r from-[#0c439a] to-[#ca161e]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Butuh Konsultasi?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Tim ahli kami siap membantu Anda menemukan solusi adhesive
                  yang tepat untuk kebutuhan bisnis Anda.
                </p>
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-block px-8 py-4 bg-white text-[#0c439a] font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Hubungi Kami Sekarang
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
}
