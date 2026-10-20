import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "terracotta" | "forest" | "sand" | "kohl" | "muted";
  children: React.ReactNode;
}

export function Badge({
  variant = "sand",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    terracotta: "bg-[#FBF0EB] text-[#B4461F] border-[#F3CFBF]",
    forest: "bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border-[#00E676]/40",
    sand: "bg-[#FAF5EC] text-[#1E2229] border-[#DACABA]",
    kohl: "bg-[#1E2229] text-[#FAF7F2] border-[#2A303A]",
    muted: "bg-[#F5F2EB] text-[#635C53] border-[#E8E2D7]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
