"use client";

import React from "react";
import Link from "next/link";
import { MentorshipManager } from "@/components/seller/MentorshipManager";
import { useHunar } from "@/context/HunarContext";
import { ChevronLeft } from "lucide-react";

export default function SellerMentorshipPage() {
  const { language } = useHunar();
  const isHindi = language === "hi";

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/seller"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#635C53] hover:text-[#B4461F] transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isHindi ? "स्टूडियो डैशबोर्ड पर वापस जाएं" : "Back to Studio Dashboard"}</span>
        </Link>
      </div>

      <MentorshipManager isHindi={isHindi} />
    </div>
  );
}
