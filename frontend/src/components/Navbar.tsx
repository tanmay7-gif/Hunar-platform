"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import {
  Compass,
  Users,
  Sparkles,
  ShoppingBag,
  Bookmark,
  LayoutDashboard,
  Package,
  Inbox,
  Briefcase,
  Milestone,
  Store,
  RefreshCw,
  Globe,
  User,
  Plus,
  Share2,
  Menu,
  X,
  ExternalLink
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    language,
    toggleLanguage,
    currentUser,
    switchDemoRole,
    products,
    inquiries,
    savedProductIds,
    savedCreatorIds,
    showToast
  } = useHunar();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHindi = language === "hi";
  const isCustomerPath = pathname.startsWith("/dashboard/customer");
  const isSellerPath = pathname.startsWith("/dashboard/seller");
  const isSeller = isSellerPath ? true : isCustomerPath ? false : currentUser.role === "SELLER";

  // Badges & counts
  const pendingInquiriesCount = inquiries.filter(
    (i) =>
      (i.sellerId === currentUser.id || i.sellerId === "user-rohit-seller") &&
      i.status === "Under Review"
  ).length;

  const totalSavedCount = savedProductIds.length + savedCreatorIds.length;
  const activeOrdersCount = inquiries.filter(
    (i) => i.customerId === currentUser.id || i.customerId === "user-priya-customer"
  ).length;

  // Seller Navigation Items
  const sellerNav = [
    {
      href: "/dashboard/seller",
      label: isHindi ? "स्टूडियो हब" : "Studio Hub",
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: "/dashboard/seller/products",
      label: isHindi ? "इन्वेंटरी" : "Craft Inventory",
      icon: Package,
      exact: false
    },
    {
      href: "/dashboard/seller/inquiries",
      label: isHindi ? "ग्राहक लीड्स" : "Leads & Boli",
      icon: Inbox,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount}` : null,
      exact: false
    },
    {
      href: "/dashboard/seller/opportunities",
      label: isHindi ? "गिग रडार" : "Open Gigs Radar",
      icon: Briefcase,
      exact: false
    },
    {
      href: "/dashboard/seller/roadmap",
      label: isHindi ? "कला रोडमैप" : "Kala Roadmap",
      icon: Milestone,
      exact: false
    }
  ];

  // Customer Navigation Items
  const customerNav = [
    {
      href: "/dashboard/customer",
      label: isHindi ? "शिल्प बाज़ार" : "Bazaar (Explore)",
      icon: Compass,
      exact: true
    },
    {
      href: "/dashboard/customer/artisans",
      label: isHindi ? "कारीगर खोजें" : "Discover Artisans",
      icon: Users,
      exact: false
    },
    {
      href: "/dashboard/customer/post-gig",
      label: isHindi ? "ज़रूरत पोस्ट करें" : "Post Requirement",
      icon: Sparkles,
      exact: false
    },
    {
      href: "/dashboard/customer/orders",
      label: isHindi ? "मेरे ऑर्डर" : "My Orders & Bids",
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : null,
      exact: false
    },
    {
      href: "/dashboard/customer/wishlist",
      label: isHindi ? "सहेजे गए" : "Saved Collections",
      icon: Bookmark,
      badge: totalSavedCount > 0 ? `${totalSavedCount}` : null,
      exact: false
    }
  ];

  const currentNav = isSeller ? sellerNav : customerNav;

  const handleRoleToggle = (targetRole: "SELLER" | "CUSTOMER") => {
    switchDemoRole(targetRole);
    if (pathname.startsWith("/dashboard")) {
      if (targetRole === "SELLER") {
        router.push("/dashboard/seller");
      } else {
        router.push("/dashboard/customer");
      }
    }
    setMobileMenuOpen(false);
  };

  const handleShareCard = () => {
    const cardUrl = `${window.location.origin}/u/rohit-pottery`;
    const shareText = encodeURIComponent(
      `Namaste! Explore my handcrafted pottery & studio ceramics lookbook on Hunar: ${cardUrl}`
    );
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
    showToast(
      "WhatsApp Link Ready",
      "Lookbook link copied for direct client sharing.",
      "whatsapp"
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2] border-b border-[#E8E2D7] transition-colors">
      {/* Top Vernacular Strip & Differentiated Role Switcher */}
      <div className="bg-[#1E2229] text-[#FAF7F2] px-4 py-1.5 text-xs font-medium border-b border-[#2C323D]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left badge */}
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#D9D0C3] truncate font-medium">
              {isSeller
                ? "Artisan Studio Mode • 0% Commission • Direct WhatsApp Inquiries"
                : "Patron Curation Mode • Authentic Grassroots Crafts • Direct Artisan Equity"}
            </span>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Active Role Indicator & 1-Click Role Switch */}
            <div className="flex items-center gap-1.5 bg-[#2A313D] px-2.5 py-0.5 rounded-sm border border-[#3E4756] text-[11px]">
              <span className="text-gray-400 hidden lg:inline">Active:</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded-xs text-[10px] ${
                  isSeller ? "bg-[#B4461F] text-white" : "bg-[#2D583B] text-white"
                }`}
              >
                {currentUser.role}
              </span>
              <span className="font-semibold text-[#FAF7F2] hidden sm:inline truncate max-w-[120px]">
                {currentUser.name}
              </span>

              {/* Instant 1-Click Demo Switcher */}
              <button
                onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
                className="ml-1 text-[10px] font-bold text-[#E5A93B] hover:text-white flex items-center gap-0.5 underline underline-offset-2"
                title={
                  isSeller
                    ? "Switch to Patron (Priya Nair)"
                    : "Switch to Artisan (Rohit Sharma)"
                }
              >
                <RefreshCw className="w-3 h-3 inline" />
                <span className="hidden md:inline">
                  {isSeller ? "Switch to Patron" : "Switch to Artisan"}
                </span>
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-0.5 rounded-sm border border-[#D9D0C3]/30 hover:border-[#E5A93B] text-[#FAF7F2] hover:text-[#E5A93B] transition-colors duration-150"
              title="Toggle Hindi / English"
            >
              <Globe className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span className="font-semibold">{isHindi ? "English" : "हिन्दी"}</span>
            </button>

            {/* Auth Link */}
            <Link
              href="/login"
              className="text-xs text-[#D9D0C3] hover:text-white flex items-center gap-1 transition-colors duration-150"
              title="Auth & Demo Logins"
            >
              <User className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span className="hidden sm:inline">Auth</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Persona-Differentiated Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`w-9 h-9 rounded-sm flex items-center justify-center text-[#FAF7F2] shadow-xs transition-colors duration-150 border ${
              isSeller
                ? "bg-[#1E2229] border-[#3E4756]"
                : "bg-[#2D583B] border-[#1D3E29]"
            }`}
          >
            <span className="font-serif text-lg font-bold">हु</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A1816]">
                हुनर
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase font-bold ${
                  isSeller ? "text-[#B4461F]" : "text-[#2D583B]"
                }`}
              >
                {isSeller ? "STUDIO" : "PATRON"}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium tracking-tight">
              {isSeller ? "Artisan Workshop Workbench" : "Grassroots Artisans Guild"}
            </p>
          </div>
        </Link>

        {/* Differentiated Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? isSeller
                      ? "bg-[#EFEAE1] text-[#1E2229] border border-[#D9D0C3]"
                      : "bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB]"
                    : "text-[#1A1816] hover:bg-[#EFEAE1]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? isSeller
                        ? "text-[#B4461F]"
                        : "text-[#2D583B]"
                      : "text-gray-500"
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${
                      isActive
                        ? isSeller
                          ? "bg-[#1E2229] text-white"
                          : "bg-[#2D583B] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {isSeller ? (
            /* Seller Studio Quick Actions */
            <>
              <button
                onClick={handleShareCard}
                className="px-3.5 py-2 rounded-sm border border-[#D9D0C3] text-xs font-medium text-[#1E2229] hover:bg-[#EFEAE1] transition-colors duration-150 flex items-center gap-1.5"
                title="Share your Hunar lookbook on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-[#B4461F]" />
                <span className="hidden xl:inline">Share Card</span>
              </button>

              <Link
                href="/dashboard/seller/products/new"
                className="px-4 py-2 rounded-sm bg-[#1E2229] text-[#FAF7F2] text-xs font-medium hover:bg-[#111418] transition-colors duration-150 flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#E5A93B]" />
                <span>{isHindi ? "+ कलाकृति जोड़ें" : "+ New Artwork"}</span>
              </Link>
            </>
          ) : (
            /* Customer Patron Quick Actions */
            <>
              <Link
                href="/dashboard/customer/wishlist"
                className="px-3 py-2 rounded-sm border border-[#D9D0C3] text-xs font-medium text-[#1A1816] hover:bg-[#EFEAE1] transition-colors duration-150 flex items-center gap-1"
                title="Saved Shortlists & Artworks"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#2D583B]" />
                {totalSavedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-xs bg-[#E5A93B] text-[#1E2229] text-[10px] font-bold">
                    {totalSavedCount}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard/customer/post-gig"
                className="px-4 py-2 rounded-sm bg-[#1E2229] text-[#FAF7F2] text-xs font-medium hover:bg-[#111418] transition-colors duration-150 flex items-center gap-1.5 shadow-xs"
              >
                <span>{isHindi ? "ज़रूरत पोस्ट करें (₹)" : "Post Requirement (₹)"}</span>
              </Link>
            </>
          )}

          <Link
            href="/login"
            className="px-3 py-2 rounded-sm border border-[#D9D0C3] text-xs font-medium text-[#1A1816] hover:bg-[#EFEAE1] transition-colors duration-150"
          >
            {isHindi ? "लॉगिन" : "Demo Logins"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
            className="px-2 py-1 rounded bg-[#FAF5EC] border border-[#DACABA] text-[10px] font-bold text-[#C85A32]"
          >
            {isSeller ? "Patron Mode" : "Artisan Mode"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-[#1E2229] hover:bg-[#FAF6ED]"
            title="Open Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D7] bg-[#FAF7F2] px-4 py-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2 pb-1">
            {isSeller ? "Artisan Studio Navigation" : "Patron Discovery Navigation"}
          </p>

          <div className="grid grid-cols-1 gap-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-sm text-xs font-semibold flex items-center justify-between ${
                    isActive
                      ? isSeller
                        ? "bg-[#1E2229] text-white"
                        : "bg-[#2D583B] text-white"
                      : "text-[#1A1816] hover:bg-[#EFEAE1]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E8E2D7] flex flex-col gap-2">
            {isSeller ? (
              <Link
                href="/dashboard/seller/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium shadow-xs"
              >
                + Upload New Artwork
              </Link>
            ) : (
              <Link
                href="/dashboard/customer/post-gig"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium shadow-xs"
              >
                Post a Custom Requirement (₹)
              </Link>
            )}

            <button
              onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
              className="w-full text-center px-4 py-2 rounded-sm border border-[#D9D0C3] text-xs font-medium text-[#1A1816] hover:bg-[#EFEAE1]"
            >
              Switch to {isSeller ? "Patron (Priya Nair)" : "Artisan (Rohit Sharma)"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
