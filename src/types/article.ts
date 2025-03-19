export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  author?: string;
  publishedAt: string;
  url: string;
  urlToImage?: string;
  category?: string;
  readTime?: number;
}
