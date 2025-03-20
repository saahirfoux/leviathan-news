"use client";

import { NewsFeed } from "@/components/news/results";
import SearchFilters from "@/components/news/filters";
import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Fetch articles on initial load
  useEffect(() => {
    const fetchInitialArticles = async () => {
      try {
        setLoading(true);
        // Use existing URL params from the URL if any
        const params = new URLSearchParams(searchParams?.toString() || "");

        // Default to Guardian if no source specified
        if (!params.has("source")) {
          params.append("source", "guardian");
        }

        const response = await axios.get(`/api/news?${params.toString()}`);
        if (response.data.success) {
          setArticles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching initial articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialArticles();
  }, [searchParams]);

  const handleArticlesUpdate = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leviathan News Aggregator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters onArticlesUpdate={handleArticlesUpdate} />
        </div>
        <div className="lg:col-span-3">
          <NewsFeed initialArticles={articles} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}
