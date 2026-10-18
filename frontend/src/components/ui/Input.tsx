import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#1E2229]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] placeholder:text-gray-400 focus:outline-none focus:border-[#B4461F] transition-colors duration-150 ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
