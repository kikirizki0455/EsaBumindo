// components/editor/BlockEditor.jsx
"use client";

import { useState } from "react";
import {
  Plus,
  Type,
  Image as ImageIcon,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlockEditor({ blocks, onChange }) {
  const [uploadingBlockId, setUploadingBlockId] = useState(null);

  // Add new block
  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      ...(type === "paragraph" && { content: "" }),
      ...(type === "heading" && { level: 2, content: "" }),
      ...(type === "image" && {
        layout: "single",
        images: [{ url: "", alt: "", caption: "", width: "full" }],
      }),
    };

    onChange([...blocks, newBlock]);
  };

  // Update block
  const updateBlock = (blockId, updates) => {
    onChange(
      blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  // Delete block
  const deleteBlock = (blockId) => {
    onChange(blocks.filter((block) => block.id !== blockId));
  };

  // Move block
  const moveBlock = (blockId, direction) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    onChange(newBlocks);
  };

  // Upload image
  const handleImageUpload = async (blockId, imageIndex, file) => {
    setUploadingBlockId(blockId);
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

      // Update image URL in block
      const block = blocks.find((b) => b.id === blockId);
      const updatedImages = [...block.images];
      updatedImages[imageIndex] = {
        ...updatedImages[imageIndex],
        url: data.url,
        alt: file.name.replace(/\.[^/.]+$/, ""),
      };

      updateBlock(blockId, { images: updatedImages });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal upload gambar!");
    } finally {
      setUploadingBlockId(null);
    }
  };

  // Add image to image block
  const addImageToBlock = (blockId) => {
    const block = blocks.find((b) => b.id === blockId);
    updateBlock(blockId, {
      images: [
        ...block.images,
        { url: "", alt: "", caption: "", width: "half" },
      ],
    });
  };

  // Remove image from image block
  const removeImageFromBlock = (blockId, imageIndex) => {
    const block = blocks.find((b) => b.id === blockId);
    const updatedImages = block.images.filter((_, i) => i !== imageIndex);
    updateBlock(blockId, { images: updatedImages });
  };

  return (
    <div className="space-y-4">
      {/* Blocks */}
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-[#060771] transition-colors"
        >
          {/* Block Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase">
                {block.type === "paragraph" && "📝 Paragraf"}
                {block.type === "heading" && "📌 Heading"}
                {block.type === "image" && "🖼️ Gambar"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => moveBlock(block.id, "up")}
                disabled={index === 0}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => moveBlock(block.id, "down")}
                disabled={index === blocks.length - 1}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => deleteBlock(block.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Paragraph Block */}
          {block.type === "paragraph" && (
            <Textarea
              value={block.content}
              onChange={(e) =>
                updateBlock(block.id, { content: e.target.value })
              }
              placeholder="Tulis paragraf di sini..."
              rows={4}
              className="resize-none"
            />
          )}

          {/* Heading Block */}
          {block.type === "heading" && (
            <div className="space-y-2">
              <Select
                value={block.level.toString()}
                onValueChange={(value) =>
                  updateBlock(block.id, { level: parseInt(value) })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Heading 2</SelectItem>
                  <SelectItem value="3">Heading 3</SelectItem>
                  <SelectItem value="4">Heading 4</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={block.content}
                onChange={(e) =>
                  updateBlock(block.id, { content: e.target.value })
                }
                placeholder="Tulis judul heading..."
                className="font-bold text-lg"
              />
            </div>
          )}

          {/* Image Block */}
          {block.type === "image" && (
            <div className="space-y-4">
              {/* Layout Selection */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-semibold">Layout:</Label>
                <Select
                  value={block.layout}
                  onValueChange={(value) =>
                    updateBlock(block.id, { layout: value })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">1 Gambar (Full)</SelectItem>
                    <SelectItem value="double">2 Gambar (Sejajar)</SelectItem>
                    <SelectItem value="grid">Grid (Banyak)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Images */}
              <div
                className={`grid gap-4 ${
                  block.layout === "double"
                    ? "grid-cols-2"
                    : block.layout === "grid"
                    ? "grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {block.images.map((image, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="border border-gray-200 rounded-lg p-3 space-y-2"
                  >
                    {/* Image Preview/Upload */}
                    <div className="relative">
                      {image.url ? (
                        <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const updatedImages = [...block.images];
                              updatedImages[imgIndex] = {
                                ...updatedImages[imgIndex],
                                url: "",
                              };
                              updateBlock(block.id, { images: updatedImages });
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-[#060771] transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">
                            Upload Gambar
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(
                                block.id,
                                imgIndex,
                                e.target.files[0]
                              )
                            }
                            disabled={uploadingBlockId === block.id}
                          />
                        </label>
                      )}
                    </div>

                    {/* Alt Text */}
                    <Input
                      placeholder="Alt text (SEO)"
                      value={image.alt}
                      onChange={(e) => {
                        const updatedImages = [...block.images];
                        updatedImages[imgIndex].alt = e.target.value;
                        updateBlock(block.id, { images: updatedImages });
                      }}
                      className="text-sm"
                    />

                    {/* Caption */}
                    <Input
                      placeholder="Caption (opsional)"
                      value={image.caption}
                      onChange={(e) => {
                        const updatedImages = [...block.images];
                        updatedImages[imgIndex].caption = e.target.value;
                        updateBlock(block.id, { images: updatedImages });
                      }}
                      className="text-sm"
                    />

                    {/* Remove Image Button */}
                    {block.images.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeImageFromBlock(block.id, imgIndex)}
                        className="w-full text-red-500"
                      >
                        Hapus Gambar
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More Images */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addImageToBlock(block.id)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Gambar
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addBlock("paragraph")}
        >
          <Type className="w-4 h-4 mr-2" />
          Paragraf
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addBlock("heading")}
        >
          <Type className="w-4 h-4 mr-2" />
          Heading
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addBlock("image")}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Gambar
        </Button>
      </div>
    </div>
  );
}
