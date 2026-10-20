"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
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
  ExternalLink,
  LogOut
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    switchDemoRole,
    logout,
    products,
    inquiries,
    savedProductIds,
    savedCreatorIds,
    cart,
    showToast
  } = useHunar();
  const { t, currentLanguage, setLanguage, toggleLanguage } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCustomerPath = pathname.startsWith("/dashboard/customer");
  const isSellerPath = pathname.startsWith("/dashboard/seller");
  const isSeller = isSellerPath ? true : isCustomerPath ? false : currentUser.role === "SELLER";

  // Badges & counts
  const pendingInquiriesCount = currentUser.id
    ? inquiries.filter((i) => i.sellerId === currentUser.id && i.status === "Under Review").length
    : 0;

  const totalSavedCount = savedProductIds.length + savedCreatorIds.length;
  const activeOrdersCount = currentUser.id
    ? inquiries.filter((i) => i.customerId === currentUser.id).length
    : 0;

  // Seller Navigation Items
  const sellerNav = [
    {
      href: "/dashboard/seller",
      label: t("nav.studioHub"),
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: "/dashboard/seller/products",
      label: t("nav.inventory"),
      icon: Package,
      exact: false
    },
    {
      href: "/dashboard/seller/inquiries",
      label: t("nav.leads"),
      icon: Inbox,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount}` : null,
      exact: false
    },
    {
      href: "/dashboard/seller/opportunities",
      label: t("nav.gigsRadar"),
      icon: Briefcase,
      exact: false
    },
    {
      href: "/dashboard/seller/roadmap",
      label: t("nav.roadmap"),
      icon: Milestone,
      exact: false
    }
  ];

  // Customer Navigation Items
  const customerNav = [
    {
      href: "/dashboard/customer",
      label: t("nav.bazaar"),
      icon: Compass,
      exact: true
    },
    {
      href: "/dashboard/customer/artisans",
      label: t("nav.artisans"),
      icon: Users,
      exact: false
    },
    {
      href: "/dashboard/customer/post-gig",
      label: t("nav.postGig"),
      icon: Sparkles,
      exact: false
    },
    {
      href: "/dashboard/customer/orders",
      label: t("nav.orders"),
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : null,
      exact: false
    },
    {
      href: "/dashboard/customer/wishlist",
      label: t("nav.wishlist"),
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
    <header className="sticky top-0 z-50 bg-[#FAF8F5] border-b border-[#E7E0D6] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo & Emblem Tile */}
        <div className="flex items-center gap-7 lg:gap-9">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xs bg-[#FAF5EC] border border-[#E7E0D6] flex items-center justify-center overflow-hidden shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/artworks/hunar-logo-tile.png"
                alt="Hunar Emblem"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
              <span className="font-serif font-bold text-sm text-[#7A2828] select-none">हु</span>
            </div>
            <span className="font-serif text-xl tracking-tight text-[#1E2229] font-medium group-hover:text-[#7A2828] transition-colors">
              Hunar
            </span>
          </Link>

          {/* Screenshot Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#535A66]">
            <Link
              href="/shop"
              className={`transition-colors hover:text-[#1E2229] ${
                pathname.startsWith("/shop") || pathname === "/dashboard/customer"
                  ? "text-[#1E2229] font-semibold border-b-2 border-[#1E2229] pb-0.5"
                  : ""
              }`}
            >
              Shop art
            </Link>
            <Link
              href="/artist/rhea-sharma"
              className={`transition-colors hover:text-[#1E2229] ${
                pathname.startsWith("/artist") || pathname.startsWith("/u/")
                  ? "text-[#1E2229] font-semibold border-b-2 border-[#1E2229] pb-0.5"
                  : ""
              }`}
            >
              Artist&apos;s story
            </Link>
            <Link
              href="/opportunities"
              className={`transition-colors hover:text-[#1E2229] ${
                pathname.startsWith("/opportunities")
                  ? "text-[#1E2229] font-semibold border-b-2 border-[#1E2229] pb-0.5"
                  : ""
              }`}
            >
              Mentorship
            </Link>
            {isSeller ? (
              <Link
                href="/dashboard/seller"
                className={`transition-colors hover:text-[#1E2229] ${
                  pathname.startsWith("/dashboard/seller")
                    ? "text-[#1E2229] font-semibold border-b-2 border-[#1E2229] pb-0.5"
                    : ""
                }`}
              >
                My dashboard
              </Link>
            ) : (
              <Link
                href="/dashboard/seller"
                className={`transition-colors hover:text-[#1E2229] ${
                  pathname.startsWith("/dashboard/seller")
                    ? "text-[#1E2229] font-semibold border-b-2 border-[#1E2229] pb-0.5"
                    : ""
                }`}
              >
                Sell on Hunar
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Cluster: Lang pill, Sign in / User, Cart, Demo Toggle */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          {/* Vernacular Language Pill: Lang: [Eng] */}
          <div className="flex items-center gap-1.5 text-xs text-[#535A66]">
            <span>Lang:</span>
            <button
              onClick={toggleLanguage}
              className="px-2 py-0.5 rounded-full bg-[#1E2229] text-[#FAF8F5] text-[11px] font-medium hover:bg-[#111418] transition-colors cursor-pointer"
              title="Toggle Vernacular Language"
            >
              {currentLanguage === "hi" ? "हिंदी" : "Eng"}
            </button>
          </div>

          {/* User Profile or Sign in */}
          {currentUser && currentUser.id !== "guest" && currentUser.name !== "Guest" ? (
            <div className="flex items-center gap-2">
              <Link
                href={isSeller ? "/dashboard/seller" : "/dashboard/customer"}
                className="text-xs text-[#1E2229] hover:text-[#7A2828] font-medium transition-colors"
              >
                {currentUser.name}
              </Link>
              <button
                onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
                className="text-[10px] text-[#A33F1C] hover:underline cursor-pointer"
                title="Switch Demo Persona"
              >
                ({isSeller ? "Seller" : "Patron"})
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs text-[#535A66] hover:text-[#1E2229] transition-colors"
            >
              Sign in
            </Link>
          )}

          {/* Cart Icon & Count */}
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs text-[#1E2229] hover:text-[#7A2828] font-normal transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#535A66]" />
            <span>Cart ({cart?.length ?? 0})</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/cart"
            className="flex items-center gap-1 text-xs text-[#1E2229] font-medium p-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-[#535A66]" />
            <span>({cart?.length ?? 0})</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-sm text-gray-700 hover:text-[#1E2229] hover:bg-[#FAF6ED]"
            title="Open Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <div className="pb-2">
              <LanguageSelector className="w-full" />
            </div>

            {isSeller ? (
              <Link
                href="/dashboard/seller/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium shadow-xs"
              >
                {t("cta.addNewProduct")}
              </Link>
            ) : (
              <Link
                href="/dashboard/customer/post-gig"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium shadow-xs"
              >
                {t("nav.postGig")} (₹)
              </Link>
            )}

            <button
              onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
              className="w-full text-center px-4 py-2 rounded-sm border border-[#D9D0C3] text-xs font-medium text-[#1A1816] hover:bg-[#EFEAE1]"
            >
              Switch to {isSeller ? "Patron Demo" : "Artisan Demo"}
            </button>

            {currentUser && currentUser.id !== "guest" && currentUser.name !== "Guest" && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full text-center px-4 py-2 rounded-sm border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("cta.signOut")}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
