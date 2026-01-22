"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MainLayout from "../layouts/main-layout";
import api from "@/lib/axios";
import { LazyImage } from "@/components/article/lazy-image";
import {
  ArticleCardSkeleton,
  FeaturedArticleSkeleton,
} from "@/components/article/article-skeleton";
import { useArticleTranslation } from "@/hooks/use-article-translation";

const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export default function ArticlesPage() {
  const { t, lang } = useArticleTranslation();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Optimized image URL getter
  const getImageUrl = useCallback((path) => {
    if (!path) return "/images/placeholder-article.jpg";
    if (path.startsWith("http")) return path;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const baseUrl = apiUrl.replace("/api", "");

    if (path.startsWith("/")) {
      return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${path}`;
  }, []);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/articles/published");
      setArticles(data || []);

      // Cache to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "articlesCache",
          JSON.stringify({
            data: data || [],
            timestamp: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError(t("error.loadFailed")); // ✅ Pakai translation

      // Fallback ke cache
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("articlesCache");
        if (cached) {
          try {
            const { data } = JSON.parse(cached);
            setArticles(data);
            setError(null);
          } catch (e) {
            setArticles([]);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [t]); // ✅ Add t to dependency

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchArticles();
    }
  }, [fetchArticles]);

  // Filtering
  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [articles, search]);

  const featuredArticle = useMemo(
    () => filteredArticles[0] || null,
    [filteredArticles]
  );

  const otherArticles = useMemo(
    () => filteredArticles.slice(1),
    [filteredArticles]
  );

  // SEO Meta Tags
  const pageTitle = search
    ? `${t("search.resultsFor")} "${search}" - ${t("page.title")} | Esabumindo`
    : `${t("page.title")} | Esabumindo Chemical Adhesive`;

  const pageDescription =
    search && filteredArticles.length > 0
      ? `${t("search.resultsFor")} "${search}" - ${filteredArticles.length} ${
          lang === "en" ? "articles" : "artikel"
        }`
      : t("page.metaDescription");

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`${
            process.env.NEXT_PUBLIC_BASE_URL || "https://esabumindo.com"
          }/article`}
        />
      </Head>

      <MainLayout>
        {/* Hero Section - ✅ Translated */}
        <section className="bg-linear-to-r from-[#060771] to-[#0a0a9e] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("page.title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                {t("page.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar - ✅ Translated */}
        <section className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white rounded-xl shadow-lg p-2">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={t("search.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 border-0 text-lg focus-visible:ring-0"
                aria-label={t("search.label")}
              />
            </div>
          </div>
        </section>

        {/* Error Message - ✅ Translated */}
        {error && (
          <section className="container mx-auto px-4 md:px-6 py-8">
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          </section>
        )}

        {/* Featured Article */}
        {loading && !featuredArticle ? (
          <section className="container mx-auto px-4 md:px-6 py-12">
            <FeaturedArticleSkeleton />
          </section>
        ) : (
          featuredArticle && (
            <section className="container mx-auto px-4 md:px-6 py-12">
              <Link href={`/article/${featuredArticle.slug}`}>
                <div className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 md:h-full overflow-hidden bg-gray-100">
                      <LazyImage
                        src={getImageUrl(featuredArticle.coverImage)}
                        alt={featuredArticle.title}
                        fill
                        priority={true}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        {/* ✅ Badge Translated */}
                        <span className="bg-[#ff4136] text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {t("badge.new")}
                        </span>
                      </div>
                    </div>

                    {/* Content - ❌ Article content TIDAK ditranslate */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-col gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <time dateTime={featuredArticle.publishedAt}>
                            {new Date(
                              featuredArticle.publishedAt
                            ).toLocaleDateString(
                              lang === "en" ? "en-US" : "id-ID",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </time>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 shrink-0" />
                          {featuredArticle.author}
                        </div>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#060771] transition-colors line-clamp-3">
                        {featuredArticle.title}
                      </h2>

                      {featuredArticle.excerpt && (
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                      )}

                      {/* ✅ Button Translated */}
                      <div className="flex items-center gap-2 text-[#060771] font-semibold group-hover:gap-4 transition-all">
                        {t("card.readMore")}
                        <ArrowRight className="w-5 h-5 shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )
        )}

        {/* Other Articles Grid */}
        <section className="container mx-auto px-4 md:px-6 pb-20">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : otherArticles.length === 0 ? (
            // ✅ Empty State Translated
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {search
                  ? `${t("empty.noResults")} "${search}"`
                  : t("empty.tryAgain")}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <LazyImage
                        src={getImageUrl(article.coverImage)}
                        alt={article.title}
                        fill
                        priority={idx < 3}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Date & Author - ❌ TIDAK ditranslate */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString(
                              lang === "en" ? "en-US" : "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </time>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 shrink-0" />
                          {article.author}
                        </div>
                      </div>

                      {/* Title & Excerpt - ❌ TIDAK ditranslate */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#060771] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>
                      )}

                      {/* ✅ Button Translated */}
                      <div className="flex items-center gap-2 text-[#060771] font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                        {t("card.readMore")}
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </MainLayout>
    </>
  );
}
