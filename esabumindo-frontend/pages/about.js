import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import MainLayout from "./layouts/main-layout";
import {
  generatePageMeta,
  generateOrganizationStructuredData,
  generateBreadcrumbSchema,
} from "@/lib/seo-utils";

// Dynamic imports dengan lazy loading - below the fold components
const HeroSection = dynamic(() => import("@/components/hero-section"), {
  ssr: true,
  loading: () => (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="lg:w-1/2 h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </section>
  ),
});

const History = dynamic(() => import("@/components/about/history"), {
  ssr: false,
  loading: () => (
    <section className="py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
        </div>
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
});

const CompanyProfil = dynamic(
  () => import("@/components/about/company-profil"),
  {
    ssr: false,
    loading: () => (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </section>
    ),
  }
);

// ✅ SEO Meta Data untuk About Page
const seoMeta = generatePageMeta({
  title: "Tentang Kami - Esabumindo Chemical Adhesive",
  description:
    "Pelajari lebih lanjut tentang Esabumindo. Kami adalah pemimpin industri adhesive dengan pengalaman puluhan tahun melayani kebutuhan industri Indonesia.",
  keywords:
    "tentang esabumindo, perusahaan adhesive, sejarah esabumindo, visi misi, tim profesional",
  image: "https://esabumindo.com/og-about.png",
  url: "https://esabumindo.com/about",
  type: "website",
});

// ✅ Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "About", url: "https://esabumindo.com/about" },
]);

// ✅ Organization Schema
const organizationSchema = generateOrganizationStructuredData();

export default function About() {
  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <meta name="author" content={seoMeta.author} />
        <meta name="viewport" content={seoMeta.viewport} />
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
        <meta property="og:site_name" content={seoMeta.openGraph.siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta
          name="twitter:description"
          content={seoMeta.twitter.description}
        />

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
        <HeroSection />
        <History />
        <CompanyProfil />
      </MainLayout>
    </>
  );
}
