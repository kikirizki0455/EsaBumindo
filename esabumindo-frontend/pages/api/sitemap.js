/**
 * API Route untuk generate Sitemap XML
 * Menggunakan data dari database
 */

import api from "@/lib/axios";
import { generateSitemapEntry } from "@/lib/seo-utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://esabumindo.com";

export default async function handler(req, res) {
  try {
    // Set header untuk XML
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    // Static pages
    const staticPages = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/product", changefreq: "weekly", priority: 0.9 },
      { url: "/about", changefreq: "monthly", priority: 0.8 },
      { url: "/contact", changefreq: "monthly", priority: 0.8 },
      { url: "/article", changefreq: "daily", priority: 0.9 },
    ];

    // Dynamic articles dari API
    let articles = [];
    try {
      const response = await api.get("/articles/published");
      articles = response.data || [];
    } catch (error) {
      console.warn("Gagal fetch articles untuk sitemap:", error.message);
    }

    // Dynamic products dari API
    let products = [];
    try {
      const response = await api.get("/products");
      products = response.data || [];
    } catch (error) {
      console.warn("Gagal fetch products untuk sitemap:", error.message);
    }

    // Build sitemap URLs
    const sitemapEntries = [
      ...staticPages.map((page) =>
        generateSitemapEntry({
          url: `${BASE_URL}${page.url}`,
          changefreq: page.changefreq,
          priority: page.priority,
        })
      ),
      ...articles.map((article) =>
        generateSitemapEntry({
          url: `${BASE_URL}/article/${article.slug}`,
          changefreq: "never",
          priority: 0.7,
          lastmod: article.updatedAt || article.createdAt,
        })
      ),
      ...products.map((product) =>
        generateSitemapEntry({
          url: `${BASE_URL}/product/${product.id}`,
          changefreq: "weekly",
          priority: 0.7,
          lastmod: product.updatedAt || product.createdAt,
        })
      ),
    ];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${sitemapEntries
    .map(
      (entry) => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${new Date(entry.lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
  `
    )
    .join("")}
</urlset>`;

    res.write(xml);
    res.end();
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
}
