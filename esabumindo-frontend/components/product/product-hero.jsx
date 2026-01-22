"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";

const ProductHero = memo(function ProductHero() {
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
            <span className="text-sm font-medium text-[#0c439a]">Katalog Produk Kami</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Solusi Adhesive & Sealant <span className="bg-gradient-to-r from-[#0c439a] to-[#ca161e] bg-clip-text text-transparent">Berkualitas Tinggi</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Produk kami telah dipercaya oleh industri terkemuka di seluruh dunia. Dengan teknologi terdepan dan kualitas terjamin, kami siap mendukung kebutuhan bisnis Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-gradient-to-r from-[#0c439a] to-[#0a3577] hover:opacity-90 text-white font-semibold px-8 py-3"
              size="lg"
            >
              Hubungi Sales
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#ca161e] text-[#ca161e] hover:bg-[#ca161e]/5 font-semibold px-8 py-3"
              size="lg"
            >
              Download Katalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

ProductHero.displayName = "ProductHero";

export default ProductHero;
