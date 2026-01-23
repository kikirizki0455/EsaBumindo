import React, { useState, useEffect } from "react";
import Head from "next/head";
import HeroSection from "@/components/hero-section";
import CompanyProfil from "@/components/about/company-profil";
import Founder from "@/components/about/founder";
import History from "@/components/about/history";
import MainLayout from "./layouts/main-layout";
import {
  generatePageMeta,
  generateOrganizationStructuredData,
  generateBreadcrumbSchema,
} from "@/lib/seo-utils";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Simulate minimal loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Reduced from 2000ms to 100ms untuk performa <5ms

    return () => clearTimeout(timer);
  }, []);

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
        {!loading && (
          <>
            <HeroSection />
            <History />
            <CompanyProfil />
            <Founder />
          </>
        )}
      </MainLayout>
    </>
  );
}
