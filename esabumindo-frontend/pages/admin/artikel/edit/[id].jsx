// pages/admin/artikel/edit/[id].jsx - UPDATED

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/admin-layout";
import BlockEditor from "@/components/editor/block-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Link as LinkIcon, Loader2 } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import api from "@/lib/axios";

export default function EditArticle() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [autoSlug, setAutoSlug] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "",
    author: "",
    status: "draft",
    contentBlocks: [], // ✅ NEW
  });

  useEffect(() => {
    if (!router.isReady) return;
    fetchArticle();
  }, [router.isReady]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/articles/${id}`);
      const data = response.data;

      setFormData({
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        author: data.author,
        status: data.status,
        contentBlocks: data.contentBlocks || [], // ✅ Load blocks
      });
    } catch (error) {
      console.error(error);
      alert("Artikel tidak ditemukan");
      router.push("/admin/artikel");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const handleSubmit = async (e, nextStatus) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      formData.contentBlocks.length === 0 ||
      !formData.author.trim()
    ) {
      alert("Field bertanda (*) wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        author: formData.author,
        status: nextStatus || formData.status,
        contentBlocks: formData.contentBlocks, // ✅ Send blocks
      };

      // Slug only if draft
      if (formData.status === "draft") {
        payload.slug = formData.slug;
      }

      await api.put(`/articles/${id}`, payload);

      alert("Artikel berhasil diperbarui!");
      router.push("/admin/artikel");
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.message || "Gagal memperbarui artikel");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#060771]" />
          <p className="text-gray-500 font-medium">Memuat data artikel...</p>
        </div>
      </AdminLayout>
    );
  }

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
              Edit Artikel
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID: <span className="font-mono">{id}</span>
            </p>
          </div>
        </div>

        <form className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul Artikel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771] text-lg"
              required
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                disabled={formData.status !== "draft"}
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
                disabled={formData.status !== "draft"}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg font-mono text-sm ${
                  formData.status !== "draft"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-300"
                }`}
                required
              />
            </div>
            {formData.status !== "draft" && (
              <p className="text-xs text-orange-600 mt-2">
                ⚠️ Slug tidak dapat diubah setelah artikel dipublikasikan
              </p>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#060771]"
              required
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

          {/* Excerpt */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ringkasan (Excerpt)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#060771]"
            />
          </div>

          {/* ✅ BLOCK EDITOR */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-[#060771] p-6 shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                📝 Konten Artikel <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Edit konten dengan block editor
              </p>
            </div>

            <BlockEditor
              blocks={formData.contentBlocks}
              onChange={(blocks) =>
                setFormData({ ...formData, contentBlocks: blocks })
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-[#060771] rounded-xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={loading}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/30"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Update sebagai Draft"}
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "published")}
                disabled={loading}
                className="flex-1 bg-[#ff4136] hover:bg-[#d9362b] text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Update & Publikasikan"}
              </Button>
            </div>
            <p className="text-white/60 text-xs mt-4 text-center">
              Status:{" "}
              <span className="uppercase font-bold">{formData.status}</span> •{" "}
              {formData.contentBlocks.length} block
            </p>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
