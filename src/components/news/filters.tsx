"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Article } from "@/types/article";

// Define available categories
const CATEGORIES = [
  "world",
  "us-news",
  "politics",
  "business",
  "technology",
  "science",
  "sports",
  "environment",
  "arts",
  "education",
  "health",
];

// Define the sources
const SOURCES = [
  { id: "guardian", name: "The Guardian" },
  { id: "nyt", name: "New York Times" },
  { id: "newsapi", name: "News API (BBC/CNN/Wired)" },
  { id: "all", name: "All Sources" },
];

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

  // State for single category selection (now a string instead of array)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get("category") || "all"
  );

  // State for selected source - default to guardian
  const [selectedSource, setSelectedSource] = useState(
    searchParams?.get("source") || "guardian"
  );

  const [date, setDate] = useState(searchParams?.get("date") || "");

  // Function to handle search
  const handleSearch = () => {
    // Create a new URLSearchParams object
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

    // Update URL and trigger search
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");

    // Call fetchArticles with params
    fetchArticles(params);
  };

  // Effect to update local state when URL params change
  useEffect(() => {
    if (searchParams) {
      setSearchQuery(
        searchParams.get("q") || searchParams.get("keyword") || ""
      );
      setSelectedCategory(searchParams.get("category") || "all");
      setSelectedSource(searchParams.get("source") || "guardian");
      setDate(searchParams.get("date") || "");
    }
  }, [searchParams]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSource("guardian");
    setDate("");
    router.push("/");
    fetchArticles(new URLSearchParams());
  };

  const fetchArticles = async (params: URLSearchParams) => {
    try {
      // Make API call to our unified API endpoint
      const response = await axios.get(`/api/news?${params.toString()}`);
      const data = response.data;

      if (data.success && onArticlesUpdate) {
        console.log(
          `Fetched ${data.total} articles from ${data.sources.join(", ")}`
        );
        onArticlesUpdate(data.data);
      } else {
        console.error("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      console.error("Failed to load articles. Please try again later.");
    }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Query Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for news..."
            className="w-full p-2 pl-8 border rounded"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <button
              className="absolute right-2 top-2.5"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Categories Dropdown - Full Width */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* News Source Dropdown - Full Width */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">News Source</label>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              {SOURCES.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker - Full Width */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="text-xs sm:text-sm"
          >
            Reset Filters
          </Button>
          <Button onClick={handleSearch} className="text-xs sm:text-sm">
            Search News
          </Button>
        </div>
      </div>
    </Card>
  );
}
