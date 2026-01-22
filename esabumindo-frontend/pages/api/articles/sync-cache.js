// pages/api/articles/sync-cache.js
import {
  updateArticlesCache,
  updateArticleDetailCache,
} from "@/lib/cache/article-cache";
import api from "@/lib/axios";

export default async function handler(req, res) {
  // Hanya accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch articles dari backend
    const { data: articles } = await api.get("/articles/published");

    if (!articles || articles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No articles to sync",
        articlesCount: 0,
      });
    }

    // Update articles list cache
    updateArticlesCache(articles);

    // Update detail cache untuk setiap artikel
    articles.forEach((article) => {
      updateArticleDetailCache(article);
    });

    return res.status(200).json({
      success: true,
      message: "Cache synced successfully",
      articlesCount: articles.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error syncing cache:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to sync cache",
    });
  }
}
