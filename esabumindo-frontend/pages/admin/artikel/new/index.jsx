// pages/admin/artikel/buat.jsx - UPDATED WITH BLOCK EDITOR

import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/admin-layout";
import BlockEditor from "@/components/editor/block-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Save,
  Eye,
  HelpCircle,
  Link as LinkIcon,
} from "lucide-react";
import { generateSlug } from "@/lib/utils";
import api from "@/lib/axios";

export default function CreateArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "",
    author: "",
    status: "draft",
    contentBlocks: [], // ✅ NEW: Array of content blocks
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from title
    if (name === "title" && autoSlug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSlugChange = (e) => {
    setAutoSlug(false);
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(e.target.value),
    }));
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert("Judul artikel wajib diisi");
      return;
    }

    if (formData.contentBlocks.length === 0) {
      alert("Konten artikel wajib diisi");
      return;
    }

    if (!formData.author.trim()) {
      alert("Nama penulis wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        author: formData.author,
        status: status || formData.status,
        contentBlocks: formData.contentBlocks, // ✅ Kirim blocks
        // publishedAt: status === "published" ? new Date().toISOString() : null,
      };

      await api.post("/articles", dataToSubmit);
      alert("Artikel berhasil dibuat!");
      router.push("/admin/artikel");
    } catch (error) {
      console.error("Error saving article:", error);
      alert(error.response?.data?.message || "Gagal menyimpan artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Buat Artikel Baru
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gunakan block editor untuk membuat artikel dengan layout custom
            </p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Contoh: Tips Memilih Lem Terbaik untuk Proyek Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771] text-lg"
              required
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-xs text-[#ff4136]"
              >
                {autoSlug ? "⚡ Auto ON" : "Edit Manual"}
              </Button>
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="tips-memilih-lem-terbaik"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771] font-mono text-sm"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Preview URL:{" "}
              <span className="font-mono text-[#060771]">
                /artikel/{formData.slug || "url-anda"}
              </span>
            </p>
          </div>

          {/* Author */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Penulis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Contoh: Tim Esabumindo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771]"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Ringkasan Artikel
              </label>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                  Ringkasan singkat yang akan muncul di preview artikel
                </div>
              </div>
            </div>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Tuliskan ringkasan singkat artikel ini..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771] resize-none"
            />
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Gambar Cover
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="https://example.com/gambar.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771]"
            />
          </div>

          {/* ✅ BLOCK EDITOR - MAIN CONTENT */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-[#060771] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  📝 Konten Artikel <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Tambahkan paragraf, heading, dan gambar. Atur layout sesuai
                  kebutuhan Anda.
                </p>
              </div>
            </div>

            <BlockEditor
              blocks={formData.contentBlocks}
              onChange={(blocks) =>
                setFormData({ ...formData, contentBlocks: blocks })
              }
            />

            {formData.contentBlocks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">
                  👆 Klik tombol di atas untuk mulai menambahkan konten
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-[#060771] rounded-xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/30"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Simpan sebagai Draft"}
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "published")}
                disabled={loading}
                className="flex-1 bg-[#ff4136] hover:bg-[#d9362b] text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Publikasikan Artikel"}
              </Button>
            </div>
            <p className="text-white/60 text-xs mt-4 text-center">
              {formData.contentBlocks.length} block telah ditambahkan
            </p>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
