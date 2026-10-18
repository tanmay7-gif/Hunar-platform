import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "paper" | "linen" | "kohl";
}

export function Card({
  variant = "paper",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    paper: "bg-white border-[#E8DEC8] text-[#1A1816]",
    linen: "bg-[#FAF7F2] border-[#E8DEC8] text-[#1A1816]",
    kohl: "bg-[#1E2229] border-[#2A303A] text-[#FAF7F2]",
  };

  return (
    <div
      className={`rounded-sm border shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
