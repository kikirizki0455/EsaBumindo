// lib/cache/article-cache.js
import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "data");
const ARTICLES_CACHE_FILE = path.join(CACHE_DIR, "articles.json");
const ARTICLES_DETAIL_CACHE_FILE = path.join(CACHE_DIR, "articles-detail.json");

// Ensure cache directory exists
const ensureCacheDir = () => {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
};

// Initialize cache files if they don't exist
const initializeCacheFiles = () => {
  ensureCacheDir();

  if (!fs.existsSync(ARTICLES_CACHE_FILE)) {
    fs.writeFileSync(
      ARTICLES_CACHE_FILE,
      JSON.stringify({ articles: [], lastUpdated: null }, null, 2)
    );
  }

  if (!fs.existsSync(ARTICLES_DETAIL_CACHE_FILE)) {
    fs.writeFileSync(
      ARTICLES_DETAIL_CACHE_FILE,
      JSON.stringify({ articles: {}, lastUpdated: null }, null, 2)
    );
  }
};

// Get all articles from cache
export const getArticlesFromCache = () => {
  try {
    initializeCacheFiles();
    const data = fs.readFileSync(ARTICLES_CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading articles cache:", error);
    return { articles: [], lastUpdated: null };
  }
};

// Get article detail from cache
export const getArticleDetailFromCache = (slug) => {
  try {
    initializeCacheFiles();
    const data = fs.readFileSync(ARTICLES_DETAIL_CACHE_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.articles[slug] || null;
  } catch (error) {
    console.error("Error reading article detail cache:", error);
    return null;
  }
};

// Update articles list cache
export const updateArticlesCache = (articles) => {
  try {
    initializeCacheFiles();
    const cacheData = {
      articles: articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        coverImage: article.coverImage,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        status: article.status,
      })),
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(ARTICLES_CACHE_FILE, JSON.stringify(cacheData, null, 2));
    return true;
  } catch (error) {
    console.error("Error updating articles cache:", error);
    return false;
  }
};

// Update article detail cache
export const updateArticleDetailCache = (article) => {
  try {
    initializeCacheFiles();
    const data = fs.readFileSync(ARTICLES_DETAIL_CACHE_FILE, "utf-8");
    const parsed = JSON.parse(data);

    parsed.articles[article.slug] = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      contentBlocks: article.contentBlocks,
      status: article.status,
    };
    parsed.lastUpdated = new Date().toISOString();

    fs.writeFileSync(
      ARTICLES_DETAIL_CACHE_FILE,
      JSON.stringify(parsed, null, 2)
    );
    return true;
  } catch (error) {
    console.error("Error updating article detail cache:", error);
    return false;
  }
};

// Clear all caches
export const clearArticlesCache = () => {
  try {
    initializeCacheFiles();
    fs.writeFileSync(
      ARTICLES_CACHE_FILE,
      JSON.stringify({ articles: [], lastUpdated: null }, null, 2)
    );
    fs.writeFileSync(
      ARTICLES_DETAIL_CACHE_FILE,
      JSON.stringify({ articles: {}, lastUpdated: null }, null, 2)
    );
    return true;
  } catch (error) {
    console.error("Error clearing cache:", error);
    return false;
  }
};

// Get cache age in seconds
export const getCacheAge = (type = "articles") => {
  try {
    const file =
      type === "articles" ? ARTICLES_CACHE_FILE : ARTICLES_DETAIL_CACHE_FILE;
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (!data.lastUpdated) return null;
    return Math.floor((new Date() - new Date(data.lastUpdated)) / 1000);
  } catch (error) {
    return null;
  }
};
