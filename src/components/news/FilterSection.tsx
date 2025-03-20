"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { Article } from "@/types/article";
import SearchInput from "./SearchInput";
import CategorySelector from "./CategorySelector";
import SourceSelector from "./SourceSelector";
import DatePicker from "./DatePicker";
import AuthorInput from "./AuthorInput";
import ActionButtons from "./ActionButtons";

// Article service for API calls
const articlesService = {
  async fetchArticles(params: URLSearchParams): Promise<Article[]> {
    try {
      const response = await axios.get(`/api/news?${params.toString()}`);
      const data = response.data;

      if (data.success) {
        console.log(
          `Fetched ${data.total} articles from ${data.sources.join(", ")}`
        );
        return data.data;
      } else {
        console.error("Failed to fetch articles");
        return [];
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      console.error("Failed to load articles. Please try again later.");
      return [];
    }
  },
};

// Main filters component that composes the UI
export default function SearchFilters({
  onArticlesUpdate,
}: {
  onArticlesUpdate?: (articles: Article[]) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for search inputs
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("q") || searchParams?.get("keyword") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get("category") || "all"
  );
  const [selectedSource, setSelectedSource] = useState(
    searchParams?.get("source") || "guardian"
  );
  const [date, setDate] = useState(searchParams?.get("date") || "");
  const [author, setAuthor] = useState(searchParams?.get("author") || "");

  // Effect to update local state when URL params change
  useEffect(() => {
    if (searchParams) {
      setSearchQuery(
        searchParams.get("q") || searchParams.get("keyword") || ""
      );
      setSelectedCategory(searchParams.get("category") || "all");
      setSelectedSource(searchParams.get("source") || "guardian");
      setDate(searchParams.get("date") || "");
      setAuthor(searchParams.get("author") || "");
    }
  }, [searchParams]);

  // Function to build URL params from filter state
  const buildSearchParams = (): URLSearchParams => {
    const params = new URLSearchParams();

    // Add search query if not empty
    if (searchQuery.trim()) {
      params.append("q", searchQuery.trim());
    }

    // Add selected category if any (and not 'all')
    if (selectedCategory && selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }

    // Add selected source if not "all"
    if (selectedSource && selectedSource !== "all") {
      params.append("source", selectedSource);
    }

    // Add date if selected
    if (date) {
      params.append("date", date);
    }

    // Add author if provided
    if (author.trim()) {
      params.append("author", author.trim());
    }

    return params;
  };

  // Function to handle search
  const handleSearch = async () => {
    const params = buildSearchParams();

    // Update URL and trigger search
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");

    // Fetch articles and update parent component
    if (onArticlesUpdate) {
      const articles = await articlesService.fetchArticles(params);
      onArticlesUpdate(articles);
    }
  };

  // Reset all filters
  const resetFilters = async () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSource("guardian");
    setDate("");
    setAuthor("");
    router.push("/");

    // Fetch articles with empty params and update parent component
    if (onArticlesUpdate) {
      const articles = await articlesService.fetchArticles(
        new URLSearchParams()
      );
      onArticlesUpdate(articles);
    }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <CategorySelector
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        <SourceSelector value={selectedSource} onChange={setSelectedSource} />

        <AuthorInput value={author} onChange={setAuthor} />

        <DatePicker value={date} onChange={setDate} />

        <ActionButtons onReset={resetFilters} onSearch={handleSearch} />
      </div>
    </Card>
  );
}
