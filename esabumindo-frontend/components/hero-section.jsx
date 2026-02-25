"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

// 2 gambar utama untuk hero section
const heroImages = [
  {
    src: "/asset/image/plant2.jpeg",
    alt: "Esabumindo Factory",
  },
  {
    src: "/asset/image/esabumindo-founder.webp",
    alt: "Esabumindo Team",
  },
];

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
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

            {/* CTA Buttons - Fixed sizing */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
              <Button
                size="lg"
                className="text-sm sm:text-base px-6 py-3 h-12 w-full sm:w-auto"
                asChild
              >
                <Link href="/contact">{t("heroSection.cta.primary")}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm sm:text-base px-6 py-3 h-12 w-full sm:w-auto"
                asChild
              >
                <Link href="/products">{t("heroSection.cta.secondary")}</Link>
              </Button>
            </div>
          </div>

          {/* HERO IMAGES - Stacked/Overlapping Layout */}
          <div className="lg:w-1/2 w-full max-w-md lg:max-w-lg mx-auto lg:mx-0">
            {/* Mobile Layout - Clean single image with badge */}
            <div className="block md:hidden">
              <div className="relative">
                {/* Main Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={heroImages[0].src}
                    alt={heroImages[0].alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Floating Badge - Inside image */}
                  <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary">
                          {t("heroSection.badge.years")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {t("heroSection.badge.label")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {t("heroSection.badge.sublabel")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Original overlapping design */}
            <div className="hidden md:block relative h-[400px] lg:h-[480px]">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-[#060771]/10 rounded-full blur-2xl" />

              {/* Main Image (Back) */}
              <div className="absolute top-0 right-0 w-[75%] h-[70%] rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out z-10">
                <Image
                  src={heroImages[0].src}
                  alt={heroImages[0].alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Secondary Image (Front) */}
              <div className="absolute bottom-0 left-0 w-[65%] h-[60%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-out z-20 border-4 border-white dark:border-gray-800">
                <Image
                  src={heroImages[1].src}
                  alt={heroImages[1].alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-8 right-4 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {t("heroSection.badge.years")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t("heroSection.badge.label")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("heroSection.badge.sublabel")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
