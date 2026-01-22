// docs/MULTILINGUAL_SETUP.md

# 🌐 Panduan Setup Multilingual - Artikel Esabumindo

## 📋 Ringkasan Multilingual System

Sistem artikel Esabumindo sekarang support **2 bahasa**:

- ✅ **Bahasa Indonesia (id)** - Default
- ✅ **English (en)** - Full support

---

## 🏗️ Arsitektur Multilingual

```
App
├── LanguageContext (language state)
│   └── Provider di _app.js
│
├── Locales (translation files)
│   ├── locales/articles.json (article strings)
│   ├── locales/id/ (other pages ID)
│   └── locales/en/ (other pages EN)
│
├── Hooks
│   ├── use-article-translation.js (for articles)
│   └── use-translation.js (for other pages)
│
└── Pages
    ├── pages/article/index.js (uses useArticleTranslation)
    └── pages/article/[slug].js (uses useArticleTranslation)
```

---

## 🔧 Setup Step-by-Step

### Step 1: Verify Language Context Exists

File: `contexts/language-context.jsx`

```javascript
import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("id");

  useEffect(() => {
    // Get saved language from localStorage
    const saved = localStorage.getItem("language") || "id";
    setLanguage(saved);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

### Step 2: Wrap App with LanguageProvider

File: `pages/_app.js`

```javascript
import { LanguageProvider } from "@/contexts/language-context";

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;
```

### Step 3: Add Language Switcher in Navigation

File: `components/navigation.jsx` atau `components/header.jsx`

```javascript
import { useContext } from "react";
import { LanguageContext } from "@/contexts/language-context";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage("id")}
        className={`px-3 py-1 rounded ${
          language === "id"
            ? "bg-[#060771] text-white font-bold"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded ${
          language === "en"
            ? "bg-[#060771] text-white font-bold"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        EN
      </button>
    </div>
  );
}
```

### Step 4: Use Translation in Components

File: `pages/article/index.js` (sudah diupdate)

```javascript
import { useArticleTranslation } from "@/hooks/use-article-translation";

export default function ArticlesPage() {
  const { t, lang } = useArticleTranslation();

  return (
    <>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>

      {/* Format date dengan bahasa yang tepat */}
      <time dateTime={article.publishedAt}>
        {new Date(article.publishedAt).toLocaleDateString(
          lang === "en" ? "en-US" : "id-ID",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )}
      </time>
    </>
  );
}
```

---

## 📝 Translation Files Structure

### articles.json Format

File: `locales/articles.json`

```json
{
  "id": {
    "title": "Artikel & Wawasan",
    "subtitle": "Temukan informasi terbaru...",
    "search_placeholder": "Cari artikel...",
    "read_more": "Baca Selengkapnya",
    "author": "Penulis",
    "date": "Tanggal",
    "reading_time": "Waktu Baca",
    "reading_time_unit": "Menit",
    "error_loading": "Gagal memuat artikel",
    "no_articles": "Belum ada artikel lainnya",
    "articles_not_found": "Artikel tidak ditemukan",
    "loading": "Memuat artikel...",
    "share_article": "Bagikan Artikel Ini",
    "share_button": "Bagikan Sekarang"
  },
  "en": {
    "title": "Articles & Insights",
    "subtitle": "Discover the latest information...",
    "search_placeholder": "Search articles...",
    "read_more": "Read More",
    "author": "Author",
    "date": "Date",
    "reading_time": "Reading Time",
    "reading_time_unit": "Minutes",
    "error_loading": "Failed to load articles",
    "no_articles": "No other articles yet",
    "articles_not_found": "No articles found",
    "loading": "Loading articles...",
    "share_article": "Share This Article",
    "share_button": "Share Now"
  }
}
```

---

## 🎯 Menggunakan Translation Hook

### Basic Usage

```javascript
import { useArticleTranslation } from "@/hooks/use-article-translation";

export function MyComponent() {
  const { t, lang } = useArticleTranslation();

  return (
    <>
      {/* Get translated string */}
      <h1>{t("title")}</h1>

      {/* Use language code for formatting */}
      <div className={lang === "en" ? "text-right" : "text-left"}>
        {t("subtitle")}
      </div>
    </>
  );
}
```

### With Fallback

```javascript
const { t } = useArticleTranslation();

// Jika key tidak ada di translation file, akan return fallback (default 'id')
const text = t("non_existent_key"); // Returns: 'non_existent_key'
```

### Adding New Translations

1. **Edit `locales/articles.json`:**

```json
{
  "id": {
    // ... existing
    "new_key": "Teks baru dalam bahasa Indonesia"
  },
  "en": {
    // ... existing
    "new_key": "New text in English"
  }
}
```

2. **Gunakan di component:**

```javascript
const { t } = useArticleTranslation();
<p>{t("new_key")}</p>;
```

---

## 🔢 Format Numbers & Dates

### Dates dengan Correct Locale

```javascript
const { lang } = useArticleTranslation();

const date = new Date("2026-01-22");

// Format dengan bahasa yang benar
const formatted = date.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Result (ID): Rabu, 22 Januari 2026
// Result (EN): Wednesday, January 22, 2026
```

### Numbers dengan Correct Locale

```javascript
const { lang } = useArticleTranslation();

const number = 1234.56;

// Format dengan bahasa yang benar
const formatted = number.toLocaleString(lang === "en" ? "en-US" : "id-ID", {
  style: "currency",
  currency: "USD",
});

// Result (ID): $1.234,56
// Result (EN): $1,234.56
```

---

## 🧪 Testing Multilingual

### Test 1: Language Switcher

```bash
1. Visit: http://localhost:3000/article
2. Lihat di halaman: language switcher (ID/EN buttons)
3. Click "EN" button
4. Verify: All text berubah ke English
5. Click "ID" button
6. Verify: All text kembali ke Indonesian
7. Refresh page
8. Verify: Language tetap EN (saved di localStorage)
```

### Test 2: Date Formatting

```javascript
// Di console saat halaman article
const { lang } = useArticleTranslation();
console.log("Current language:", lang);

// Test date format
const date = new Date("2026-01-22");
console.log(
  "ID format:",
  date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
);
console.log(
  "EN format:",
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
);
```

### Test 3: Translations Complete

```javascript
// Di console
import articlesTranslation from "@/locales/articles.json";

// Check ID translations
const idKeys = Object.keys(articlesTranslation.id);
console.log("ID keys:", idKeys.length);

// Check EN translations
const enKeys = Object.keys(articlesTranslation.en);
console.log("EN keys:", enKeys.length);

// Find missing translations
const missing = idKeys.filter((key) => !articlesTranslation.en[key]);
console.log("Missing in EN:", missing);

// Result: Should be empty array []
```

---

## 📱 SEO dengan Multilingual

### Add Language Meta Tags

File: `pages/article/[slug].js` (sudah ada)

```javascript
import Head from "next/head";
import { useArticleTranslation } from "@/hooks/use-article-translation";

export default function ArticleDetailPage() {
  const { lang } = useArticleTranslation();

  return (
    <>
      <Head>
        {/* Set page language */}
        <html lang={lang} />

        {/* Language alternatives */}
        <link
          rel="alternate"
          hrefLang="id"
          href="https://esabumindo.com/article/[slug]"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://esabumindo.com/en/article/[slug]"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://esabumindo.com/article/[slug]"
        />
      </Head>
    </>
  );
}
```

---

## 🔄 Add New Language (Future)

Jika ingin menambah bahasa baru (misal: Mandarin):

### Step 1: Update Translation File

```json
{
  "id": {
    /* ... */
  },
  "en": {
    /* ... */
  },
  "zh": {
    "title": "文章和见解",
    "subtitle": "发现最新信息...",
    "search_placeholder": "搜索文章..."
    // ... lengkapi semua keys
  }
}
```

### Step 2: Add Language Switcher Button

```javascript
// components/navigation.jsx
<button
  onClick={() => changeLanguage("zh")}
  className={language === "zh" ? "active" : ""}
>
  中文
</button>
```

### Step 3: Update Language Context

```javascript
// contexts/language-context.jsx
export const SUPPORTED_LANGUAGES = ["id", "en", "zh"];

// Validation saat change language
const changeLanguage = (lang) => {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  }
};
```

---

## 💡 Best Practices

### ✅ DO:

- ✅ Keep translations organized by language
- ✅ Use same keys untuk semua languages
- ✅ Always fallback ke default language (id)
- ✅ Test dengan berbagai languages
- ✅ Use locale-aware date/number formatting
- ✅ Store language preference di localStorage

### ❌ DON'T:

- ❌ Don't hardcode strings di component
- ❌ Don't use different keys untuk different languages
- ❌ Don't forget to add fallback
- ❌ Don't mix languages dalam content
- ❌ Don't forget hrefLang untuk SEO
- ❌ Don't ignore RTL languages (future consideration)

---

## 🚀 Advanced: URL-based Language

Jika ingin language di URL (misal: `/en/article`, `/id/article`):

### Step 1: Update Next.js Config

```javascript
// next.config.mjs
export default {
  i18n: {
    locales: ["id", "en"],
    defaultLocale: "id",
  },
};
```

### Step 2: Create Language Middleware

```javascript
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const supportedLocales = ["id", "en"];
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(`/id${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Step 3: Update Pages

```javascript
// pages/[lang]/article/[slug].js
import { useRouter } from "next/router";

export default function ArticleDetailPage() {
  const router = useRouter();
  const { lang, slug } = router.query;

  // lang akan: 'id' atau 'en'
  // slug akan: article slug
}
```

---

## 📊 Translation Coverage Checklist

Pastikan semua translation keys lengkap:

- [ ] `title` - Page title
- [ ] `subtitle` - Page subtitle
- [ ] `search_placeholder` - Search input placeholder
- [ ] `read_more` - Read more button
- [ ] `read_article` - Read article button
- [ ] `author` - Author label
- [ ] `date` - Date label
- [ ] `reading_time` - Reading time label
- [ ] `reading_time_unit` - Minutes/Menit
- [ ] `featured` - Featured post label
- [ ] `related_articles` - Related articles heading
- [ ] `share_article` - Share article heading
- [ ] `share_button` - Share button text
- [ ] `back_to_articles` - Back button
- [ ] `error_loading` - Error message
- [ ] `no_articles` - No articles message
- [ ] `articles_not_found` - Not found message
- [ ] `loading` - Loading message
- [ ] `category` - Category label
- [ ] `new_post` - New post badge

---

## 🆘 Troubleshooting

### Issue 1: Language tidak berubah

**Cause:** LanguageContext tidak wrapped di \_app.js
**Solution:** Pastikan \_app.js punya LanguageProvider wrapper

### Issue 2: Translation key tidak ada

**Cause:** Key belum ditambah ke articles.json
**Solution:** Tambah key ke BOTH bahasa (id dan en)

### Issue 3: Date format salah

**Cause:** Lupa set locale di toLocaleDateString()
**Solution:** Gunakan `lang === 'en' ? 'en-US' : 'id-ID'`

### Issue 4: Language reset setelah refresh

**Cause:** localStorage tidak di-read saat startup
**Solution:** Pastikan useEffect di LanguageContext berjalan

---

## 📞 Implementation Checklist

- [ ] LanguageContext dibuat di contexts/language-context.jsx
- [ ] LanguageProvider wrapper di \_app.js
- [ ] locales/articles.json ada dengan 2 bahasa
- [ ] use-article-translation.js hook dibuat
- [ ] pages/article/index.js menggunakan hook
- [ ] pages/article/[slug].js menggunakan hook
- [ ] Language switcher ada di navigation
- [ ] Tested language switching (ID ↔ EN)
- [ ] Tested date formatting per bahasa
- [ ] localStorage persistence working
- [ ] SEO hrefLang tags ada di detail page

---

Sekarang sistem artikel Anda **fully multilingual support** untuk Bahasa Indonesia dan English! 🎉

Last Updated: January 22, 2026
