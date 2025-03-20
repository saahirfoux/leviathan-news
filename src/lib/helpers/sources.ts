import axios from "axios";
import { GuardianApiResponse, GuardianResult } from "@/types/guardianApi";
import {
  NewsApiResponse,
  NewsApiArticle as ExternalNewsApiArticle,
} from "@/types/newsApi";
import { NYTApiResponse, NYTDoc } from "@/types/nytApi";
import { ArticleResponse } from "@/types";

// Common interface for news fetching operations
interface NewsFetcher {
  fetch(params: NewsQueryParams): Promise<NewsApiResult>;
}

// Common parameters for all news API requests
interface NewsQueryParams {
  keyword: string;
  categories: string[];
  author?: string;
  date?: string;
}

// Common return type for all news API requests
interface NewsApiResult {
  success: boolean;
  data: ArticleResponse[];
  source: string;
}

// Base class for news fetchers with common utilities
abstract class BaseNewsFetcher implements NewsFetcher {
  protected source: string;
  protected apiKey: string | undefined;

  constructor(source: string, apiKeyEnvVar: string) {
    this.source = source;
    this.apiKey = process.env[apiKeyEnvVar];
  }

  // Abstract method to be implemented by each specific fetcher
  abstract fetch(params: NewsQueryParams): Promise<NewsApiResult>;

  // Common error handling method
  protected handleError(error: unknown): NewsApiResult {
    console.error(`Error fetching from ${this.source} API:`, error);
    return { success: false, data: [], source: this.source };
  }

  // Check if the API key is configured
  protected validateApiKey(): boolean {
    if (!this.apiKey) {
      console.error(`${this.source} API key is not configured`);
      return false;
    }
    return true;
  }
}

// Guardian API implementation
class GuardianFetcher extends BaseNewsFetcher {
  constructor() {
    super("guardian", "NEWS_GUARDIAN_APIKEY");
  }

