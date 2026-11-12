// components/whatsapp-float-button.jsx
// Tombol melayang "Chat via WhatsApp". Saat diklik, minta backend memilih
// sales (rotasi adil) lalu buka wa.me. Jika backend gagal → fallback ke
// endpoint redirect (tetap dirotasi di server).
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/language-context";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const VISITOR_KEY = "wa_visitor_id";

function getVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        (window.crypto?.randomUUID && window.crypto.randomUUID()) ||
        `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.3.7 4.6 2 6.6L4 29l7.7-2c1.9 1 4 1.5 6.3 1.5 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.6c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.6 1.2 1.2-4.4-.3-.4a9.6 9.6 0 0 1-1.6-5.4C4.8 9.5 9.8 4.8 16 4.8s11.2 4.7 11.2 10.1S22.2 24.6 16 24.6zm6.1-7.4c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.1 2.9 1.2 3.5 1 4.2.9.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}

export default function WhatsAppFloatButton() {
  const router = useRouter();
  const lang = useLanguage();
  const [loading, setLoading] = useState(false);
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  // t() mengembalikan key apa adanya jika terjemahan belum dimuat
  const translated = lang?.t ? lang.t("common.whatsapp.chatSales") : null;
  const label =
    translated && !translated.includes(".") ? translated : "Chat Sales";

  const page = typeof router?.asPath === "string" ? router.asPath : "/";
  const fallbackHref = `${API_URL}/wa/redirect?v=${encodeURIComponent(
    visitorId || ""
  )}&page=${encodeURIComponent(page)}`;

  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);

      // Buka tab dulu (sinkron, tidak kena popup blocker), lalu isi URL-nya.
      // Catatan: feature "noopener" membuat window.open mengembalikan null,
      // jadi opener diputus manual.
      const win = window.open("about:blank", "_blank");
      if (win) win.opener = null;
      try {
        const res = await fetch(`${API_URL}/wa/click`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, page }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (win) win.location.href = data.waUrl;
        else window.location.href = data.waUrl;
      } catch (err) {
        console.warn("WA click API gagal, pakai redirect:", err?.message);
        if (win) win.location.href = fallbackHref;
        else window.location.href = fallbackHref;
      } finally {
        setLoading(false);
      }
    },
    [loading, visitorId, page, fallbackHref]
  );

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 pl-3 pr-4 py-3 font-semibold text-sm transition-all hover:bg-[#1ebe5d] hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 ${
        loading ? "opacity-80 cursor-wait" : ""
      }`}
    >
      <WhatsAppIcon className="w-6 h-6" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
