// app/admin/articles/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/layout/admin-layout";
import api from "@/lib/axios";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/articles");
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    try {
      const response = await api(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Artikel berhasil dihapus!");
        fetchArticles();
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Gagal menghapus artikel!");
    }
  };

  const togglePublish = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/toggle-publish`,
        { method: "PATCH" }
      );

      if (response.ok) {
        alert("Status artikel berhasil diubah!");
        fetchArticles();
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
      alert("Gagal mengubah status artikel!");
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Artikel
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola artikel website Anda dengan mudah
            </p>
          </div>

          <Button
            onClick={() => router.push("/admin/artikel/new")}
            className="bg-[#ff4136] hover:bg-[#ff4136]/90 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Artikel
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Articles List */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Memuat artikel...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {search
                      ? "Artikel tidak ditemukan"
                      : "Belum ada artikel. Klik 'Tambah Artikel' untuk membuat artikel pertama."}
                  </p>
                  {!search && (
                    <Button
                      onClick={() => router.push("/admin/articles/new")}
                      className="bg-[#060771] hover:bg-[#060771]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Artikel
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <span className="text-xs">🔗 /{article.slug}</span>
                          <span className="mx-2">•</span>
                          <span className="text-xs">✍️ {article.author}</span>
                          <span className="mx-2">•</span>
                          <span className="text-xs">
                            📅{" "}
                            {new Date(article.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          article.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {article.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/admin/artikel/edit/${article.id}`)
                        }
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(article.id)}
                        className="flex-1 sm:flex-none"
                      >
                        {article.status === "published" ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" /> Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" /> Publish
                          </>
                        )}
                      </Button>

                      {article.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(`/article/${article.slug}`, "_blank")
                          }
                          className="flex-1 sm:flex-none"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Lihat
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(article.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