  async fetch({
    keyword,
    categories,
    author,
    date,
  }: NewsQueryParams): Promise<NewsApiResult> {
    try {
      if (!this.validateApiKey()) {
        return { success: false, data: [], source: this.source };
      }

      // Build the Guardian API query parameters
      const params = new URLSearchParams();
      params.append("api-key", this.apiKey!);
      params.append("show-fields", "byline,trailText,thumbnail");

      // Add keyword/query if provided
      if (keyword) {
        params.append("q", keyword);
      }

      // Add category/section filter if provided (use only first category for Guardian)
      if (categories.length > 0) {
        params.append("section", categories[0]);
      }

      // Add date filter if provided (format should be YYYY-MM-DD)
      if (date) {
        params.append("from-date", date);
        params.append("to-date", date);
      }

      // Add author filter if provided
      if (author) {
        const { fullName, hyphenated } = this.formatAuthorNames(author);
        params.append("tag", `profile/${fullName}`);
        params.append("tag", `profile/${hyphenated}`);
      }

      // Make the API request to Guardian
      const apiUrl = "https://content.guardianapis.com/search";
      const response = await axios.get<GuardianApiResponse>(
        `${apiUrl}?${params.toString()}`
      );

      // Transform the Guardian API response to our common format
      const articles = response.data.response.results.map(
        (result: GuardianResult): ArticleResponse => ({
          id: result.id,
          title: result.webTitle,
          summary: result.fields?.trailText || "",
          date: result.webPublicationDate,
          category: result.sectionId,
          author: result.fields?.byline || "",
          source: this.source,
          image: result.fields?.thumbnail || "",
          url: result.webUrl,
        })
      );

      return { success: true, data: articles, source: this.source };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Helper function to format author names for the Guardian API
  private formatAuthorNames(authorName: string) {
    // Remove any special characters and spaces for the concatenated version
    const fullName = authorName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    // Replace spaces with hyphens for the hyphenated version
    const hyphenated = authorName.replace(/\s+/g, "-").toLowerCase();
    return { fullName, hyphenated };
  }
}

// NYT API implementation
class NYTFetcher extends BaseNewsFetcher {
  constructor() {
    super("nytimes", "NEWS_NYT_APIKEY");
  }

  async fetch({
    keyword,
    categories,
    author,
    date,
  }: NewsQueryParams): Promise<NewsApiResult> {
    try {
      if (!this.validateApiKey()) {
        return { success: false, data: [], source: this.source };
      }

      // Build the NYT API query parameters
      const params = new URLSearchParams();
      params.append("api-key", this.apiKey!);

      // Add keyword/query if provided
      if (keyword) {
        params.append("q", keyword);
      }

      // Build filter query (fq parameter)
      const filterQueries: string[] = [];

      // Add date filter if provided (format should be YYYY-MM-DD)
      if (date) {
        filterQueries.push(`pub_date:("${date}")`);
      }

      // Add category/section filter if provided
      if (categories.length > 0) {
        const mappedCategories = categories.map(this.mapCategoryToNYTSection);
        const categoryFilter = mappedCategories
          .map((cat) => `"${cat}"`)
          .join(" OR ");
        filterQueries.push(`section_name:(${categoryFilter})`);
      }

      // Add author/byline filter if provided
      if (author) {
        filterQueries.push(`byline:("${author}")`);
      }

      // Combine all filter queries with AND
      if (filterQueries.length > 0) {
        params.append("fq", filterQueries.join(" AND "));
      }

      // Make the API request to NYT
      const apiUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
      const response = await axios.get<NYTApiResponse>(
        `${apiUrl}?${params.toString()}`
      );

      // Transform the NYT API response to our common format
      const articles = response.data.response.docs.map(
        (doc: NYTDoc): ArticleResponse => {
          // Extract image URL if available in multimedia
          const imageUrl =
            doc.multimedia.length > 0
              ? `https://www.nytimes.com/${doc.multimedia[0].url}`
              : "";

          // Extract author from byline
          const authorName = doc.byline?.original
            ? doc.byline.original.replace("By ", "")
            : "";

          return {
            id: doc._id,
            title: doc.headline.main,
            summary: doc.abstract || doc.snippet,
            date: doc.pub_date,
            category: doc.section_name.toLowerCase(),
            author: authorName,
            source: this.source,
            image: imageUrl,
            url: doc.web_url,
          };
        }
      );

      return { success: true, data: articles, source: this.source };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Category mapper for NYT sections
  private mapCategoryToNYTSection(category: string): string {
    const categoryMap: Record<string, string> = {
      politics: "U.S.",
      "us-news": "Us",
      business: "Business Day",
      environment: "Climate",
    };

    return categoryMap[category.toLowerCase()] || category;
  }
}

// NewsAPI implementation
class NewsApiFetcher extends BaseNewsFetcher {
  constructor() {
    super("newsapi", "NEWS_API_ORG_KEY");
  }

  async fetch({ keyword, date }: NewsQueryParams): Promise<NewsApiResult> {
    try {
      if (!this.validateApiKey()) {
        return { success: false, data: [], source: this.source };
      }

      // Build the NewsAPI.org query parameters
      const params = new URLSearchParams();
      params.append("apiKey", this.apiKey!);

      // Set the domains - we can customize this later if needed
      const domains = "bbc.co.uk,cnn.com,wired.com";
      params.append("domains", domains);

      // Add keyword/query if provided
      if (keyword) {
        params.append("q", keyword);
      }

      // Add date filter if provided (format should be YYYY-MM-DD)
      if (date) {
        params.append("from", date);
        params.append("to", date);
      }

      // Sort by most recent articles
      params.append("sortBy", "publishedAt");
      params.append("pageSize", "10");

      // Make the API request to NewsAPI.org
      const apiUrl = "https://newsapi.org/v2/everything";
      const response = await axios.get<NewsApiResponse>(
        `${apiUrl}?${params.toString()}`
      );

      // Transform the NewsAPI.org response to our common format
      const articles = response.data.articles.map(
        (article: ExternalNewsApiArticle, index: number): ArticleResponse => ({
          id: `newsapi-${index}`,
          title: article.title,
          summary: article.description || "",
          date: article.publishedAt,
          category: this.extractCategoryFromUrl(article.url) || "general",
          author: article.author || "",
          source: this.extractSourceFromUrl(article.url) || this.source,
          image: article.urlToImage || "",
          url: article.url,
        })
      );

      return { success: true, data: articles, source: this.source };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Helper to extract domain/source from a URL
  private extractSourceFromUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      // Extract domain without www. and .com/.org etc.
      return hostname.replace(/^www\./i, "").split(".")[0];
    } catch {
      return "";
    }
  }

  // Helper to extract category from URL (basic implementation)
  private extractCategoryFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const parts = pathname.split("/").filter(Boolean);
      return parts.length > 0 ? parts[0] : "";
    } catch {
      return "";
    }
  }
}

// Factory to create appropriate news fetcher based on source
class NewsFetcherFactory {
  static createFetcher(source: string): NewsFetcher {
    switch (source.toLowerCase()) {
      case "guardian":
        return new GuardianFetcher();
      case "nyt":
      case "nytimes":
        return new NYTFetcher();
      case "newsapi":
        return new NewsApiFetcher();
      default:
        throw new Error(`Unsupported news source: ${source}`);
    }
  }
}

// Exported functions that use the factory pattern
export async function fetchFromGuardian(
  keyword: string,
  categories: string[],
  author: string,
  date: string
): Promise<NewsApiResult> {
  const fetcher = NewsFetcherFactory.createFetcher("guardian");
  return fetcher.fetch({ keyword, categories, author, date });
}

export async function fetchFromNYT(
  keyword: string,
  categories: string[],
  author: string,
  date: string
): Promise<NewsApiResult> {
  const fetcher = NewsFetcherFactory.createFetcher("nyt");
  return fetcher.fetch({ keyword, categories, author, date });
}

export async function fetchFromNewsAPI(
  keyword: string,
  categories: string[],
  date: string
): Promise<NewsApiResult> {
  const fetcher = NewsFetcherFactory.createFetcher("newsapi");
  return fetcher.fetch({ keyword, categories, date });
}
