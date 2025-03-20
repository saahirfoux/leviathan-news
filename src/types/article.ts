export interface Article {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  content?: string;
  source: string;
  author?: string;
  publishedAt?: string;
  date?: string;
  url: string;
  image?: string;
  category?: string;
  readTime?: number;
}

// Common article interface for our frontend
export interface ArticleResponse {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  author: string;
  source: string;
  image: string;
  url: string;
}
