// app/article/[slug]/page.jsx - UPDATED

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/pages/layouts/main-layout";
import BlockRenderer from "@/components/article/block-renderer";
import { ArticleDetailSkeleton } from "@/components/article/article-skeleton";
import { LazyImage } from "@/components/article/lazy-image";
import { useArticleTranslation } from "@/hooks/use-article-translation";
import api from "@/lib/axios";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const { t, lang } = useArticleTranslation();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optimized image URL getter dengan better error handling
  const getFullImageUrl = useCallback((path) => {
    if (!path) return "/images/placeholder-article.jpg";

    // Jika sudah full URL, return as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Jika sudah full path dari backend, gunakan langsung
    if (path.startsWith("/uploads/")) {
      const apiHost = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
        : "http://localhost:3001";
      return `${apiHost}${path}`;
    }

    // Fallback ke placeholder jika path invalid
    console.warn(`Invalid image path: ${path}`);
    return "/images/placeholder-article.jpg";
  }, []);

  // Fetch article dengan optimization
  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/articles/slug/${slug}`);
      console.log("Article fetched:", response.data);
      setArticle(response.data);

      // Cache article ke localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `article_${slug}`,
          JSON.stringify({
            data: response.data,
            timestamp: Date.now(),
          })
        );
      }

      // Fetch related articles (async, tidak blocking)
      const relatedRes = await api.get("/articles/published");
      setRelatedArticles(
        relatedRes.data.filter((a) => a.slug !== slug).slice(0, 3)
      );
    } catch (error) {
      console.error("Error:", error);

      // Try loading from cache
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(`article_${slug}`);
        if (cached) {
          try {
            const { data } = JSON.parse(cached);
            setArticle(data);
          } catch (e) {
            router.push("/article");
          }
        } else {
          router.push("/article");
        }
      } else {
        router.push("/article");
      }
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug, fetchArticle]);

  // Handle share dengan optimization
  const handleShare = useCallback(async () => {
    if (!article) return;

    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: url,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert(lang === "en" ? "Link copied!" : "Link berhasil disalin!");
    }
  }, [article, lang]);

  // Calculate reading time dengan memoization
  const readingTime = useMemo(() => {
    if (!article?.contentBlocks || article.contentBlocks.length === 0) return 1;

    let wordCount = 0;
    article.contentBlocks.forEach((block) => {
      if (block.type === "paragraph" || block.type === "heading") {
        wordCount += (block.content || "").split(/\s+/).length;
      }
    });

    return Math.max(1, Math.ceil(wordCount / 200));
  }, [article?.contentBlocks]);

  // Format publish date
  const publishDate = useMemo(() => {
    if (!article) return null;
    return new Date(article.publishedAt || article.createdAt);
  }, [article]);

  // SEO Meta Tags
  const pageTitle = article
    ? `${article.title} | Esabumindo`
    : t("articleDetail.loading");

  const pageDescription = article?.excerpt || t("articleDetail.subtitle");

  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "";

  if (loading || !article) {
    return (
      <>
        <Head>
          <title>{t("articleDetail.loading")} | Esabumindo</title>
        </Head>
        <MainLayout>
          <ArticleDetailSkeleton />
        </MainLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {article.coverImage && (
          <meta
            property="og:image"
            content={getFullImageUrl(article.coverImage)}
          />
        )}
        <meta property="og:site_name" content="Esabumindo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {article.coverImage && (
          <meta
            name="twitter:image"
            content={getFullImageUrl(article.coverImage)}
          />
        )}

        {/* Article Meta */}
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:author" content={article.author} />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Keywords & Author */}
        <meta name="author" content={article.author} />
        <meta
          name="keywords"
          content="adhesive, chemical, industrial, artikel"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.excerpt,
              image: getFullImageUrl(article.coverImage),
              datePublished: article.publishedAt,
              author: {
                "@type": "Person",
                name: article.author,
              },
              publisher: {
                "@type": "Organization",
                name: "Esabumindo",
              },
            }),
          }}
        />
      </Head>

      <MainLayout>
        <article className="bg-white">
          {/* Header Section */}
          <header className="bg-linear-to-b from-gray-50 to-white pt-8 pb-12 md:pt-12 md:pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center bg-[#ff4136] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                  <BookOpen className="w-3 h-3 mr-1.5" />
                  {t("articleDetail.category")}
                </span>
              </div>

              {/* Title - SEO H1 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                  {article.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-6 border-t border-gray-200">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#060771] to-[#0808a0] flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                    {article.author?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      {t("articleDetail.author")}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {article.author}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-gray-200" />

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      {t("articleDetail.date")}
                    </span>
                    <time
                      dateTime={article.publishedAt}
                      className="text-sm font-semibold"
                    >
                      {publishDate.toLocaleDateString(
                        lang === "en" ? "en-US" : "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-gray-200" />

                {/* Reading Time */}
                <div className="flex items-center gap-2 text-[#ff4136]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      {t("articleDetail.reading_time")}
                    </span>
                    <span className="text-sm font-bold">
                      {readingTime} {t("articleDetail.reading_time_unit")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image - Lazy Loaded */}
          {article.coverImage && (
            <div className="w-full bg-gray-100">
              <div className="container mx-auto px-4 max-w-5xl py-8">
                <div
                  className="relative w-full overflow-hidden rounded-xl shadow-2xl bg-gray-200"
                  style={{ aspectRatio: "21/9" }}
                >
                  <LazyImage
                    src={getFullImageUrl(article.coverImage)}
                    alt={article.title}
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content Blocks dengan Lazy Loading */}
          <div className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
            <BlockRenderer
              blocks={article.contentBlocks}
              getImageUrl={getFullImageUrl}
            />
          </div>

          {/* Share Section */}
          <div className="container mx-auto px-4 max-w-3xl pb-12">
            <div className="bg-linear-to-r from-[#060771] to-[#0808a0] rounded-2xl p-8 text-center shadow-xl">
              <h3 className="text-white text-xl font-bold mb-3">
                {t("articleDetail.share_article")}
              </h3>
              <p className="text-white/80 text-sm mb-6">
                {t("articleDetail.share_description")}
              </p>
              <Button
                onClick={handleShare}
                className="bg-[#ff4136] hover:bg-[#d9362b] text-white font-bold px-8 py-3 rounded-lg shadow-lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                {t("articleDetail.share_button")}
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles - Lazy Loaded */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 py-16 border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-8 bg-[#ff4136] rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t("articleDetail.relatedArticles")}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={`/article/${item.slug}`}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#060771] transition-all shadow-sm hover:shadow-xl h-full"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-200">
                      <LazyImage
                        src={getFullImageUrl(item.coverImage)}
                        alt={item.title}
                        fill
                        priority={false}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 grow flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#060771] transition-colors line-clamp-2 leading-snug mb-3">
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t("articleDetail.read_more")}
                        </span>
                        <ChevronRight className="w-5 h-5 text-[#ff4136] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Articles Button - Footer */}
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/article")}
              className="text-[#060771] border-[#060771] hover:bg-[#060771] hover:text-white font-semibold transition-colors w-full sm:w-auto"
              aria-label={t("articleDetail.back_to_articles")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("articleDetail.back_to_articles")}
            </Button>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
