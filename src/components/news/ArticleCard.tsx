import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User, ExternalLink } from "lucide-react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

// Component for displaying article image
const ArticleImage = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) {
    return (
      <div className="w-full md:w-1/3 h-[200px] md:h-auto bg-neutral-900 flex items-center justify-center">
        <div className="text-gray-500">
          <Image
            src="/placeholder.svg"
            alt="Placeholder"
            width={100}
            height={100}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 h-[200px] md:h-auto relative">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
};

// Component for displaying article tags (categories and source)
const ArticleTags = ({
  category,
  source,
}: {
  category?: string;
  source?: string;
}) => {
  if (!category && !source) return null;

  return (
    <div className="flex mb-2 space-x-2">
      {category && (
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-neutral-800">
          {category}
        </span>
      )}
      {source && (
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-neutral-800">
          {source}
        </span>
      )}
    </div>
  );
};

// Component for displaying article metadata (author and date)
const ArticleMeta = ({ author, date }: { author?: string; date?: string }) => {
  return (
    <div className="mt-auto flex items-center text-sm text-gray-400">
      {author && (
        <div className="flex items-center mr-4">
          <User className="mr-1 h-4 w-4" />
          <span>{author}</span>
        </div>
      )}

      {date && (
        <div className="flex items-center mr-4">
          <span>{date}</span>
        </div>
      )}
    </div>
  );
};

// Component for displaying read more link
const ReadMoreLink = ({ url }: { url: string }) => {
  const isExternal = url.startsWith("http");

  if (!isExternal) return null;

  return (
    <div className="mt-6">
      <Link
        href={url}
        className="flex items-center text-blue-400 hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="mr-1">Read full article</span>
        <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  );
};

export function ArticleCard({ article }: ArticleCardProps) {
  // Normalize article data to handle possible null/undefined values
  const normalizedArticle = {
    title: article.title || "Untitled Article",
    description: article.description || article.summary || "",
    date: article.publishedAt || article.date || "",
    author: article.author || "",
    image: article.image || "",
    url: article.url || "#",
    category: article.category || "",
    source: article.source || "",
  };

  const { title, description, date, author, image, url, category, source } =
    normalizedArticle;

  return (
    <Card className="overflow-hidden flex flex-col md:flex-row h-full bg-black text-white">
      <ArticleImage src={image} alt={title} />

      <div className="w-full md:w-2/3 flex flex-col">
        <CardContent className="flex flex-col flex-1 p-6">
          <ArticleTags category={category} source={source} />

          <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>

          <p className="text-gray-400 mb-6 text-base md:text-lg">
            {description}
          </p>

          <ArticleMeta author={author} date={date} />
          <ReadMoreLink url={url} />
        </CardContent>
      </div>
    </Card>
  );
}
