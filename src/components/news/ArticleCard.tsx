import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User, ExternalLink } from "lucide-react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const {
    title,
    description,
    summary,
    author = "Unknown",
    publishedAt,
    date,
    image,
    url,
    category,
    source,
  } = article;

  // Use either description or summary
  const displayText = description || summary || "";

  // Use either publishedAt or date
  const displayDate = publishedAt || date || "";

  // Check if the URL is external (not part of our domain)
  const isExternal = url.startsWith("http");

  return (
    <Card className="overflow-hidden flex flex-col md:flex-row h-full bg-black text-white">
      {image ? (
        <div className="w-full md:w-1/3 h-[200px] md:h-auto relative">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
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
      )}

      <div className="w-full md:w-2/3 flex flex-col">
        <CardContent className="flex flex-col flex-1 p-6">
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

          <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400 mb-6 text-base md:text-lg">
            {displayText}
          </p>

          <div className="mt-auto flex items-center text-sm text-gray-400">
            {author && (
              <div className="flex items-center mr-4">
                <User className="mr-1 h-4 w-4" />
                <span>{author}</span>
              </div>
            )}

            {displayDate && (
              <div className="flex items-center mr-4">
                <span>{displayDate}</span>
              </div>
            )}
          </div>

          {isExternal && (
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
          )}
        </CardContent>
      </div>
    </Card>
  );
}
