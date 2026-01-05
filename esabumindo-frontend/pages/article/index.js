import ArticleHero from "@/components/article/article-hero";
import RecentPosts from "@/components/article/recent-post";

export default function ArticlePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <ArticleHero />
        <RecentPosts />
      </main>
    </div>
  );
}
