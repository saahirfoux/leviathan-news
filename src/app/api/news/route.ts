import { NextRequest, NextResponse } from "next/server";
import { ArticleResponse } from "@/types";
import {
  fetchFromGuardian,
  fetchFromNewsAPI,
  fetchFromNYT,
} from "@/lib/helpers/sources";

// Interface for parsed filter parameters
interface NewsFilters {
  keyword: string;
  categories: string[];
  author: string;
  date: string;
  sources: string[];
}

// Function to parse and extract filter parameters from request
function parseFilterParams(request: NextRequest): NewsFilters {
  const searchParams = request.nextUrl.searchParams;

  // Extract filter parameters
  const keyword = searchParams.get("q") || searchParams.get("keyword") || "";
  const categoryParam = searchParams.get("category");

  // Skip category filtering if 'all' is selected
  const categories =
    categoryParam && categoryParam !== "all" ? categoryParam.split(",") : [];

  const author = searchParams.get("author") || "";
  const date = searchParams.get("date") || "";

  // Extract sources to fetch from - defaults to all if not specified
  const sourceParam = searchParams.get("source") || "all";
  const sources =
    sourceParam === "all"
      ? ["guardian", "nyt", "newsapi"]
      : sourceParam.split(",");

  return {
    keyword,
    categories,
    author,
    date,
    sources,
  };
}

// Function to fetch articles from all specified sources
async function fetchArticlesFromSources(
  filters: NewsFilters
): Promise<ArticleResponse[]> {
  const { keyword, categories, author, date, sources } = filters;

  // Prepare result array
  let allArticles: ArticleResponse[] = [];
  const fetchPromises = [];

  // Only fetch from Guardian if specified
  if (sources.includes("guardian") || sources.includes("all")) {
    fetchPromises.push(fetchFromGuardian(keyword, categories, author, date));
  }

  // Only fetch from NYT if specified
  if (sources.includes("nyt") || sources.includes("all")) {
    fetchPromises.push(fetchFromNYT(keyword, categories, author, date));
  }

  // Only fetch from NewsAPI if specified
  if (sources.includes("newsapi") || sources.includes("all")) {
    fetchPromises.push(fetchFromNewsAPI(keyword, categories, date));
  }

  // Wait for all fetch operations to complete
  const results = await Promise.allSettled(fetchPromises);

  // Process results and collect articles
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value.success) {
      allArticles = [...allArticles, ...result.value.data];
    }
  });

  // Sort articles by date (newest first)
  return sortArticlesByDate(allArticles);
}

// Function to sort articles by date
function sortArticlesByDate(articles: ArticleResponse[]): ArticleResponse[] {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

// Function to create a successful API response
function createSuccessResponse(articles: ArticleResponse[], sources: string[]) {
  return NextResponse.json({
    success: true,
    data: articles,
    sources: sources,
    total: articles.length,
  });
}

// Function to create an error API response
function createErrorResponse(error: unknown) {
  console.error("Error fetching news data:", error);
  return NextResponse.json(
    { error: "Failed to fetch news data" },
    { status: 500 }
  );
}

// Main API handler function
export async function GET(request: NextRequest) {
  try {
    // Parse filter parameters from the request
    const filters = parseFilterParams(request);

    // Fetch articles from all specified sources
    const articles = await fetchArticlesFromSources(filters);

    // Return successful response with articles
    return createSuccessResponse(articles, filters.sources);
  } catch (error) {
    // Handle and return error response
    return createErrorResponse(error);
  }
}
