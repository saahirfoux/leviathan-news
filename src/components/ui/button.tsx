import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "destructive" | "outline";
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  className = "",
  variant = "default",
  disabled = false,
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors";

  const variantStyles = {
    default: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    outline:
      "bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800",
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button onClick={onClick} className={buttonClasses} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
