// app/admin/articles/new/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import TiptapEditor from "@/components/editor/tiptap-editor";
import ImageUpload from "@/components/ui/image-upload";
import { ArrowLeft, Save } from "lucide-react";
import { getCurrentUserName } from "@/lib/auth";
import api from "@/lib/axios";

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "", // Nanti ambil dari session/auth
    status: "draft",
  });

  // Auto-generate slug preview
  const generateSlugPreview = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const author = getCurrentUserName();

      const response = await api.post("/articles", {
        ...formData,
        author,
      });

      // axios → data langsung di response.data
      console.log(response.data);

      alert("Artikel berhasil dibuat!");
      router.push("/admin/artikel");
    } catch (error) {
      console.error("CREATE ARTICLE ERROR:", error);

      alert(error.response?.data?.message || "Gagal membuat artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/articles")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Artikel Baru
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Buat artikel baru untuk website Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Judul Artikel <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul artikel..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                {formData.title && (
                  <p className="text-xs text-gray-500">
                    🔗 URL Preview: /articles/
                    <span className="font-mono text-blue-600">
                      {generateSlugPreview(formData.title)}
                    </span>
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                <Input
                  id="excerpt"
                  placeholder="Ringkasan singkat artikel..."
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  📝 Maks. 160 karakter untuk SEO meta description
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) =>
                  setFormData({ ...formData, coverImage: url })
                }
                alt={formData.title || "Article cover"}
              />
            </CardContent>
          </Card>

          {/* Content Card */}
          <Card className="border-slate-300 shadow-md bg-white overflow-hidden">
            {/* Header dengan Background Kontras */}
            <CardHeader className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 md:px-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-base md:text-lg font-bold text-slate-900">
                    Konten Artikel
                  </CardTitle>
                  <span className="text-red-600 font-bold" aria-hidden="true">
                    *
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-500">
                  Isi konten utama artikel Anda di bawah ini.
                </p>
              </div>
            </CardHeader>

            {/* Area Editor dengan Kontras Tinggi */}
            <CardContent className="p-0 bg-slate-100/30">
              <div className="m-2 md:m-4 rounded-md border border-slate-300 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                <TiptapEditor
                  content={formData.content}
                  onChange={(html) =>
                    setFormData({ ...formData, content: html })
                  }
                  className="min-h-[300px] md:min-h-[500px] p-4 md:p-6 outline-none"
                />
              </div>
            </CardContent>

            {/* Footer Mobile Responsive */}
            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Draft Tersimpan Otomatis
                </span>
              </div>

              <div className="text-[10px] md:text-xs text-slate-400">
                {formData.content?.replace(/<[^>]*>/g, "").length || 0} Karakter
              </div>
            </CardFooter>
          </Card>

          {/* Publish Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status Artikel
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.status === "published"
                      ? "✅ Artikel akan langsung tampil di website"
                      : "📝 Artikel disimpan sebagai draft"}
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status === "published"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "published" : "draft",
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-white p-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/articles")}
              disabled={loading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#060771] hover:bg-[#060771]/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Artikel"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
