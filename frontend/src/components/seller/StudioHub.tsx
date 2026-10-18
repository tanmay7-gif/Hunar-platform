"use client";

import React from "react";
import Link from "next/link";
import { Product, CustomerInquiry, UserAccount } from "@/types";
import { Package, Inbox, Briefcase, Plus, ArrowRight, CheckCircle2 } from "lucide-react";

interface StudioHubProps {
  currentUser: UserAccount;
  products: Product[];
  inquiries: CustomerInquiry[];
  isHindi?: boolean;
}

export function StudioHub({
  currentUser,
  products,
  inquiries,
  isHindi = false,
}: StudioHubProps) {
  const activeProducts = products.filter((p) => p.status === "Live");
  const pendingInquiries = inquiries.filter((i) => i.status === "Under Review");
  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const metrics = [
    {
      label: isHindi ? "सक्रिय उत्पाद" : "Active Inventory Listings",
      value: activeProducts.length,
      icon: Package,
      link: "/dashboard/seller/products",
    },
    {
      label: isHindi ? "समीक्षाधीन बोलियां" : "Quotes Under Review",
      value: pendingInquiries.length,
      icon: Inbox,
      link: "/dashboard/seller/inquiries",
    },
    {
      label: isHindi ? "कुल कैटलॉग मूल्य" : "Total Inventory Valuation",
      value: `₹${totalCatalogValue.toLocaleString("en-IN")}`,
      icon: Briefcase,
      link: "/dashboard/seller/products",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              href={m.link}
              className="p-6 rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-150 flex items-center justify-between group"
            >
              <div>
                <p className="text-xs uppercase font-semibold text-[#8A7561] tracking-wider">
                  {m.label}
                </p>
                <p className="text-2xl font-serif font-bold text-[#1E2229] mt-1">
                  {m.value}
                </p>
              </div>
              <div className="p-3 rounded-sm bg-[#FAF6ED] border border-[#E8DEC8] group-hover:border-[#B4461F] transition-colors duration-150">
                <Icon className="w-5 h-5 text-[#B4461F]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Strip */}
      <div className="p-6 rounded-sm bg-[#FAF7F2] border border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[#1E2229]">
            {isHindi ? "नया शिल्प उत्पाद अपलोड करें" : "Publish a New Handmade Work to Your Studio"}
          </h3>
          <p className="text-xs text-[#635C53] mt-0.5">
            {isHindi
              ? "सीधी कीमत, फोटो और सामग्री विवरण के साथ अपनी कला को राष्ट्रीय संरक्षकों के सामने लाएं।"
              : "Zero platform fees, verified provenance certificates, and direct WhatsApp buyer engagement."}
          </p>
        </div>
        <Link
          href="/dashboard/seller/products/new"
          className="px-4 py-2.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isHindi ? "नया उत्पाद जोड़ें" : "New Artwork Listing"}</span>
        </Link>
      </div>
    </div>
  );
}
