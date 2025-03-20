"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/types/article";

interface NewsFeedProps {
  initialArticles?: Article[];
  isLoading?: boolean;
}

export default function NewsFeed({
  initialArticles = [],
  isLoading = false,
}: NewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // Update articles when initialArticles changes
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          No articles found matching your criteria.
        </p>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
