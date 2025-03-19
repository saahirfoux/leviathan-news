import type { Article } from "@/types/article";

interface FetchArticlesParams {
  query?: string;
  sources?: string[];
  categories?: string[];
  date?: string;
  authors?: string[];
}

// Mock data for demonstration purposes
// In a real application, this would be replaced with actual API calls
export async function fetchArticles({
  query = "",
  sources = [],
  categories = [],
  date = "",
  authors = [],
}: FetchArticlesParams): Promise<Article[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock articles data
  const mockArticles: Article[] = [
    {
      id: "1",
      title: "Tech Giants Announce New AI Collaboration",
      description:
        "Major technology companies have joined forces to establish standards for artificial intelligence development and deployment.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "guardian",
      author: "Jane Smith",
      publishedAt: "2023-03-15T14:30:00Z",
      url: "https://example.com/article1",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "technology",
      readTime: 5,
    },
    {
      id: "2",
      title: "Global Markets React to Economic Policy Changes",
      description:
        "Stock markets worldwide show mixed reactions to the latest economic policy announcements from major central banks.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "nytimes",
      author: "John Doe",
      publishedAt: "2023-03-14T09:15:00Z",
      url: "https://example.com/article2",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "business",
      readTime: 7,
    },
    {
      id: "3",
      title: "New Study Reveals Benefits of Mediterranean Diet",
      description:
        "Research confirms that following a Mediterranean diet can significantly reduce the risk of heart disease and improve longevity.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "newsapi",
      author: "Sarah Johnson",
      publishedAt: "2023-03-13T16:45:00Z",
      url: "https://example.com/article3",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "health",
      readTime: 4,
    },
    {
      id: "4",
      title: "Climate Summit Concludes with New Global Commitments",
      description:
        "World leaders agree on ambitious targets to reduce carbon emissions and combat climate change at the latest international summit.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "guardian",
      author: "Michael Brown",
      publishedAt: "2023-03-12T11:20:00Z",
      url: "https://example.com/article4",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "world",
      readTime: 6,
    },
    {
      id: "5",
      title: "Breakthrough in Quantum Computing Announced",
      description:
        "Scientists achieve significant milestone in quantum computing, potentially revolutionizing data processing capabilities.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "nytimes",
      author: "John Doe",
      publishedAt: "2023-03-11T13:50:00Z",
      url: "https://example.com/article5",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "science",
      readTime: 8,
    },
    {
      id: "6",
      title: "Major Film Festival Announces Award Winners",
      description:
        "International film festival concludes with surprising award selections, celebrating diverse storytelling and innovative filmmaking.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "newsapi",
      author: "Sarah Johnson",
      publishedAt: "2023-03-10T19:05:00Z",
      url: "https://example.com/article6",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "entertainment",
      readTime: 5,
    },
    {
      id: "7",
      title: "Political Tensions Rise in Key Diplomatic Negotiations",
      description:
        "Ongoing diplomatic talks face challenges as nations struggle to reach consensus on critical international issues.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "guardian",
      author: "Michael Brown",
      publishedAt: "2023-03-09T08:30:00Z",
      url: "https://example.com/article7",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "politics",
      readTime: 7,
    },
    {
      id: "8",
      title: "Sports Championship Ends with Historic Upset Victory",
      description:
        "Underdog team defies expectations to win major sports championship, marking one of the biggest surprises in recent sports history.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      source: "nytimes",
      author: "Jane Smith",
      publishedAt: "2023-03-08T22:15:00Z",
      url: "https://example.com/article8",
      urlToImage: "/placeholder.svg?height=400&width=600",
      category: "sports",
      readTime: 4,
    },
  ];

  // Filter articles based on parameters
  let filteredArticles = [...mockArticles];

  // Filter by query
  if (query) {
    const queryLower = query.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(queryLower) ||
        article.description.toLowerCase().includes(queryLower) ||
        article.content.toLowerCase().includes(queryLower)
    );
  }

  // Filter by sources
  if (sources.length > 0 && !sources.includes("all")) {
    filteredArticles = filteredArticles.filter((article) =>
      sources.includes(article.source)
    );
  }

  // Filter by categories
  if (categories.length > 0 && !categories.includes("all")) {
    filteredArticles = filteredArticles.filter(
      (article) => article.category && categories.includes(article.category)
    );
  }

  // Filter by date
  if (date) {
    const filterDate = new Date(date);
    filteredArticles = filteredArticles.filter((article) => {
      const articleDate = new Date(article.publishedAt);
      return (
        articleDate.getFullYear() === filterDate.getFullYear() &&
        articleDate.getMonth() === filterDate.getMonth() &&
        articleDate.getDate() === filterDate.getDate()
      );
    });
  }

  // Filter by authors
  if (authors.length > 0) {
    filteredArticles = filteredArticles.filter(
      (article) => article.author && authors.includes(article.author)
    );
  }

  return filteredArticles;
}
