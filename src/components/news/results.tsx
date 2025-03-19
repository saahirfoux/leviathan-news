"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticles } from "@/lib/api";
import type { Article } from "@/types/article";
import Button from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Interface for preference items
interface PreferenceItem {
  id: string;
  name: string;
  checked: boolean;
}

export function NewsFeed() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const category = searchParams?.get("category") || "";
  const source = searchParams?.get("source") || "";
  const date = searchParams?.get("date") || "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get preferred sources, categories, and authors from localStorage
        let preferredSources: string[] = [];
        let preferredCategories: string[] = [];
        let preferredAuthors: string[] = [];

        try {
          const sourcesData = localStorage.getItem("preferredSources");
          const categoriesData = localStorage.getItem("preferredCategories");
          const authorsData = localStorage.getItem("preferredAuthors");

          if (sourcesData) {
            const parsedSources = JSON.parse(sourcesData) as PreferenceItem[];
            preferredSources = parsedSources
              .filter((s) => s.checked)
              .map((s) => s.id);
          }

          if (categoriesData) {
            const parsedCategories = JSON.parse(
              categoriesData
            ) as PreferenceItem[];
            preferredCategories = parsedCategories
              .filter((c) => c.checked)
              .map((c) => c.id);
          }

          if (authorsData) {
            const parsedAuthors = JSON.parse(authorsData) as PreferenceItem[];
            preferredAuthors = parsedAuthors
              .filter((a) => a.checked)
              .map((a) => a.id);
          }
        } catch (e) {
          console.error("Error parsing preferences:", e);
        }

        // If no preferences are set, don't filter by them
        if (preferredSources.length === 0) preferredSources = ["all"];
        if (preferredCategories.length === 0) preferredCategories = ["all"];

        // Apply filters from URL params if present, otherwise use preferences
        const sourceFilter = source ? [source] : preferredSources;
        const categoryFilter = category ? [category] : preferredCategories;

        const data = await fetchArticles({
          query,
          sources: sourceFilter,
          categories: categoryFilter,
          date,
          authors: preferredAuthors.length > 0 ? preferredAuthors : [],
        });

        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [query, category, source, date]);

  if (loading) {
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
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
