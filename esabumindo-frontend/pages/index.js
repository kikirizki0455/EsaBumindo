import dynamic from "next/dynamic";
import { Suspense } from "react";
import Head from "next/head";
import MainLayout from "./layouts/main-layout";
import {
  generatePageMeta,
  generateOrganizationStructuredData,
  generateBreadcrumbSchema,
} from "@/lib/seo-utils";

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

// ✅ SEO Meta Data
const seoMeta = generatePageMeta({
  title: "Esabumindo - Solusi Adhesive Terbaik Indonesia",
  description:
    "Temukan solusi adhesive berkualitas tinggi dari Esabumindo untuk berbagai kebutuhan industri Anda. Produk kami telah dipercaya oleh ribuan industri di Indonesia.",
  keywords:
    "adhesive, lem, industrial glue, chemical adhesive, solusi adhesive, lem berkualitas",
  image: "https://esabumindo.com/og-home.png",
  url: "https://esabumindo.com",
  type: "website",
});

// ✅ Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema([]);

// ✅ Organization Schema
const organizationSchema = generateOrganizationStructuredData();

export default function Home() {
  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <meta name="author" content={seoMeta.author} />
        <meta name="viewport" content={seoMeta.viewport} />
        <meta name="theme-color" content={seoMeta.themeColor} />
        <meta name="robots" content={seoMeta.robots} />

        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.openGraph.title} />
        <meta
          property="og:description"
          content={seoMeta.openGraph.description}
        />
        <meta property="og:type" content={seoMeta.openGraph.type} />
        <meta property="og:url" content={seoMeta.openGraph.url} />
        <meta property="og:image" content={seoMeta.openGraph.images[0].url} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={seoMeta.openGraph.siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta
          name="twitter:description"
          content={seoMeta.twitter.description}
        />
        <meta name="twitter:image" content={seoMeta.twitter.image} />

        {/* Canonical */}
        <link rel="canonical" href={seoMeta.canonical} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

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
    </>
  );
}
