"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import {
  Plus,
  Share2,
  Sparkles,
  ShoppingBag,
  Bookmark,
  RefreshCw,
  Menu,
  X,
  ExternalLink,
  Store,
  Compass,
  CheckCircle2,
  PhoneCall,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

interface DashboardTopbarProps {
  onToggleMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
}

export function DashboardTopbar({
  onToggleMobileSidebar,
  mobileSidebarOpen
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    switchDemoRole,
    products,
    savedProductIds,
    savedCreatorIds,
    inquiries,
    showToast
  } = useHunar();
  const { t, currentLanguage, isRTL } = useLanguage();

  const isCustomerPath = pathname.startsWith("/dashboard/customer");
  const isSellerPath = pathname.startsWith("/dashboard/seller");
  const isSeller = isSellerPath ? true : isCustomerPath ? false : currentUser.role === "SELLER";

  const totalSavedCount = savedProductIds.length + savedCreatorIds.length;
  const activeOrdersCount = inquiries.filter(
    (i) => i.customerId === currentUser.id
  ).length;

  const handleRoleToggle = (newRole: "SELLER" | "CUSTOMER") => {
    switchDemoRole(newRole);
    if (newRole === "SELLER") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/customer");
    }
  };

  // Get current breadcrumb and page subtitle based on pathname
  const getContextInfo = () => {
    if (isSeller) {
      if (pathname === "/dashboard/seller") {
        return {
          badge: t("auth.artisanStudio"),
          title: t("dashboard.sellerOverview"),
          subtitle: `${currentUser.name} • ${currentUser.city || "Craft Studio"}`
        };
      }
      if (pathname.startsWith("/dashboard/seller/products/new")) {
        return {
          badge: t("auth.artisanStudio"),
          title: t("cta.addNewProduct"),
          subtitle: "Catalog addition with photos, medium & pricing"
        };
      }
      if (pathname.startsWith("/dashboard/seller/products")) {
        return {
          badge: t("nav.inventory"),
          title: t("nav.inventory"),
          subtitle: t("dashboard.stockCatalog")
        };
      }
      if (pathname.startsWith("/dashboard/seller/inquiries")) {
        return {
          badge: t("nav.leads"),
          title: t("nav.leads"),
          subtitle: t("dashboard.clientInquiries")
        };
      }
      if (pathname.startsWith("/dashboard/seller/opportunities")) {
        return {
          badge: t("nav.gigsRadar"),
          title: t("nav.gigsRadar"),
          subtitle: t("dashboard.radarDesc")
        };
      }
      if (pathname.startsWith("/dashboard/seller/roadmap")) {
        return {
          badge: t("nav.roadmap"),
          title: t("nav.roadmap"),
          subtitle: t("dashboard.incomeEngine")
        };
      }
      return {
        badge: t("auth.artisanStudio"),
        title: t("auth.artisanStudio"),
        subtitle: "Grassroots Craft Operations"
      };
    } else {
      // Customer
      if (pathname === "/dashboard/customer") {
        return {
          badge: t("auth.patronGuild"),
          title: t("nav.bazaar"),
          subtitle: t("dashboard.customerOverview")
        };
      }
      if (pathname.startsWith("/dashboard/customer/artisans")) {
        return {
          badge: t("nav.artisans"),
          title: t("nav.artisans"),
          subtitle: t("nav.artisansSub")
        };
      }
      if (pathname.startsWith("/dashboard/customer/post-gig")) {
        return {
          badge: t("nav.postGig"),
          title: t("nav.postGig"),
          subtitle: t("nav.postGigSub")
        };
      }
      if (pathname.startsWith("/dashboard/customer/orders")) {
        return {
          badge: t("nav.orders"),
          title: t("nav.orders"),
          subtitle: t("nav.ordersSub")
        };
      }
      if (pathname.startsWith("/dashboard/customer/wishlist")) {
        return {
          badge: t("nav.wishlist"),
          title: t("nav.wishlist"),
          subtitle: t("nav.wishlistSub")
        };
      }
      return {
        badge: t("auth.patronGuild"),
        title: t("nav.bazaar"),
        subtitle: "Zero Middleman Art Sourcing"
      };
    }
  };

  const contextInfo = getContextInfo();

  const handleShareHunarCard = () => {
    const cardUrl = `${window.location.origin}/u/rohit-pottery`;
    const shareText = encodeURIComponent(
      `Namaste! Explore my handcrafted pottery & studio ceramics portfolio on Hunar: ${cardUrl}`
    );
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
    showToast(
      "WhatsApp Link Generated",
      "Lookbook link copied for direct client sharing.",
      "whatsapp"
    );
  };

  return (
    <div
      className={`border-b px-4 sm:px-6 py-3 transition-colors duration-150 ${
        isSeller
          ? "bg-[#FAF7F2] border-[#E8E2D7]"
          : "bg-[#F5F8F6] border-[#D5E2D9]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-sm border border-[#D9D0C3] text-gray-700 hover:bg-white"
            title="Toggle Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                  isSeller
                    ? "bg-[#1E2229]/10 text-[#1E2229]"
                    : "bg-[#2D583B]/10 text-[#2D583B]"
                }`}
              >
                {contextInfo.badge}
              </span>
              <span className="hidden sm:inline text-xs text-gray-400">•</span>
              <span className="hidden sm:inline text-xs text-gray-500 font-medium truncate">
                {contextInfo.subtitle}
              </span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1A1816] truncate tracking-tight">
              {contextInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Persona-Differentiated Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isSeller ? (
            /* SELLER TOPBAR ACTIONS */
            <>
              {/* Share Hunar Card via WhatsApp */}
              <button
                onClick={handleShareHunarCard}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm border border-[#D9D0C3] bg-white text-[#1A1816] text-xs font-medium hover:bg-[#FAF7F2] transition-colors duration-150"
                title="Share your live Hunar Card via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-[#B4461F]" />
                <span className="hidden md:inline">{t("cta.shareLookbook")}</span>
              </button>

              {/* + New Artwork / Listing Quick-Action */}
              <Link
                href="/dashboard/seller/products/new"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium hover:bg-[#111418] transition-colors duration-150 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#E5A93B]" />
                <span className="hidden xs:inline">{t("cta.addNewProduct")}</span>
              </Link>
            </>
          ) : (
            /* CUSTOMER TOPBAR ACTIONS */
            <>
              {/* Saved Collections / Cart Indicator */}
              <Link
                href="/dashboard/customer/wishlist"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#D5E2D9] bg-white text-gray-700 text-xs font-medium hover:bg-[#EDF3EF] transition-colors duration-150"
                title="View Saved Artworks & Collections"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#2D583B]" />
                <span className="hidden sm:inline">{t("nav.wishlist")}</span>
                {totalSavedCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-xs bg-[#E5A93B] text-[#1E2229] text-[10px] font-bold">
                    {totalSavedCount}
                  </span>
                )}
              </Link>

              {/* My Orders Badge Indicator */}
              <Link
                href="/dashboard/customer/orders"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#D5E2D9] bg-white text-gray-700 text-xs font-medium hover:bg-[#EDF3EF] transition-colors duration-150"
                title="My Orders & Active Inquiries"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#2D583B]" />
                <span className="hidden sm:inline">{t("nav.orders")}</span>
                {activeOrdersCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-xs bg-[#2D583B] text-white text-[10px] font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </Link>

              {/* Post a Custom Request (₹) Quick-Action */}
              <Link
                href="/dashboard/customer/post-gig"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 shadow-xs"
              >
                <span className="hidden xs:inline">{t("nav.postGig")} (₹)</span>
              </Link>
            </>
          )}

          {/* 1-Click Switch Demo Account Toggle */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-gray-300 gap-2">
            <button
              onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-medium border transition-colors duration-150 ${
                isSeller
                  ? "bg-white border-[#D9D0C3] text-[#1A1816] hover:bg-[#FAF7F2]"
                  : "bg-white border-[#D5E2D9] text-[#1D3E29] hover:bg-[#EDF3EF]"
              }`}
              title={
                isSeller
                  ? "Switch to Patron / Customer view (Priya Nair)"
                  : "Switch to Artisan / Seller view (Rohit Sharma)"
              }
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span className="hidden md:inline">
                {isSeller ? "Patron Demo" : "Artisan Demo"}
              </span>
            </button>

            {/* In-Dashboard Language Selector */}
            <LanguageSelector className="shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
