"use client";

import * as React from "react";
import { MoveLeft, MoveRight } from "lucide-react";

// Import komponen shadcn/ui yang diperlukan
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button"; // Asumsi Anda punya komponen Button

// Data dummy untuk diisi di dalam Card Carousel
const carouselData = [
  { title: "Solusi Cepat", detail: "Kami menawarkan layanan purna jual 24/7." },
  {
    title: "Produk Premium",
    detail: "Kualitas bahan terbaik untuk kepuasan Anda.",
  },
  {
    title: "Inovasi Terbaru",
    detail: "Mengadopsi teknologi terdepan di industri.",
  },
  {
    title: "Harga Terbaik",
    detail: "Nilai investasi maksimal untuk bisnis Anda.",
  },
];

export default function HeroSection() {
  return (
    // 1. Container Utama - Memberikan padding vertikal yang cukup
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Tata Letak (Layout) */}
        {/* Mobile: Stacked (flex-col) | Desktop: Side-by-Side (lg:flex-row) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* --- A. Konten Teks & CTA (Kiri pada Desktop) --- */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            {/* H1: Heading Utama (Ukuran dan Berat Font Responsive) */}
            <h1 className="head1 text-4xl  sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#ff4136] dark:text-gray-50 leading-tight">
              #HARI INI PO{" "}
              <span className=" text-[#060771] dark:text-amber-400">
                LANGSUNG JADI.
              </span>
            </h1>

            {/* H2: Subheading/Deskripsi (Ukuran Responsive) */}
            <h2 className="head2 mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg lg:max-w-none mx-auto lg:mx-0">
              Industri sering terhambat oleh produksi yang lambat dan suplai
              yang tidak pasti. Karena itu, kecepatan dan konsistensi menjadi
              kunci. ESABOND menjawab kebutuhan tersebut dengan proses produksi
              super cepat pemesanan hari ini, besok langsung kami buat membantu
              bisnis Anda bergerak lebih efisien dan siap bersaing.
            </h2>

            {/* CTA Button (Responsive) */}
            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
              <Button size="lg" className="text-base sm:text-lg px-8 py-6">
                Hubungi Kami Sekarang
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base sm:text-lg px-8 py-6"
              >
                Lihat Produk
              </Button>
            </div>
          </div>

          {/* --- B. Carousel Card (Kanan pada Desktop) --- */}
          <div className="lg:w-1/2 w-full max-w-lg mx-auto lg:mx-0">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {carouselData.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-full xl:basis-1/2"
                  >
                    <div className="p-1">
                      <Card className="shadow-lg border-2 border-primary/50 dark:border-primary/30">
                        <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                          <h3 className="text-2xl font-bold mb-2 text-primary dark:text-amber-400">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {item.detail}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Kontrol Navigasi Carousel (Disembunyikan di Mobile, Muncul di Desktop) */}
              <CarouselPrevious className="hidden md:flex top-1/2 -left-8 dark:text-gray-50">
                <MoveLeft className="h-4 w-4" />
              </CarouselPrevious>
              <CarouselNext className="hidden md:flex top-1/2 -right-8 dark:text-gray-50">
                <MoveRight className="h-4 w-4" />
              </CarouselNext>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
