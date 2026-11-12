// components/whatsapp-float-button.jsx
// Tombol melayang "Chat via WhatsApp". Saat diklik, minta backend memilih
// sales (rotasi adil) lalu buka wa.me di tab baru.
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/language-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const VISITOR_KEY = "wa_visitor_id";
const CLICK_TIMEOUT_MS = 8000;

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
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.3.7 4.6 2 6.6L4 29l7.7-2c1.9 1 4 1.5 6.3 1.5 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.6c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.6 1.2 1.2-4.4-.3-.4a9.6 9.6 0 0 1-1.6-5.4C4.8 9.5 9.8 4.8 16 4.8s11.2 4.7 11.2 10.1S22.2 24.6 16 24.6zm6.1-7.4c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.1 2.9 1.2 3.5 1 4.2.9.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}

export default function WhatsAppFloatButton() {
  const router = useRouter();
  const lang = useLanguage();
  const [loading, setLoading] = useState(false);

  // t() mengembalikan key apa adanya jika terjemahan belum dimuat
  const translated = lang?.t ? lang.t("common.whatsapp.chatSales") : null;
  const label =
    translated && !translated.includes(".") ? translated : "Chat Sales";

  // href hanya dipakai jika JavaScript tidak jalan. Sengaja ke halaman
  // kontak, bukan ke endpoint rotasi: crawler yang mengikuti link di HTML
  // tidak boleh ikut memutar giliran sales.
  const locale = router?.locale;
  const contactHref =
    locale && locale !== router?.defaultLocale
      ? `/${locale}/contact`
      : "/contact";

  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);

      const visitorId = getVisitorId();
      const page = typeof router?.asPath === "string" ? router.asPath : "/";

      // Buka tab dulu (sinkron, tidak kena popup blocker), lalu isi URL-nya.
      // Feature "noopener" membuat window.open mengembalikan null, jadi
      // opener diputus manual.
      const win = window.open("about:blank", "_blank");
      if (win) win.opener = null;
      const go = (url) => {
        if (win && !win.closed) win.location.href = url;
        else window.location.href = url;
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CLICK_TIMEOUT_MS);
      try {
        const res = await fetch(`${API_URL}/wa/click`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, page }),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          go(data.waUrl);
        } else {
          // Server menjawab tetapi menolak (belum ada sales aktif, terlalu
          // banyak klik, error server). Endpoint redirect akan menjawab hal
          // yang sama, jadi arahkan ke halaman kontak.
          if (win && !win.closed) win.close();
          window.location.href = contactHref;
        }
      } catch (err) {
        // Jaringan / CORS / timeout: browser tidak bisa membaca jawaban API.
        // Navigasi biasa tidak kena CORS, jadi serahkan ke endpoint redirect
        // (rotasi tetap dilakukan server).
        console.warn("WA click API gagal, pakai redirect:", err?.message);
        go(
          `${API_URL}/wa/redirect?v=${encodeURIComponent(
            visitorId || "",
          )}&page=${encodeURIComponent(page)}`,
        );
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    },
    [loading, router, contactHref],
  );

  return (
    <a
      href={contactHref}
      onClick={handleClick}
      aria-label={label}
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 p-3 sm:pr-4 font-semibold text-sm transition-all hover:bg-[#1ebe5d] hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 ${
        loading ? "opacity-80 cursor-wait" : ""
      }`}
    >
      <WhatsAppIcon className="w-6 h-6" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
