"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageSelectorProps {
  className?: string;
  variant?: "navbar" | "topbar" | "compact";
  showIcon?: boolean;
}

export function LanguageSelector({
  className = "",
  variant = "navbar",
  showIcon = true
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Language"
        className={`flex items-center gap-1.5 bg-[#FAF7F2] border border-[#D9D0C3] text-[#1E2229] hover:border-[#B4461F] transition-colors duration-150 rounded-sm text-sm px-3 py-1.5 font-medium cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#B4461F] shadow-2xs ${
          isOpen ? "border-[#B4461F] ring-1 ring-[#B4461F]" : ""
        }`}
      >
        {showIcon && <Globe className="w-3.5 h-3.5 text-[#B4461F] shrink-0" />}
        <span className="font-semibold">{activeLang.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#535A66] transition-transform duration-150 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 right-0 min-w-[160px] bg-[#FAF7F2] border border-[#D9D0C3] rounded-sm shadow-md py-1 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1 text-[11px] font-semibold text-[#8B3B18] uppercase tracking-wider border-b border-[#E8E2D7] bg-[#F5EFE6]">
            भाषा / Language
          </div>
          <div className="max-h-64 overflow-y-auto py-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? "bg-[#F3CFBF]/40 text-[#A33F1C] font-bold"
                      : "text-[#1E2229] hover:bg-[#EFEAE1] hover:text-[#A33F1C]"
                  }`}
                  dir={lang.dir}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[13px]">{lang.nativeName}</span>
                    <span className="text-[10px] text-[#78716C] font-normal">
                      ({lang.label})
                    </span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B4461F] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
