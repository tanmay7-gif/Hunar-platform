"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
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
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Video,
  MessageSquare
} from "lucide-react";

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    switchDemoRole,
    products,
    inquiries,
    opportunities,
    savedProductIds,
    savedCreatorIds,
    mentorshipBookings,
    conversations
  } = useHunar();
  const { t, currentLanguage, isRTL } = useLanguage();

  const isCustomerPath = pathname.startsWith("/dashboard/customer");
  const isSellerPath = pathname.startsWith("/dashboard/seller");
  const isSeller = isSellerPath ? true : isCustomerPath ? false : currentUser.role === "SELLER";

  // Active user profile display info (dynamic for authenticated accounts)
  const activeProfile = {
    name: currentUser.name,
    city: currentUser.city || (isSeller ? "Craft Studio" : "PAN-India Patron"),
    tagline:
      currentUser.tagline ||
      (isSeller ? "Artisan Creator & Studio Master" : "Art Patron & Collector"),
    avatar:
      currentUser.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        currentUser.name || "User"
      )}&backgroundColor=b4461f,2d583b`
  };

  // Counts for live badges
  const sellerProductsCount = products.filter((p) => p.sellerId === currentUser.id).length;
  const sellerInquiriesCount = inquiries.filter((i) => i.sellerId === currentUser.id).length;
  const pendingInquiriesCount = inquiries.filter(
    (i) => i.sellerId === currentUser.id && i.status === "Under Review"
  ).length;
  const openGigsCount = opportunities.length;
  const sellerMentorshipCount = mentorshipBookings.filter(
    (b) =>
      b.mentorId === currentUser.id ||
      b.mentorId === "demo-seller-rohit" ||
      (currentUser.username && b.mentorId === "creator-rohit")
  ).length;

  const customerOrdersCount = inquiries.filter((i) => i.customerId === currentUser.id).length;
  const customerSavedCount = savedProductIds.length + savedCreatorIds.length;

  // Cleaned Seller Navigation Items
  const sellerNav = [
    {
      title: t("nav.studioHub"),
      href: "/dashboard/seller",
      icon: LayoutDashboard,
      badge: null,
      sublabel: t("nav.studioHubSub"),
      exact: true
    },
    {
      title: t("nav.inventory"),
      href: "/dashboard/seller/products",
      icon: Package,
      badge: `${sellerProductsCount} ${t("dashboard.items")}`,
      sublabel: t("nav.inventorySub"),
      exact: false
    },
    {
      title: t("nav.mentorship", "Mentorship & Guidance"),
      href: "/dashboard/seller/mentorship",
      icon: Video,
      badge: sellerMentorshipCount > 0 ? `${sellerMentorshipCount} Active` : "Opt-in",
      badgeColor: "bg-[#1E2229] text-white",
      sublabel: "1-on-1 Paid Sessions",
      exact: false
    },
    {
      title: t("nav.leads"),
      href: "/dashboard/seller/inquiries",
      icon: Inbox,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} ${t("dashboard.new")}` : `${sellerInquiriesCount}`,
      badgeColor: pendingInquiriesCount > 0 ? "bg-[#C85A32] text-white" : "bg-[#FAF5EC] text-[#8B3B18]",
      sublabel: t("nav.leadsSub"),
      exact: false
    },
    {
      title: "Direct Messages & Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      badge: "In-App",
      badgeColor: "bg-[#1E2229] text-white",
      sublabel: "Buyer & Patron Chat",
      exact: false
    },
    {
      title: t("nav.gigsRadar"),
      href: "/dashboard/seller/opportunities",
      icon: Briefcase,
      badge: `${openGigsCount} ${t("dashboard.live")}`,
      sublabel: t("nav.gigsRadarSub"),
      exact: false
    },
    {
      title: t("nav.roadmap"),
      href: "/dashboard/seller/roadmap",
      icon: Milestone,
      badge: null,
      sublabel: t("nav.roadmapSub"),
      exact: false
    },
    {
      title: "Admin Logistics & Hubs",
      href: "/dashboard/admin",
      icon: ShieldCheck,
      badge: "TinyFish Live",
      badgeColor: "bg-[#1E2229] text-white",
      sublabel: "Logistics Benchmarks & Hubs",
      exact: false
    }
  ];

  // Customer Navigation Items
  const customerNav = [
    {
      title: t("nav.bazaar"),
      href: "/dashboard/customer",
      icon: Compass,
      badge: "8 pieces",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2 py-0.5 rounded-sm",
      sublabel: t("nav.bazaarSub"),
      exact: true
    },
    {
      title: "Messages & Inquiries",
      href: "/dashboard/customer/messages",
      icon: MessageSquare,
      badge: "Live",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded-sm inline-flex items-center gap-1.5",
      hasLiveDot: true,
      sublabel: "Chat with Artisans",
      exact: false
    },
    {
      title: t("nav.artisans"),
      href: "/dashboard/customer/artisans",
      icon: Users,
      badge: null,
      sublabel: t("nav.artisansSub"),
      exact: false
    },
    {
      title: t("nav.postGig"),
      href: "/dashboard/customer/post-gig",
      icon: Sparkles,
      badge: "Custom",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-sm",
      sublabel: t("nav.postGigSub"),
      exact: false
    },
    {
      title: t("nav.orders"),
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
      badge: "3",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded-sm",
      sublabel: t("nav.ordersSub"),
      exact: false
    },
    {
      title: t("nav.wishlist"),
      href: "/dashboard/customer/wishlist",
      icon: Bookmark,
      badge: "4",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded-sm",
      sublabel: t("nav.wishlistSub"),
      exact: false
    }
  ];

  const currentNav = isSeller ? sellerNav : customerNav;

  const handleRoleToggle = (newRole: "SELLER" | "CUSTOMER") => {
    switchDemoRole(newRole);
    if (newRole === "SELLER") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/customer");
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 lg:top-[57px] ${
        isRTL ? "right-0 border-l" : "left-0 border-r"
      } z-40 h-full lg:h-[calc(100vh-57px)] w-72 shrink-0 flex flex-col transition-transform duration-150 ease-in-out bg-[#FAF7F2] border-[#E8E2D7] text-[#1A1816] ${
        mobileOpen
          ? "translate-x-0"
          : isRTL
          ? "translate-x-full lg:translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Sidebar Header: Role Identity & Workshop Profile */}
      <div className="p-4 border-b border-[#E8E2D7] bg-[#F2EDE4]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-sm overflow-hidden flex-shrink-0 bg-white border border-[#E8E2D7] p-0.5 shadow-xs">
              <Image
                src="/assets/logo-compact.png"
                alt="Hunar Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm text-[#C85A32] leading-tight">Hunar</span>
                <span
                  className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded-xs bg-[#1E2229]/10 text-[#1E2229]"
                >
                  {isSeller ? "STUDIO" : "PATRON"}
                </span>
              </div>
              <p className="text-[9px] font-medium tracking-wide uppercase text-[#635C53]">
                By Flytech
              </p>
            </div>
          </div>

          {/* Quick 1-Click Role Switch Toggle */}
          <button
            onClick={() => handleRoleToggle(isSeller ? "CUSTOMER" : "SELLER")}
            className="p-1.5 rounded-sm border border-[#D9D0C3] bg-white text-gray-700 hover:text-[#1A1816] hover:bg-[#FAF7F2] transition-colors duration-150 shrink-0"
            title={isSeller ? "Switch to Patron (Priya Nair)" : "Switch to Artisan (Rohit Sharma)"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Persona Card */}
        <div className="px-3 py-2 rounded-sm border bg-[#FFFFFF] border-[#E8E2D7] flex items-center gap-2.5">
          <img
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-9 h-9 object-cover rounded-full aspect-square ring-2 ring-[#EFECE6] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-[#1A1816] truncate">{activeProfile.name}</p>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#B4461F]" />
            </div>
            <p className="text-[10px] text-gray-500 truncate">
              {activeProfile.city}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
        <div className="px-3 pb-2 flex items-center justify-between">
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isSeller ? "text-[#8A7561]" : "text-emerald-700 font-bold"
            }`}
          >
            {isSeller ? "Studio Toolset & Workbench" : "Patron Discovery & Orders"}
          </p>
          {!isSeller && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          )}
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between py-2.5 px-3.5 rounded-sm text-xs font-semibold transition-colors duration-150 ${
                isActive
                  ? isSeller
                    ? "bg-[#1E2229] text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold shadow-xs"
                  : isSeller
                  ? "text-[#2A313D] hover:bg-[#EFEAE1] hover:text-[#1A1816]"
                  : "text-[#2A313D] hover:bg-emerald-50/60 hover:text-emerald-900"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? isSeller
                        ? "text-[#E5A93B]"
                        : "text-emerald-700"
                      : isSeller
                      ? "text-[#8A7561] group-hover:text-[#1A1816]"
                      : "text-gray-500 group-hover:text-emerald-700"
                  }`}
                />
                <div className="truncate">
                  <div className="leading-tight truncate">{item.title}</div>
                  <div
                    className={`text-[10px] leading-tight truncate font-normal ${
                      isActive
                        ? isSeller
                          ? "text-white/80"
                          : "text-emerald-700/80"
                        : "text-gray-500"
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 shrink-0 ${
                    item.badgeColor ||
                    (isSeller
                      ? "bg-[#FAF5EC] text-[#8B3B18] border border-[#E8DEC8] px-1.5 py-0.5 rounded-xs text-[10px] font-bold"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded-sm text-xs")
                  }`}
                >
                  {item.hasLiveDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  )}
                  <span>{item.badge}</span>
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Role-Specific Studio Quick Card at Bottom */}
      <div className="p-3.5 m-3 rounded-sm border bg-[#FFFFFF] border-[#E8E2D7]">
        {isSeller ? (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1E2229] mb-1">
              <span>Live Studio Lookbook</span>
              <span className="text-[10px] text-gray-500 font-mono">Hunar Card</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug mb-2.5">
              Khurja ceramic studio portfolio is public and receiving direct WhatsApp orders.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/u/rohit-pottery"
                target="_blank"
                className="flex-1 text-center px-2 py-1.5 rounded-sm bg-[#1E2229] text-white text-[11px] font-medium hover:bg-[#111418] transition-colors duration-150 flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                href="/dashboard/seller/products/new"
                className="px-2.5 py-1.5 rounded-sm border border-[#D9D0C3] bg-white text-[#1A1816] text-[11px] font-medium hover:bg-[#FAF7F2] transition-colors duration-150"
                title="Add artwork to catalog"
              >
                {t("cta.addNewProduct")}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1E2229] mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B4461F]" />
                {t("dashboard.directArtisanEquity")}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">0% Cut</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug mb-2.5">
              100% of your commission fee reaches the artisan. Direct WhatsApp coordination.
            </p>
            <Link
              href="/dashboard/customer/post-gig"
              className="w-full text-center px-2 py-1.5 rounded-sm bg-[#1E2229] text-white text-[11px] font-medium hover:bg-[#111418] transition-colors duration-150 flex items-center justify-center gap-1 shadow-xs"
            >
              <span>{t("cta.commissionWork")}</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
