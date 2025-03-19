import { NewsFeed } from "@/components/news/results";
import { SearchFilters } from "@/components/news/filters";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your News Feed</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>
        <div className="lg:col-span-3">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}
