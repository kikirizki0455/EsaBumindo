"use client";

import { memo } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

const ProductHero = memo(function ProductHero() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) {
    return (
      <section className="relative min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-[#0c439a]/5 via-white to-[#ca161e]/5 overflow-hidden pt-20 pb-12 md:pb-16">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-48 mb-6" />
          <div className="space-y-3 mb-6">
            <div className="h-16 bg-gray-200 rounded w-full" />
            <div className="h-16 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-300 rounded w-32" />
            <div className="h-12 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-[#0c439a]/5 via-white to-[#ca161e]/5 overflow-hidden pt-20 pb-12 md:pb-16">
      {/* Background Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[#0c439a] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#ca161e] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#0c439a]/10 border border-[#0c439a]/20">
            <span className="w-2 h-2 rounded-full bg-[#0c439a]" />
            <span className="text-sm font-medium text-[#0c439a]">
              {t("products.productGrid.title")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t("products.heroSection.headline.prefix")}{" "}
            <span className="bg-gradient-to-r from-[#0c439a] to-[#ca161e] bg-clip-text text-transparent">
              {t("products.heroSection.headline.highlight")}
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {t("products.heroSection.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-gradient-to-r from-[#0c439a] to-[#0a3577] hover:opacity-90 text-white font-semibold px-8 py-3"
              size="lg"
              asChild
            >
              <a href="#product-grid">
                {t("products.heroSection.cta.primary")}
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#ca161e] text-[#ca161e] hover:bg-[#ca161e]/5 font-semibold px-8 py-3"
              size="lg"
              asChild
            >
              <Link href="/contact">
                {t("products.heroSection.cta.secondary")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

ProductHero.displayName = "ProductHero";

export default ProductHero;
