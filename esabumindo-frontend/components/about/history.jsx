import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
// ============================================================================
// DATA LAYER
// ============================================================================

const TIMELINE_DATA = [
  {
    id: "2025-expansion",
    name: "Ekspansi Regional",
    year: "2025",
    description:
      "Target ekspansi ke Asia Tenggara dan implementasi teknologi produksi ramah lingkungan yang berkelanjutan.",
    badgeColor: "bg-gradient-to-r from-indigo-600 to-purple-600",
    image: "/api/placeholder/400/300",
  },
  {
    id: "2024-launch",
    name: "Eman Suratman",
    year: "2024",
    description:
      "Meluncurkan produk utama X-Plus dan mencapai 100% target pasar di wilayah Jakarta dengan pertumbuhan signifikan.",
    badgeColor: "bg-gradient-to-r from-blue-800 to-blue-900",
    image: "/api/placeholder/400/300",
  },
  {
    id: "2023-certification",
    name: "Sarjana",
    year: "2023",
    description:
      "Memperoleh sertifikasi ISO 9001:2015 dan memperluas jaringan distribusi ke seluruh Jawa Barat.",
    badgeColor: "bg-gradient-to-r from-red-500 to-red-600",
    image: "/api/placeholder/400/300",
  },
  {
    id: "2017-innovation",
    name: "ESABOND Innovation",
    year: "2017",
    description:
      "Berpartisipasi dalam pameran internasional pertama dan meraih penghargaan inovasi produk terbaik.",
    badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    image: "/api/placeholder/400/300",
  },
  {
    id: "2008-foundation",
    name: "ESABOND Foundation",
    year: "2008",
    description:
      "Pendirian perusahaan dan awal produksi batch pertama dengan fokus pada pasar lokal B2B yang solid.",
    badgeColor: "bg-gradient-to-r from-green-600 to-emerald-600",
    image: "/api/placeholder/400/300",
  },
];

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

const TimelineCardSkeleton = ({ isLeft }) => {
  const containerClasses = isLeft
    ? "lg:flex-row-reverse lg:text-right"
    : "lg:flex-row lg:text-left";

  return (
    <div
      className={`flex flex-col gap-4 ${containerClasses} mb-12 lg:mb-16 animate-pulse`}
    >
      {/* Image Skeleton */}
      <div className="w-full lg:w-1/2 lg:px-6">
        <div className="aspect-video w-full bg-gray-200 rounded-2xl" />
      </div>

      {/* Content Skeleton */}
      <div className="w-full lg:w-1/2 lg:px-6 space-y-3">
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TIMELINE COMPONENTS
// ============================================================================

const TimelineLine = () => (
  <div
    className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 transform -translate-x-1/2"
    aria-hidden="true"
  />
);

const TimelineMarker = ({ badgeColor, year }) => (
  <div className="hidden lg:flex absolute left-1/2 top-8 transform -translate-x-1/2 z-10 items-center justify-center">
    <div
      className={`w-12 h-12 ${badgeColor} rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold transition-transform duration-300 hover:scale-110`}
    >
      {year.slice(-2)}
    </div>
  </div>
);

const TimelineImage = ({ src, alt, isLeft }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg group">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        } group-hover:scale-105`}
        onLoad={() => setIsLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const TimelineCard = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const containerClasses = isLeft
    ? "lg:flex-row-reverse lg:text-right"
    : "lg:flex-row lg:text-left";

  const contentClasses = isLeft ? "lg:items-end" : "lg:items-start";

  return (
    <article
      className={`relative flex flex-col gap-6 ${containerClasses} mb-12 lg:mb-20 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      aria-labelledby={`timeline-${item.id}`}
    >
      <TimelineMarker badgeColor={item.badgeColor} year={item.year} />

      {/* Image Section */}
      <div className="w-full lg:w-1/2 lg:px-8">
        <TimelineImage
          src={item.image}
          alt={`${item.name} - ${item.year}`}
          isLeft={isLeft}
        />
      </div>

      {/* Content Section */}
      <div
        className={`w-full lg:w-1/2 lg:px-8 flex flex-col ${contentClasses} space-y-4`}
      >
        {/* Year Badge */}
        <div
          className={`inline-flex ${isLeft ? "lg:self-end" : "lg:self-start"}`}
        >
          <span
            className={`${item.badgeColor} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg tracking-wider uppercase`}
          >
            {item.year}
          </span>
        </div>

        {/* Title */}
        <h3
          id={`timeline-${item.id}`}
          className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
        >
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
          {item.description}
        </p>

        {/* Decorative Line */}
        <div
          className={`w-16 h-1 ${item.badgeColor} rounded-full ${
            isLeft ? "lg:self-end" : "lg:self-start"
          }`}
          aria-hidden="true"
        />
      </div>
    </article>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function History() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const timelineData = t("history.timeline");
  const timelineItems = Array.isArray(timelineData) ? timelineData : [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative bg-gradient-to-b from-gray-50 to-white min-h-screen py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="timeline-heading"
    >
      {/* ================= HEADER ================= */}
      <header className="text-center mb-20 lg:mb-24">
        <h1
          id="timeline-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight"
        >
          {t("history.header.title")}
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
          {t("history.header.subtitle")}
        </p>
        <div
          className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"
          aria-hidden="true"
        />
      </header>

      {/* ================= TIMELINE ================= */}
      <div className="relative max-w-7xl mx-auto">
        <TimelineLine />

        {isLoading ? (
          <div role="status" aria-label="Loading timeline">
            {Array.from({ length: 3 }).map((_, index) => (
              <TimelineCardSkeleton
                key={`skeleton-${index}`}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {timelineItems.map((item, index) => (
              <TimelineCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* ================= BACKGROUND DECOR ================= */}
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
        aria-hidden="true"
      />
    </section>
  );
}
