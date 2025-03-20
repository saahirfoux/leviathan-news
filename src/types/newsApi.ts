export interface NewsApiSource {
  id: string | null;
  name: string;
}

export interface NewsApiArticle {
  source: NewsApiSource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}
