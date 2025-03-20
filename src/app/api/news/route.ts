import { NextRequest, NextResponse } from "next/server";
import { ArticleResponse } from "@/types";
import {
  fetchFromGuardian,
  fetchFromNewsAPI,
  fetchFromNYT,
} from "@/lib/helpers/sources";

export async function GET(request: NextRequest) {
  try {
    // Get URL search params from the frontend request
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

    // Prepare result array
    let allArticles: ArticleResponse[] = [];

    // Fetch data from each specified source
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
    allArticles.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({
      success: true,
      data: allArticles,
      sources: sources,
      total: allArticles.length,
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    return NextResponse.json(
      { error: "Failed to fetch news data" },
      { status: 500 }
    );
  }
}
