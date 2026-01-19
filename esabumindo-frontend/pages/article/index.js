// app/articles/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MainLayout from "../layouts/main-layout";
import api from "@/lib/axios";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  // Gunakan URL Backend dari env, hapus '/api' jika ada
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL.replace("/api", "");

  const getImageUrl = (path) => {
    if (!path) return "/images/placeholder-article.jpg"; // Path ini di folder public Frontend
    if (path.startsWith("http")) return path; // Jika sudah URL lengkap
    return `${BASE_URL}${path}`; // Menggabungkan http://localhost:3001 + /uploads/...
  };
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/articles/published");
      console.log("ARTICLES:", data);
      setArticles(data);
    } catch (error) {
      console.error(
        "Error fetching articles:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  return (
    <MainLayout>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-[#060771] to-[#0a0a9e] text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Artikel & Wawasan
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Temukan informasi terbaru, tips, dan panduan seputar industri
                adhesive dan solusi kami.
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="container mx-auto px-4 md:px-6 -mt-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white rounded-xl shadow-lg p-2">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 border-0 text-lg focus-visible:ring-0"
              />
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="container mx-auto px-4 md:px-6 py-12">
            <Link href={`/article/${featuredArticle.slug}`}>
              <div className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <Image
                      src={getImageUrl(featuredArticle.coverImage)} // Gunakan fungsi helper kita tadi
                      alt={featuredArticle.title}
                      fill
                      priority // Tambahkan priority karena ini gambar utama (featured)
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized // Tambahkan ini agar Next.js tidak mencoba memproses gambar di localhost
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#ff4136] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        New Post
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(
                          featuredArticle.publishedAt
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredArticle.author}
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#060771] transition-colors">
                      {featuredArticle.title}
                    </h2>

                    {featuredArticle.excerpt && (
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[#060771] font-semibold group-hover:gap-4 transition-all">
                      Baca Selengkapnya
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Other Articles Grid */}
        <section className="container mx-auto px-4 md:px-6 pb-20">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Memuat artikel...</p>
            </div>
          ) : otherArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">
                {search
                  ? "Artikel tidak ditemukan"
                  : "Belum ada artikel lainnya"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          article.coverImage ||
                          "/images/placeholder-article.jpg"
                        }
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.author}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#060771] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[#060771] font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                        Baca Artikel
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
