// components/editor/TiptapEditor.jsx
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button type="button" size="sm" variant="ghost" onClick={addLink}>
        <LinkIcon className="w-4 h-4" />
      </Button>

      <Button type="button" size="sm" variant="ghost" onClick={addImage}>
        <ImageIcon className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};
export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    immediatelyRender: false, // ⭐ WAJIB
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
