// components/ui/ImageUpload.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageUpload({ value, onChange, alt }) {
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB!");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload ke server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal upload gambar!");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt={alt || "Preview"}
            fill
            className="object-cover"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Klik untuk upload gambar cover
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, WEBP (max. 5MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {uploading && (
        <p className="text-sm text-blue-600">Uploading gambar...</p>
      )}
    </div>
  );
}
