import axios from "axios";
import { GuardianApiResponse, GuardianResult } from "@/types/guardianApi";
import {
  NewsApiResponse,
  NewsApiArticle as ExternalNewsApiArticle,
} from "@/types/newsApi";
import { NYTApiResponse, NYTDoc } from "@/types/nytApi";
import { ArticleResponse } from "@/types";

// Helper function to fetch from Guardian API
const fetchFromGuardian = async (
  keyword: string,
  categories: string[],
  author: string,
  date: string
) => {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEWS_GUARDIAN_APIKEY;

    if (!apiKey) {
      console.error("Guardian API key is not configured");
      return { success: false, data: [], source: "guardian" };
    }

    // Build the Guardian API query parameters
    const guardianParams = new URLSearchParams();
    guardianParams.append("api-key", apiKey);
    guardianParams.append("show-fields", "byline,trailText,thumbnail");

    // Add keyword/query if provided
    if (keyword) {
      guardianParams.append("q", keyword);
    }

    // Add category/section filter if provided (use only first category for Guardian)
    if (categories.length > 0) {
      guardianParams.append("section", categories[0]);
    }

    // Add date filter if provided (format should be YYYY-MM-DD)
    if (date) {
      guardianParams.append("from-date", date);
      guardianParams.append("to-date", date);
    }

    // Helper function to format author names for the Guardian API
    function formatAuthorNames(authorName: string) {
      // Remove any special characters and spaces for the concatenated version
      const fullName = authorName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      // Replace spaces with hyphens for the hyphenated version
      const hyphenated = authorName.replace(/\s+/g, "-").toLowerCase();
      return { fullName, hyphenated };
    }

    // Add author filter if provided
    if (author) {
      const { fullName, hyphenated } = formatAuthorNames(author);
      guardianParams.append("tag", `profile/${fullName}`);
      guardianParams.append("tag", `profile/${hyphenated}`);
    }

    // Make the API request to Guardian
    const apiUrl = "https://content.guardianapis.com/search";
    const response = await axios.get<GuardianApiResponse>(
      `${apiUrl}?${guardianParams.toString()}`
    );

    // Transform the Guardian API response to our common format
    const articles: ArticleResponse[] = response.data.response.results.map(
      (result: GuardianResult): ArticleResponse => {
        return {
          id: result.id,
          title: result.webTitle,
          summary: result.fields?.trailText || "",
          date: result.webPublicationDate,
          category: result.sectionId,
          author: result.fields?.byline || "",
          source: "guardian",
          image: result.fields?.thumbnail || "",
          url: result.webUrl,
        };
      }
    );

    return { success: true, data: articles, source: "guardian" };
  } catch (error) {
    console.error("Error fetching from Guardian API:", error);
    return { success: false, data: [], source: "guardian" };
  }
};

// Helper function to fetch from NYT API
const fetchFromNYT = async (
  keyword: string,
  categories: string[],
  author: string,
  date: string
) => {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEWS_NYT_APIKEY;

    if (!apiKey) {
      console.error("NYT API key is not configured");
      return { success: false, data: [], source: "nytimes" };
    }

    // Category mapper for NYT sections
    const mapCategoryToNYTSection = (category: string): string => {
      const categoryMap: Record<string, string> = {
        politics: "U.S.",
        "us-news": "Us",
        business: "Business Day",
        environment: "Climate",
      };

      return categoryMap[category.toLowerCase()] || category;
    };

    // Build the NYT API query parameters
    const nytParams = new URLSearchParams();
    nytParams.append("api-key", apiKey);

    // Add keyword/query if provided
    if (keyword) {
      nytParams.append("q", keyword);
    }

    // Build filter query (fq parameter)
    const filterQueries: string[] = [];

    // Add date filter if provided (format should be YYYY-MM-DD)
    if (date) {
      filterQueries.push(`pub_date:("${date}")`);
    }

    // Add category/section filter if provided
    if (categories.length > 0) {
      const mappedCategories = categories.map(mapCategoryToNYTSection);
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
      nytParams.append("fq", filterQueries.join(" AND "));
    }

    // Make the API request to NYT
    const apiUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    const response = await axios.get<NYTApiResponse>(
      `${apiUrl}?${nytParams.toString()}`
    );

    // Transform the NYT API response to our common format
    const articles: ArticleResponse[] = response.data.response.docs.map(
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
          source: "nytimes",
          image: imageUrl,
          url: doc.web_url,
        };
      }
    );

    return { success: true, data: articles, source: "nytimes" };
  } catch (error) {
    console.error("Error fetching from NYT API:", error);
    return { success: false, data: [], source: "nytimes" };
  }
};

// Helper function to fetch from NewsAPI.org
const fetchFromNewsAPI = async (
  keyword: string,
  categories: string[],
  date: string
) => {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEWS_API_ORG_KEY;

    if (!apiKey) {
      return { success: false, data: [], source: "newsapi" };
    }

    // Build the NewsAPI.org query parameters
    const newsApiParams = new URLSearchParams();
    newsApiParams.append("apiKey", apiKey);

    // Set the domains - we can customize this later if needed
    const domains = "bbc.co.uk,cnn.com,wired.com";
    newsApiParams.append("domains", domains);

    // Add keyword/query if provided
    if (keyword) {
      newsApiParams.append("q", keyword);
    }

    // Add date filter if provided (format should be YYYY-MM-DD)
    if (date) {
      newsApiParams.append("from", date);
      newsApiParams.append("to", date);
    }

    // Sort by most recent articles
    newsApiParams.append("sortBy", "publishedAt");

    // In a future iteration, we can add a pageSize parameter to the query
    newsApiParams.append("pageSize", "10");

    // Make the API request to NewsAPI.org
    const apiUrl = "https://newsapi.org/v2/everything";
    const response = await axios.get<NewsApiResponse>(
      `${apiUrl}?${newsApiParams.toString()}`
    );

    // Transform the NewsAPI.org response to our common format
    const articles: ArticleResponse[] = response.data.articles.map(
      (article: ExternalNewsApiArticle, index: number): ArticleResponse => {
        return {
          id: `newsapi-${index}`,
          title: article.title,
          summary: article.description || "",
          date: article.publishedAt,
          category: "", // NewsAPI doesn't provide categories
          author: article.author || "",
          source: article.source.name,
          image: article.urlToImage || "",
          url: article.url,
        };
      }
    );

    return { success: true, data: articles, source: "newsapi" };
  } catch (error) {
    console.error("Error fetching from NewsAPI.org:", error);
    return { success: false, data: [], source: "newsapi" };
  }
};

export { fetchFromGuardian, fetchFromNYT, fetchFromNewsAPI };
