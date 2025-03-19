"use client";

import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams?.get("q") ?? "");
  const [category, setCategory] = useState(searchParams?.get("category") ?? "");
  const [source, setSource] = useState(searchParams?.get("source") ?? "");
  const [date, setDate] = useState<Date | undefined>(
    searchParams?.get("date")
      ? new Date(searchParams.get("date") ?? "")
      : undefined
  );

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (source) params.set("source", source);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));

    router.push(`/?${params.toString()}`);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSource("all");
    setDate(undefined);
    router.push("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Articles</CardTitle>
        <CardDescription>Refine your news feed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="search">Search</label>
          <div className="relative">
            <input
              id="search"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="category">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="business">Business</option>
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="health">Health</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="politics">Politics</option>
            <option value="world">World</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="source">Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="all">All Sources</option>
            <option value="guardian">The Guardian</option>
            <option value="nytimes">New York Times</option>
            <option value="newsapi">NewsAPI</option>
          </select>
        </div>

        <div className="space-y-2">
          <label>Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              {/* <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              /> */}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={applyFilters} className="w-full gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
          <Button
            onClick={resetFilters}
            variant="outline"
            className="w-full gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
