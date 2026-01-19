"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  // Gunakan URL Backend dari env, hapus '/api' jika ada
  const getFullImageUrl = (path) => {
    if (!path) return "/images/placeholder-article.jpg";
    if (path.startsWith("http")) return path;

    // 1. Pastikan variabel ini ada di file .env.local Anda
    // 2. Jika variabel env kosong/undefined, kita beri fallback manual ke localhost:3001
    const apiHost = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://localhost:3001";

    return `${apiHost}${path}`;
  };

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/slug/${slug}`
      );
      if (!response.ok) {
        router.push("/article");
        return;
      }
      const data = await response.json();
      setArticle(data);

      const relatedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/published`
      );
      const allArticles = await relatedRes.json();
      setRelatedArticles(
        allArticles.filter((a) => a.slug !== slug).slice(0, 3)
      );
    } catch (error) {
      console.error("Error:", error);
      router.push("/article");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
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
      alert("Link artikel berhasil disalin!");
    }
  };

  if (loading || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#060771] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(article.content.split(/\s+/).length / 200);
  const publishDate = new Date(article.publishedAt || article.createdAt);

  return (
    <MainLayout>
      {/* Sticky Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/article")}
            className="text-[#060771] hover:bg-gray-100 -ml-2 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Kembali ke Artikel</span>
            <span className="sm:hidden">Kembali</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-[#060771] hover:bg-gray-100 font-semibold"
          >
            <Share2 className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Bagikan</span>
          </Button>
        </div>
      </nav>

      <article className="bg-white">
        {/* Header Section */}
        <header className="bg-gradient-to-b from-gray-50 to-white pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center bg-[#ff4136] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                <BookOpen className="w-3 h-3 mr-1.5" />
                Artikel
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#060771] to-[#0808a0] flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {article.author?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    Penulis
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
                <Calendar className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    Tanggal
                  </span>
                  <time className="text-sm font-semibold">
                    {publishDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-gray-200" />

              {/* Reading Time */}
              <div className="flex items-center gap-2 text-[#ff4136]">
                <Clock className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    Waktu Baca
                  </span>
                  <span className="text-sm font-bold">{readingTime} Menit</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="w-full bg-gray-100">
            <div className="container mx-auto px-4 max-w-5xl py-8">
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl shadow-2xl bg-gray-200">
                <Image
                  src={getFullImageUrl(article.coverImage)}
                  alt={article.title}
                  fill
                  className="object-cover"
                  unoptimized // TAMBAHKAN INI
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
              prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[17px] md:prose-p:text-[18px]
              prose-a:text-[#060771] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#ff4136]
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-[#060771] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:my-2 prose-li:text-[17px]
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
              prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#060771] prose-code:font-mono prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Share Section */}
        <div className="container mx-auto px-4 max-w-3xl pb-12">
          <div className="bg-gradient-to-r from-[#060771] to-[#0808a0] rounded-2xl p-8 text-center shadow-xl">
            <h3 className="text-white text-xl font-bold mb-3">
              Bagikan Artikel Ini
            </h3>
            <p className="text-white/80 text-sm mb-6">
              Jika artikel ini bermanfaat, bagikan kepada teman-teman Anda
            </p>
            <Button
              onClick={handleShare}
              className="bg-[#ff4136] hover:bg-[#d9362b] text-white font-bold px-8 py-3 rounded-lg shadow-lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Bagikan Sekarang
            </Button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-8 bg-[#ff4136] rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Artikel Terkait Lainnya
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#060771] transition-all shadow-sm hover:shadow-xl h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-gray-200">
                    <Image
                      src={getFullImageUrl(item.coverImage)}
                      alt={item.title}
                      fill
                      // 2. Tambahkan unoptimized agar tidak kena error 400 di localhost
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
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
                        Baca Selengkapnya
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
    </MainLayout>
  );
}
