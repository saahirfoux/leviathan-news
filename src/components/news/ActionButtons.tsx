import React from "react";
import Button from "@/components/ui/button";

interface ActionButtonsProps {
  onReset: () => void;
  onSearch: () => void;
}

const ActionButtons = ({ onReset, onSearch }: ActionButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onReset}
        className="text-xs sm:text-sm"
      >
        Reset Filters
      </Button>
      <Button onClick={onSearch} className="text-xs sm:text-sm">
        Search News
      </Button>
    </div>
  );
};

export default ActionButtons;
