"use client";

import React from "react";
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
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight
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
    language,
    products,
    inquiries,
    opportunities,
    savedProductIds,
    savedCreatorIds
  } = useHunar();

  const isHindi = language === "hi";
  const isCustomerPath = pathname.startsWith("/dashboard/customer");
  const isSellerPath = pathname.startsWith("/dashboard/seller");
  const isSeller = isSellerPath ? true : isCustomerPath ? false : currentUser.role === "SELLER";

  // Active persona display info
  const activeProfile = isSeller
    ? {
        name: "Rohit Sharma",
        city: "Khurja / Delhi NCR",
        tagline: "Master Ceramicist & Terracotta Sculptor",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
      }
    : {
        name: "Priya Nair",
        city: "South Delhi / PAN-India",
        tagline: "Art Collector & Interior Curator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
      };

  // Counts for live badges
  const sellerProductsCount = products.filter(
    (p) => p.sellerId === currentUser.id || currentUser.id === "user-rohit-seller"
  ).length;
  const sellerInquiriesCount = inquiries.filter(
    (i) => i.sellerId === currentUser.id || i.sellerId === "user-rohit-seller"
  ).length;
  const pendingInquiriesCount = inquiries.filter(
    (i) =>
      (i.sellerId === currentUser.id || i.sellerId === "user-rohit-seller") &&
      i.status === "Under Review"
  ).length;
  const openGigsCount = opportunities.length;

  const customerOrdersCount = inquiries.filter(
    (i) => i.customerId === currentUser.id || i.customerId === "user-priya-customer"
  ).length;
  const customerSavedCount = savedProductIds.length + savedCreatorIds.length;

  // Cleaned Seller Navigation Items
  const sellerNav = [
    {
      title: isHindi ? "स्टूडियो हब" : "Studio Hub",
      href: "/dashboard/seller",
      icon: LayoutDashboard,
      badge: null,
      sublabel: isHindi ? "समीक्षा एवं आय" : "Metrics & Pipeline",
      exact: true
    },
    {
      title: isHindi ? "शिल्प इन्वेंटरी" : "My Craft Inventory",
      href: "/dashboard/seller/products",
      icon: Package,
      badge: `${sellerProductsCount} items`,
      sublabel: isHindi ? "उत्पाद सूची व स्टॉक" : "Stock, Prices & Catalog",
      exact: false
    },
    {
      title: isHindi ? "ग्राहक लीड्स एवं बोली" : "Client Leads & Boli",
      href: "/dashboard/seller/inquiries",
      icon: Inbox,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} new` : `${sellerInquiriesCount}`,
      badgeColor: pendingInquiriesCount > 0 ? "bg-[#C85A32] text-white" : "bg-[#FAF5EC] text-[#8B3B18]",
      sublabel: isHindi ? "कमीशन पूछताछ" : "Commission Briefs & Chats",
      exact: false
    },
    {
      title: isHindi ? "खुले अवसर रडार" : "Open Gigs Radar",
      href: "/dashboard/seller/opportunities",
      icon: Briefcase,
      badge: `${openGigsCount} live`,
      sublabel: isHindi ? "स्थानीय बोलियां व दीवारें" : "Cafe Walls, Weddings & Grants",
      exact: false
    },
    {
      title: isHindi ? "कला रोडमैप" : "Kala Roadmap",
      href: "/dashboard/seller/roadmap",
      icon: Milestone,
      badge: null,
      sublabel: isHindi ? "मासिक लक्ष्य व मील के पत्थर" : "Income Goals & Studio Milestones",
      exact: false
    }
  ];

  // Customer Navigation Items
  const customerNav = [
    {
      title: isHindi ? "शिल्प बाज़ार (कला खोजें)" : "Bazaar (Explore Art)",
      href: "/dashboard/customer",
      icon: Compass,
      badge: `${products.length} pieces`,
      sublabel: isHindi ? "तैयार हस्तशिल्प कलाकृतियां" : "Ready-to-Ship Crafts",
      exact: true
    },
    {
      title: isHindi ? "कारीगर खोजें" : "Discover Artisans",
      href: "/dashboard/customer/artisans",
      icon: Users,
      badge: null,
      sublabel: isHindi ? "क्षेत्रीय मास्टर स्टूडियो" : "Directory by City & Medium",
      exact: false
    },
    {
      title: isHindi ? "ज़रूरत पोस्ट करें" : "Post a Requirement",
      href: "/dashboard/customer/post-gig",
      icon: Sparkles,
      badge: "Custom",
      badgeColor: "bg-[#2D583B] text-white",
      sublabel: isHindi ? "म्यूरल, विवाह व उपहार" : "Commission Custom Work",
      exact: false
    },
    {
      title: isHindi ? "मेरे ऑर्डर व बोलियां" : "My Orders & Custom Bids",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
      badge: customerOrdersCount > 0 ? `${customerOrdersCount}` : null,
      sublabel: isHindi ? "ऑर्डर ट्रैकर एवं स्थिति" : "Active Inquiries & Tracking",
      exact: false
    },
    {
      title: isHindi ? "सहेजे गए संग्रह" : "Saved Collections",
      href: "/dashboard/customer/wishlist",
      icon: Bookmark,
      badge: customerSavedCount > 0 ? `${customerSavedCount}` : null,
      sublabel: isHindi ? "पसंदीदा कारीगर व कला" : "Wishlist & Moodboards",
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
      className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-40 h-full lg:h-[calc(100vh-57px)] w-72 shrink-0 flex flex-col border-r transition-transform duration-150 ease-in-out ${
        isSeller
          ? "bg-[#FAF7F2] border-[#E8E2D7] text-[#1A1816]"
          : "bg-[#F5F8F6] border-[#D5E2D9] text-[#1A1816]"
      } ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Sidebar Header: Role Identity & Workshop Profile */}
      <div
        className={`p-4 border-b ${
          isSeller
            ? "border-[#E8E2D7] bg-[#F2EDE4]"
            : "border-[#D5E2D9] bg-[#EDF3EF]"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-white shadow-xs ${
                isSeller ? "bg-[#1E2229]" : "bg-[#2D583B]"
              }`}
            >
              {isSeller ? (
                <Store className="w-4 h-4 text-[#FAF7F2]" />
              ) : (
                <Compass className="w-4 h-4 text-[#F7F9F6]" />
              )}
            </div>
            <div>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs ${
                  isSeller
                    ? "bg-[#1E2229]/10 text-[#1E2229]"
                    : "bg-[#2D583B]/10 text-[#1D3E29]"
                }`}
              >
                {isSeller ? "Artisan Studio" : "Patron Guild"}
              </span>
              <h2 className="font-serif font-bold text-sm tracking-tight text-[#1A1816] leading-tight">
                {isSeller ? "Studio Workshop Hub" : "Patron Discovery Hub"}
              </h2>
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
        <div
          className={`px-3 py-2 rounded-sm border flex items-center gap-2.5 ${
            isSeller
              ? "bg-[#FFFFFF] border-[#E8E2D7]"
              : "bg-[#FFFFFF] border-[#D5E2D9]"
          }`}
        >
          <img
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-9 h-9 object-cover rounded-full aspect-square ring-2 ring-[#EFECE6] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-[#1A1816] truncate">{activeProfile.name}</p>
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSeller ? "text-[#B4461F]" : "text-[#2D583B]"
                }`}
              />
            </div>
            <p className="text-[10px] text-gray-500 truncate">
              {activeProfile.city}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A7561]">
          {isSeller ? "Studio Toolset & Workbench" : "Patron Discovery & Orders"}
        </p>

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
                    : "bg-[#2D583B] text-white shadow-xs"
                  : isSeller
                  ? "text-[#2A313D] hover:bg-[#EFEAE1] hover:text-[#1A1816]"
                  : "text-[#2A313D] hover:bg-[#E9F0EA] hover:text-[#1A1816]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-[#E5A93B]"
                      : isSeller
                      ? "text-[#8A7561]"
                      : "text-[#2D583B]"
                  }`}
                />
                <div className="truncate">
                  <div className="leading-tight truncate">{item.title}</div>
                  <div
                    className={`text-[10px] leading-tight truncate font-normal ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-xs text-[10px] font-bold shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeColor ||
                        (isSeller
                          ? "bg-[#FAF5EC] text-[#8B3B18] border border-[#E8DEC8]"
                          : "bg-[#EEF4F0] text-[#23452E] border border-[#D5E2D9]")
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Role-Specific Studio Quick Card at Bottom */}
      <div
        className={`p-3.5 m-3 rounded-sm border ${
          isSeller
            ? "bg-[#FFFFFF] border-[#E8E2D7]"
            : "bg-[#FFFFFF] border-[#D5E2D9]"
        }`}
      >
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
                + New
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#23452E] mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D583B]" />
                Direct Artisan Equity
              </span>
              <span className="text-[10px] text-gray-500 font-mono">0% Cut</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug mb-2.5">
              100% of your commission fee reaches the artisan. Direct WhatsApp coordination.
            </p>
            <Link
              href="/dashboard/customer/post-gig"
              className="w-full text-center px-2 py-1.5 rounded-sm bg-[#2D583B] text-white text-[11px] font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Commission Custom Piece</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
