import dynamic from "next/dynamic";
import { Suspense } from "react";
import MainLayout from "./layouts/main-layout";

// Dynamic imports dengan strategi optimal
// Hero component dengan SSR diaktifkan (above the fold)
const HeroCarousel = dynamic(() => import("@/components/home/hero"), {
  loading: () => (
    <div className="relative h-screen min-h-[600px] w-full bg-gradient-to-b from-gray-300 to-gray-200 animate-pulse" />
  ),
  ssr: true,
});

// Below-the-fold components dengan SSR dinonaktifkan untuk performa lebih cepat
const HomeSection = dynamic(
  () =>
    import("@/components/home/home-section").then((mod) => ({
      default: mod.HomeSection,
    })),
  {
    loading: () => <HomeSectionSkeleton />,
    ssr: false,
  }
);

const ProductSection = dynamic(
  () =>
    import("@/components/home/product-section").then((mod) => ({
      default: mod.ProductSection,
    })),
  {
    loading: () => <ProductSectionSkeleton />,
    ssr: false,
  }
);

const LevelSection = dynamic(
  () =>
    import("@/components/home/level-section").then((mod) => ({
      default: mod.LevelSection,
    })),
  {
    loading: () => <LevelSectionSkeleton />,
    ssr: false,
  }
);

// Minimal skeleton component untuk HomeSection
function HomeSectionSkeleton() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="h-12 bg-gray-200 rounded-full w-48 animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 bg-gray-300 rounded animate-pulse" />
              <div className="h-12 bg-gray-300 rounded animate-pulse w-5/6" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
          </div>
          <div className="bg-gray-300 h-[500px] rounded-3xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// Minimal skeleton component untuk ProductSection
function ProductSectionSkeleton() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-[#edebeb] to-[#edebeb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 lg:mb-16 space-y-4">
          <div className="h-10 bg-gray-300 rounded-full w-32 mx-auto animate-pulse" />
          <div className="h-12 bg-gray-300 rounded w-2/3 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl h-64 animate-pulse" />
            <div className="h-48 bg-gray-300 rounded-2xl animate-pulse" />
          </div>
          <div className="bg-gray-300 h-[450px] rounded-3xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// Minimal skeleton component untuk LevelSection
function LevelSectionSkeleton() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
          <div className="bg-gray-300 h-[480px] rounded-3xl animate-pulse" />
          <div className="space-y-6 md:space-y-8">
            <div className="h-10 bg-gray-300 rounded-full w-32 animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 bg-gray-300 rounded animate-pulse" />
              <div className="h-12 bg-gray-300 rounded animate-pulse w-5/6" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <Suspense fallback={null}>
        <HeroCarousel />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton />}>
        <HomeSection />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <ProductSection />
      </Suspense>

      <Suspense fallback={<LevelSectionSkeleton />}>
        <LevelSection />
      </Suspense>
    </MainLayout>
  );
}

// Metadata untuk SEO
export const metadata = {
  title: "Esabumindo - Solusi Adhesive Terbaik Indonesia",
  description:
    "Temukan solusi adhesive berkualitas tinggi dari Esabumindo untuk berbagai kebutuhan industri Anda.",
  keywords: "adhesive, lem, industrial glue, esabumindo",
  openGraph: {
    title: "Esabumindo - Solusi Adhesive Terbaik Indonesia",
    description:
      "Temukan solusi adhesive berkualitas tinggi dari Esabumindo untuk berbagai kebutuhan industri Anda.",
    type: "website",
    url: "https://esabumindo.com",
    images: [
      {
        url: "https://esabumindo.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Esabumindo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Esabumindo - Solusi Adhesive Terbaik Indonesia",
    description:
      "Temukan solusi adhesive berkualitas tinggi dari Esabumindo untuk berbagai kebutuhan industri Anda.",
  },
};
