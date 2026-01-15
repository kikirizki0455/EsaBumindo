"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/layout/admin-layout";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    published: false,
  });

  // Simulated fetch - ganti dengan API call
  useEffect(() => {
    // fetchArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call here
    console.log("Submit:", formData);

    // Reset form
    setFormData({ title: "", excerpt: "", content: "", published: false });
    setIsDialogOpen(false);
    setEditingArticle(null);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      published: article.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus artikel ini?")) {
      // API call here
      console.log("Delete:", id);
    }
  };

  const togglePublish = async (id) => {
    // API call here
    console.log("Toggle publish:", id);
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#ff4136] hover:bg-[#ff4136]/90 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Artikel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingArticle
                    ? "Perbarui informasi artikel"
                    : "Isi form di bawah untuk membuat artikel baru. Slug akan dibuat otomatis dari judul."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Judul Artikel <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Tips Meningkatkan Produktivitas"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    💡 Judul akan otomatis diubah menjadi URL (slug)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Ringkasan singkat artikel (opsional)"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    📝 Tampil sebagai preview di halaman daftar artikel
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Konten Artikel <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Tulis konten artikel di sini..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    ✍️ Konten utama artikel Anda
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="published" className="text-sm font-medium">
                      Publikasikan Artikel
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Aktifkan untuk menampilkan artikel di website
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingArticle(null);
                      setFormData({
                        title: "",
                        excerpt: "",
                        content: "",
                        published: false,
                      });
                    }}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#060771] hover:bg-[#060771]/90"
                  >
                    {editingArticle ? "Perbarui" : "Simpan"} Artikel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
        <div className="grid gap-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  Belum ada artikel. Klik "Tambah Artikel" untuk membuat artikel
                  pertama.
                </p>
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
                      </CardDescription>
                    </div>
                    <Badge
                      variant={article.published ? "default" : "secondary"}
                    >
                      {article.published ? "Published" : "Draft"}
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
                      onClick={() => handleEdit(article)}
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
                      {article.published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" /> Publish
                        </>
                      )}
                    </Button>

                    {article.published && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`/articles/${article.slug}`, "_blank")
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
      </div>
    </AdminLayout>
  );
}
