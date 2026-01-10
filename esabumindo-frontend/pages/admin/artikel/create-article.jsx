// pages/admin/artikel/buat.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Eye,
  HelpCircle,
  Link as LinkIcon,
} from "lucide-react";
import { generateSlug } from "@/lib/utils";
import axios from "axios";

export default function CreateArticle() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    author: "",
    status: "draft",
  });
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (isEdit && id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      setFormData(response.data);
      setAutoSlug(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("Gagal memuat artikel");
    }
  };

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

    if (!formData.title.trim()) {
      alert("Judul artikel wajib diisi");
      return;
    }

    if (!formData.content.trim()) {
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
        ...formData,
        status: status || formData.status,
        publishedAt: status === "published" ? new Date().toISOString() : null,
      };

      if (isEdit) {
        await axios.put(`/api/articles/${id}`, dataToSubmit);
        alert("Artikel berhasil diperbarui!");
      } else {
        await axios.post("/api/articles", dataToSubmit);
        alert("Artikel berhasil dibuat!");
      }

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Artikel" : "Buat Artikel Baru"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Perbarui konten artikel yang sudah ada"
                : "Isi form di bawah untuk membuat artikel baru"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                  Tulis judul artikel yang menarik dan deskriptif. Judul akan
                  otomatis diubah menjadi URL/slug.
                </div>
              </div>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Contoh: Tips Memilih Lem Terbaik untuk Proyek Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              required
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                  Slug adalah URL unik untuk artikel ini. Otomatis dibuat dari
                  judul, tapi bisa diedit manual.
                </div>
              </div>
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="tips-memilih-lem-terbaik"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Preview URL:{" "}
              <span className="font-mono text-primary">
                https://esabumindo.com/artikel/{formData.slug || "url-anda"}
              </span>
            </p>
          </div>

          {/* Author */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Penulis <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Contoh: Tim Esabumindo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Ringkasan Artikel
              </label>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                  Ringkasan singkat artikel yang akan muncul di halaman daftar
                  artikel. Opsional.
                </div>
              </div>
            </div>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Tuliskan ringkasan singkat artikel ini (opsional)..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                URL Gambar Cover
              </label>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                  Masukkan URL gambar cover artikel. Bisa dikosongi jika tidak
                  ada.
                </div>
              </div>
            </div>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="https://example.com/gambar.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Konten Artikel <span className="text-red-500">*</span>
              </label>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                  Tulis konten lengkap artikel di sini. Gunakan format yang
                  jelas dan mudah dibaca.
                </div>
              </div>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Tuliskan konten artikel lengkap di sini..."
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-sans"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.content.length} karakter
            </p>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Simpan sebagai Draft"}
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "published")}
                disabled={loading}
                variant="secondary"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Publikasikan Artikel"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              <span className="font-medium">Tips:</span> Simpan sebagai draft
              terlebih dahulu untuk review, atau langsung publikasikan jika
              sudah yakin.
            </p>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
