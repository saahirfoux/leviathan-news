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
