"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/product/product-grid";
import ProductPageSkeleton from "@/components/product/product-page-skeleton";
import { Button } from "@/components/ui/button";
import { BEST_SELLER_PRODUCTS, NEW_PRODUCTS } from "@/data/products";
import ClientLogo from "@/components/product/client-logo";
import InfiniteCarousel from "@/components/product/infinite-carousel";
import { CLIENTS_DATA } from "@/pages/api/client";

// Assets (pastikan path benar & ada di public/ atau figma-plugin)
import imgRectangle4193 from "@/public/asset/image/client/adr.png";
import imgRectangle4197 from "@/public/asset/image/client/aspex.png";
import imgRectangle4195 from "@/public/asset/image/client/cp.png";
import imgRectangle4194 from "@/public/asset/image/client/matel.png";
import imgRectangle4199 from "@/public/asset/image/client/pg.png";
import imgRectangle4196 from "@/public/asset/image/client/pura.png";
import imgRectangle4201 from "@/public/asset/image/client/w.png";

export default function ProductPage() {
  const [isLoading, setIsLoading] = useState(true);

  const clients = [
    { name: "ASPEX", logo: imgRectangle4193 },
    { name: "Client 2", logo: imgRectangle4197 },
    { name: "Client 3", logo: imgRectangle4195 },
    { name: "Client 4", logo: imgRectangle4194 },
    { name: "ACR GROUP", logo: imgRectangle4199 },
    { name: "Client 6", logo: imgRectangle4196 },
    { name: "MATTEL", logo: imgRectangle4201 },
    { name: "COLORXX", logo: imgRectangle4194 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDetail = (id) => console.log("Detail product:", id);
  const handlePreOrder = (id) => console.log("Pre order product:", id);

  if (isLoading) return <ProductPageSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-[#ca161e] text-[#0c439a] rounded-tr-2xl rounded-bl-2xl px-12"
              size="lg"
            >
              Produk
            </Button>
          </div>
        </div>

        <ProductGrid
          title="Best Seller"
          products={BEST_SELLER_PRODUCTS}
          onDetail={handleDetail}
          onPreOrder={handlePreOrder}
        />

        <ProductGrid
          title="New Product"
          products={NEW_PRODUCTS}
          onDetail={handleDetail}
          onPreOrder={handlePreOrder}
        />

        <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
          {/* Background Decoration */}
          <div
            className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
            aria-hidden="true"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Klien Kami
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Dipercaya oleh perusahaan-perusahaan terkemuka di berbagai
                industri
              </p>
              <div
                className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"
                aria-hidden="true"
              />
            </header>

            {/* Carousel */}
            <div className="relative">
              {/* Gradient Overlays */}
              <div
                className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"
                aria-hidden="true"
              />

              <InfiniteCarousel clients={CLIENTS_DATA} />
            </div>

            {/* Instruction Text */}
            <p className="text-center text-sm text-gray-500 mt-8 md:mt-12 animate-pulse">
              Klik dan geser untuk mengontrol scroll
            </p>
          </div>

          {/* Custom CSS for animations */}
          <style jsx>{`
            @keyframes blob {
              0%,
              100% {
                transform: translate(0, 0) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
            }

            .animate-blob {
              animation: blob 7s infinite;
            }

            .animation-delay-2000 {
              animation-delay: 2s;
            }

            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }

            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </section>
      </main>
    </div>
  );
}
