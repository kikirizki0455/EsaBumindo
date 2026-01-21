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
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button"; // Asumsi Anda punya komponen Button
// Data dummy untuk diisi di dalam Card Carousel
// const carouselData = [
//   { title: "Solusi Cepat", detail: "Kami menawarkan layanan purna jual 24/7." },
//   {
//     title: "Produk Premium",
//     detail: "Kualitas bahan terbaik untuk kepuasan Anda.",
//   },
//   {
//     title: "Inovasi Terbaru",
//     detail: "Mengadopsi teknologi terdepan di industri.",
//   },
//   {
//     title: "Harga Terbaik",
//     detail: "Nilai investasi maksimal untuk bisnis Anda.",
//   },
// ];
export default function HeroSection() {
  const { t } = useTranslation();
  const carouselDataSection = t("heroSection.carousel");

  const carouselItems = Array.isArray(carouselDataSection)
    ? carouselDataSection
    : [];
  return (
    <section className="py-16 border-black b border md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* TEXT */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#ff4136] dark:text-gray-50 leading-tight">
              {t("heroSection.headline.prefix")}{" "}
              <span className="text-[#060771] dark:text-amber-400">
                {t("heroSection.headline.highlight")}
              </span>
            </h1>

            <h2 className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg lg:max-w-none mx-auto lg:mx-0">
              {t("heroSection.description")}
            </h2>

            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
              <Button size="lg" className="text-base sm:text-lg px-8 py-6">
                {t("heroSection.cta.primary")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base sm:text-lg px-8 py-6"
              >
                {t("heroSection.cta.secondary")}
              </Button>
            </div>
          </div>

          {/* CAROUSEL */}
          <div className="lg:w-1/2 w-full max-w-lg mx-auto lg:mx-0">
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {carouselItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-full xl:basis-1/2"
                  >
                    <Card className="shadow-lg border-2 border-primary/50">
                      <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                        <h3 className="text-2xl font-bold mb-2 text-primary">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-700">{item.detail}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
