import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "terracotta" | "dark" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3 text-sm",
  };

  const variantStyles = {
    primary: "bg-[#2D583B] text-white hover:bg-[#23452E]",
    terracotta: "bg-[#B4461F] text-white hover:bg-[#963716]",
    dark: "bg-[#1E2229] hover:bg-[#111418] text-[#FAF7F2]",
    secondary: "border border-[#D9D0C3] bg-transparent text-[#2D2A26] hover:bg-[#EFEAE1]",
    outline: "border border-[#E8DEC8] bg-white text-[#1E2229] hover:bg-[#FAF6ED]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
