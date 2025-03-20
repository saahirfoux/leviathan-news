import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the sources
const SOURCES = [
  { id: "guardian", name: "The Guardian" },
  { id: "nyt", name: "New York Times" },
  { id: "newsapi", name: "News API (BBC/CNN/Wired)" },
  { id: "all", name: "All Sources" },
];

interface SourceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SourceSelector = ({ value, onChange }: SourceSelectorProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">News Source</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a source" />
        </SelectTrigger>
        <SelectContent>
          {SOURCES.map((source) => (
            <SelectItem key={source.id} value={source.id}>
              {source.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SourceSelector;
