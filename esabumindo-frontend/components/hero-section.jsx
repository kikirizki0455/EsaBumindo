"use client";

import * as React from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
import { Button } from "@/components/ui/button";

// Array gambar untuk carousel
const carouselImages = [
  "/asset/image/plant2.1.jpeg",
  "/asset/image/plant2.jpeg",
  "/asset/image/esabumindo-founder.webp",
  "/asset/image/plant2.1.jpeg", // fallback jika item lebih dari 3
];

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
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 py-6"
                asChild
              >
                <Link href="/contact">{t("heroSection.cta.primary")}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base sm:text-lg px-8 py-6"
                asChild
              >
                <Link href="/products">{t("heroSection.cta.secondary")}</Link>
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
                    <Card className="shadow-lg border-0 overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                      {/* Image Container dengan ukuran fixed */}
                      <div className="relative h-48 w-full">
                        <Image
                          src={carouselImages[index % carouselImages.length]}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      {/* Content */}
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-primary mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.detail}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0 bg-primary/10 hover:bg-primary/20 border-0" />
                <CarouselNext className="static translate-y-0 bg-primary/10 hover:bg-primary/20 border-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
