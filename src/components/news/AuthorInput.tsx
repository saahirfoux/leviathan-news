import React from "react";

interface AuthorInputProps {
  value: string;
  onChange: (value: string) => void;
}

const AuthorInput = ({ value, onChange }: AuthorInputProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor="author" className="block text-sm font-medium">
        Author
      </label>
      <input
        id="author"
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder="Search by author name"
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default AuthorInput;
