import React from "react";
import { X, Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchInput = ({ value, onChange, onSearch }: SearchInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for news..."
        className="w-full p-2 pl-8 border rounded"
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      {value && (
        <button
          className="absolute right-2 top-2.5"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
