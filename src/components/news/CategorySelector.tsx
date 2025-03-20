import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define available categories
const CATEGORIES = [
  "world",
  "us-news",
  "politics",
  "business",
  "technology",
  "science",
  "sports",
  "environment",
  "arts",
  "education",
  "health",
];

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Category</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() +
                category.slice(1).replace("-", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
