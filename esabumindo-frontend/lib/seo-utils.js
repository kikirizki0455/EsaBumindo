/**
 * SEO Utilities untuk auto-generate metadata dan structured data
 * Untuk optimasi SEO yang konsisten dan otomatis
 */

// ✅ Base configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://esabumindo.com";
const SITE_NAME = "Esabumindo Chemical Adhesive";
const DEFAULT_DESCRIPTION =
  "Solusi adhesive berkualitas tinggi untuk berbagai kebutuhan industri Indonesia";

/**
 * Generate meta tags untuk halaman
 */
export function generatePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image = `${BASE_URL}/og-image.png`,
  url = BASE_URL,
  type = "website",
  author = "Esabumindo",
  keywords = "adhesive, lem, industrial glue, esabumindo",
  locale = "id_ID",
} = {}) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords,
    author,
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    themeColor: "#0c439a",

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      type,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
      locale,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      image,
      creator: "@esabumindo",
    },

    // Additional
    canonical: url,
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  };
}

/**
 * Generate Article/Blog metadata
 */
export function generateArticleMeta({
  title,
  description,
  image,
  author,
  publishedAt,
  modifiedAt,
  url,
  tags = [],
  readingTime = 1,
} = {}) {
  return {
    ...generatePageMeta({
      title,
      description,
      image,
      url,
      type: "article",
      author,
      keywords: tags.join(", "),
    }),
    article: {
      publishedTime: publishedAt,
      modifiedTime: modifiedAt || publishedAt,
      authors: [author],
      tags,
    },
    extra: {
      readingTime,
    },
  };
}

/**
 * Generate Product metadata
 */
export function generateProductMeta({
  title,
  description,
  image,
  price,
  availability = "https://schema.org/InStock",
  url,
  sku,
  category,
} = {}) {
  return {
    ...generatePageMeta({
      title,
      description,
      image,
      url,
      type: "product",
      keywords: `${category}, product, adhesive, ${title}`,
    }),
    product: {
      sku,
      availability,
      price,
      category,
    },
  };
}

/**
 * Generate JSON-LD Structured Data untuk Article
 */
export function generateArticleStructuredData({
  title,
  description,
  image,
  author,
  publishedAt,
  modifiedAt,
  url,
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
        width: 250,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/**
 * Generate JSON-LD untuk Product
 */
export function generateProductStructuredData({
  title,
  description,
  image,
  price,
  currency = "IDR",
  sku,
  availability = "https://schema.org/InStock",
  rating,
  url,
} = {}) {
  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image: Array.isArray(image) ? image : [image],
    sku,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price,
      availability,
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: BASE_URL,
      },
    },
  };

  if (rating) {
    structured.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      reviewCount: rating.reviewCount,
    };
  }

  return structured;
}

/**
 * Generate JSON-LD untuk Organization
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://www.facebook.com/esabumindo",
      "https://www.instagram.com/esabumindo",
      "https://www.linkedin.com/company/esabumindo",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+62-21-1234-5678",
      email: "info@esabumindo.com",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Contoh No. 123",
      addressLocality: "Jakarta",
      addressRegion: "DKI Jakarta",
      postalCode: "12345",
      addressCountry: "ID",
    },
  };
}

/**
 * Generate Sitemap entry
 */
export function generateSitemapEntry({
  url,
  changefreq = "weekly",
  priority = 0.7,
  lastmod = new Date().toISOString(),
} = {}) {
  return {
    loc: url,
    lastmod,
    changefreq,
    priority,
  };
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(pathname, locale = "id") {
  const cleanPath = pathname.replace(/^\/+/, "");
  if (locale === "id" || !locale) {
    return `${BASE_URL}/${cleanPath}`;
  }
  return `${BASE_URL}/${locale}/${cleanPath}`;
}

/**
 * Optimize image URL untuk SEO (alt text, title)
 */
export function generateImageAttributes({
  src,
  alt,
  title,
  width,
  height,
  loading = "lazy",
  decoding = "async",
} = {}) {
  return {
    src,
    alt: alt || "Image",
    title: title || alt,
    width,
    height,
    loading,
    decoding,
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(breadcrumbs = []) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    ...breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      item: item.url,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Performance: Check rendering time
 */
export function measureRenderTime(componentName, callback) {
  const startTime = performance.now();

  const result = callback();

  const endTime = performance.now();
  const renderTime = endTime - startTime;

  if (renderTime > 5) {
    console.warn(
      `⚠️ ${componentName} took ${renderTime.toFixed(
        2
      )}ms to render (target: <5ms)`
    );
  } else {
    console.log(`✅ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /login
Disallow: /*.json$
Disallow: /*?*

Sitemap: ${BASE_URL}/sitemap.xml
Crawl-delay: 1`;
}

export default {
  generatePageMeta,
  generateArticleMeta,
  generateProductMeta,
  generateArticleStructuredData,
  generateProductStructuredData,
  generateOrganizationStructuredData,
  generateSitemapEntry,
  getCanonicalUrl,
  generateImageAttributes,
  generateBreadcrumbSchema,
  generateFAQSchema,
  measureRenderTime,
  generateRobotsTxt,
};
