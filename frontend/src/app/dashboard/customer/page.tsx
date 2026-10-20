"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useTinyFishSync, useTinyFishQuery } from "@/lib/tinyfish";
import { Product, CustomerInquiry } from "@/lib/data";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import {
  Search,
  ChevronDown,
  ShoppingBag,
  Heart,
  MessageSquare,
  ArrowUpRight,
  X,
  Check,
  Package,
  Clock,
  Sparkles,
  Send,
  SlidersHorizontal,
  Eye,
  Filter
} from "lucide-react";

function CustomerBazaarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentUser,
    products,
    inquiries,
    savedProductIds,
    toggleSaveProduct,
    addToCart,
    createInquiry,
    startOrGetConversation,
    showToast
  } = useHunar();

  // Navigation tab: "bazaar" (Screenshot 2 view), "orders" (Inquiries/Activity), "saved"
  const [activeTab, setActiveTab] = useState<"bazaar" | "orders" | "saved">("bazaar");

  // Search & Filters state
  const initialCategory = searchParams.get("cat") || "All works";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>("Newest first");
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Commission / Custom inquiry modal
  const [commissionModalProduct, setCommissionModalProduct] = useState<Product | null>(null);
  const [commissionRequirements, setCommissionRequirements] = useState("");
  const [commissionBudget, setCommissionBudget] = useState<number>(5000);
  const [commissionTimeline, setCommissionTimeline] = useState("Within 14 days");

  // 1. Sync live products into TinyFish engine collection
  useTinyFishSync("products", products);

  // 2. Reactive zero-latency TinyFish query
  const {
    items: filteredProducts,
    totalCount: totalFilteredCount,
    executionTimeMs
  } = useTinyFishQuery<Product>(
    "products",
    {
      text: searchQuery.trim() || undefined,
      filter: (p: Product) => {
        if (selectedCategory === "All works" || selectedCategory === "All") return true;
        if (selectedCategory === "Paintings") {
          return (
            p.category === "Paintings" ||
            p.category === "Watercolour" ||
            p.category === "Folk Paintings & Murals"
          );
        }
        if (selectedCategory === "Ceramics") {
          return p.category === "Ceramics" || p.category === "Pottery & Terracotta";
        }
        if (selectedCategory === "Prints") {
          return p.category === "Prints" || p.category === "Block print";
        }
        if (selectedCategory === "Textiles") {
          return p.category === "Textiles" || p.category === "Textiles & Weaving";
        }
        return p.category === selectedCategory;
      },
      sortBy:
        sortBy === "Price: Low to High"
          ? "price"
          : sortBy === "Price: High to Low"
          ? "price"
          : "relevance",
      sortOrder: sortBy === "Price: Low to High" ? "asc" : "desc"
    },
    [searchQuery, selectedCategory, sortBy]
  );

  // My customer orders & inquiries
  const myInquiries = inquiries.filter((inq) => inq.customerId === currentUser?.id);
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  const handleStartChat = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const conv = startOrGetConversation({
      sellerId: product.sellerId,
      productId: product.id,
      initialMessage: `Namaste ${product.sellerName}! I am inquiring about "${product.title}" (₹${product.price.toLocaleString("en-IN")}). Is this piece currently ready for dispatch?`
    });
    router.push(`/dashboard/chat/${conv.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      medium: product.material,
      image: product.images[0],
      quantity: 1,
      artist: `${product.sellerName} · ${product.sellerCity}`
    });
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionModalProduct) return;

    if (!commissionRequirements.trim()) {
      showToast("Please describe your custom request requirements.", "info");
      return;
    }

    createInquiry({
      productId: commissionModalProduct.id,
      productTitle: commissionModalProduct.title,
      productImage: commissionModalProduct.images[0],
      sellerId: commissionModalProduct.sellerId,
      sellerName: commissionModalProduct.sellerName,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || "+91 98765 43210",
      requirements: commissionRequirements,
      proposedBudget: commissionBudget,
      timeline: commissionTimeline
    });

    setCommissionRequirements("");
    setCommissionModalProduct(null);
    showToast("Commission inquiry sent directly to the artisan's studio!", "success");
    setActiveTab("orders");
  };

  const clearAllFilters = () => {
    setSelectedCategory("All works");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#2B1219]">
      {/* Tab Switcher for Patron Workspace (Bazaar / Orders / Saved) */}
      <div className="border-b border-[#E7E0D6] bg-[#FAF8F5] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab("bazaar")}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "bazaar"
                  ? "border-[#2B1219] text-[#2B1219] font-semibold"
                  : "border-transparent text-[#5E4B4E] hover:text-[#2B1219]"
              }`}
            >
              <span>Artisan Bazaar</span>
              <span className="text-[10px] bg-[#F0E3C8] text-[#2B1219] px-2 py-0.5 rounded-full font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "orders"
                  ? "border-[#2B1219] text-[#2B1219] font-semibold"
                  : "border-transparent text-[#5E4B4E] hover:text-[#2B1219]"
              }`}
            >
              <span>My Inquiries &amp; Orders</span>
              {myInquiries.length > 0 && (
                <span className="text-[10px] bg-[#FAF0EB] text-[#A33F1C] border border-[#F3CFBF] px-1.5 py-0.2 rounded-full font-bold">
                  {myInquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "saved"
                  ? "border-[#2B1219] text-[#2B1219] font-semibold"
                  : "border-transparent text-[#5E4B4E] hover:text-[#2B1219]"
              }`}
            >
              <span>Saved Pieces</span>
              {savedProducts.length > 0 && (
                <span className="text-[10px] bg-[#FAF0EB] text-[#A33F1C] px-1.5 py-0.2 rounded-full font-bold">
                  {savedProducts.length}
                </span>
              )}
            </button>
          </div>

          {/* TinyFish Telemetry Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#5E4B4E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E58]" />
            <span>TinyFish: {executionTimeMs}ms indexing</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: BAZAAR CATALOG (Exact match to Screenshot 2) */}
      {activeTab === "bazaar" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {/* Header Block matching Screenshot 2 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                FROM INDEPENDENT INDIAN STUDIOS
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium leading-tight">
                Find a piece of your own.
              </h1>
              <p className="text-xs sm:text-sm text-[#5E4B4E]">
                Original art and handmade objects, with a person behind every piece.
              </p>
            </div>

            {/* Right Search Bar matching Screenshot 2 */}
            <div className="w-full md:w-80 relative">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#8A8986]" />
                <input
                  type="text"
                  placeholder="Search art, artists or materials"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-full pl-9 pr-8 py-2 text-xs text-[#2B1219] placeholder-[#8A8986] focus:outline-hidden focus:border-[#6E1F2E] transition-colors shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-[#8A8986] hover:text-[#2B1219]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Pills & Sort Bar matching Screenshot 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {["All works", "Paintings", "Ceramics", "Prints", "Textiles"].map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      isSelected
                        ? "bg-[#2B1219] text-[#FFFDF8]"
                        : "bg-[#FAF5EC] text-[#5E4B4E] border border-[#E7E0D6] hover:border-[#D4CDC3] hover:text-[#2B1219]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-1.5 text-xs text-[#5E4B4E] self-end sm:self-auto">
              <span>Sort by:</span>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1 font-medium text-[#2B1219] hover:text-[#6E1F2E] transition-colors"
              >
                <span>{sortBy}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-[#FFFDF8] border border-[#D4CDC3] rounded-sm shadow-md py-1 z-30">
                  {["Newest first", "Price: Low to High", "Price: High to Low"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        sortBy === option
                          ? "bg-[#F0E3C8] text-[#2B1219] font-medium"
                          : "text-[#5E4B4E] hover:bg-[#FAF7F2] hover:text-[#2B1219]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Result Count Line */}
          <div className="flex items-center justify-between text-xs text-[#5E4B4E] mb-6 border-b border-[#E7E0D6] pb-3">
            <p>
              {filteredProducts.length} {filteredProducts.length === 1 ? "work" : "works"} ·{" "}
              {selectedCategory}
            </p>
            {(searchQuery || selectedCategory !== "All works") && (
              <button
                onClick={clearAllFilters}
                className="text-[#6E1F2E] hover:underline text-[11px] font-medium"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* 9-Artwork 3-Column Grid matching Screenshot 2 */}
          {filteredProducts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const isSaved = savedProductIds.includes(product.id);
                  const isJustAdded = addedItem === product.id;

                  return (
                    <div
                      key={product.id}
                      className="group bg-[#FFFDF8] rounded-xs border border-[#E7E0D6] hover:border-[#C8B8A6] transition-colors overflow-hidden flex flex-col"
                    >
                      {/* Image Matting Container */}
                      <div className="aspect-4/3 w-full bg-[#F0E3C8]/40 overflow-hidden relative">
                        <ProtectedImage
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />

                        {/* Floating Action Controls */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSaveProduct(product.id);
                            }}
                            title={isSaved ? "Remove from saved" : "Save piece"}
                            className={`p-1.5 rounded-xs transition-colors shadow-xs ${
                              isSaved
                                ? "bg-[#C85A32] text-white"
                                : "bg-[#FFFDF8]/90 text-[#5E4B4E] hover:text-[#C85A32] border border-[#E7E0D6]"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                          </button>

                          <button
                            onClick={(e) => handleStartChat(e, product)}
                            title="Chat with artisan"
                            className="p-1.5 rounded-xs bg-[#FFFDF8]/90 text-[#5E4B4E] hover:text-[#2B1219] hover:bg-[#FFFDF8] border border-[#E7E0D6] transition-colors shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Add To Cart Button */}
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          title="Add to cart"
                          className={`absolute bottom-2 right-2 px-2.5 py-1.5 rounded-xs transition-colors z-10 flex items-center gap-1.5 text-[11px] font-medium shadow-xs ${
                            isJustAdded
                              ? "bg-[#4E6E58] text-[#FFFDF8]"
                              : "bg-[#FFFDF8]/90 hover:bg-[#6E1F2E] text-[#2B1219] hover:text-[#FFFDF8] border border-[#E7E0D6]"
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Card Metadata matching Screenshot 2 */}
                      <Link href={`/artwork/${product.id}`} className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-serif text-[15px] font-semibold text-[#2B1219] group-hover:text-[#6E1F2E] transition-colors truncate">
                              {product.title}
                            </h3>
                            <span className="text-xs font-bold text-[#2B1219] shrink-0">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5E4B4E] mt-0.5">
                            {product.sellerName} · {product.sellerCity}
                          </p>
                          <p className="text-[10px] text-[#8A8986]">
                            {product.material}
                            {product.dimensions ? ` · ${product.dimensions}` : ""}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* End of Collection Notice */}
              <p className="text-xs text-[#8A8986] text-center py-10">
                You&apos;ve seen all {filteredProducts.length} works in this collection.
              </p>
            </div>
          ) : (
            /* ALTERNATE STATE: NO SEARCH RESULTS (Exact match to Screenshot 2 bottom half) */
            <div className="mt-4 space-y-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#A33F1C] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A33F1C]" />
                <span>ALTERNATE STATE · NO SEARCH RESULTS</span>
              </div>

              <div className="bg-[#F0E3C8] rounded-xs border border-[#D4CDC3] p-8 sm:p-14 text-center">
                {/* Search query box with clear pill */}
                <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#D4CDC3] rounded-full px-4 py-1.5 text-xs text-[#2B1219] shadow-xs max-w-sm mb-4">
                  <Search className="w-3.5 h-3.5 text-[#8A8986]" />
                  <span className="font-medium">{searchQuery || "blue elephant sculpture"}</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-[#8A8986] hover:text-[#2B1219] ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium mb-2">
                  Nothing here just yet.
                </h2>
                <p className="text-xs text-[#5E4B4E] max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn&apos;t find a match. Try a material, an artist&apos;s name or a broader
                  search — there&apos;s more to discover.
                </p>

                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2 rounded-xs bg-transparent border border-[#D4CDC3] hover:bg-[#FFFDF8] text-[#2B1219] text-xs font-medium transition-colors"
                >
                  Clear search &amp; filters
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* VIEW 2: ORDERS & INQUIRIES */}
      {activeTab === "orders" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-[#2B1219] font-medium">
              My Commissions &amp; Orders
            </h2>
            <p className="text-xs text-[#5E4B4E] mt-1">
              Direct commissions, bespoke inquiries, and tracked shipments with independent artisans.
            </p>
          </div>

          {myInquiries.length === 0 ? (
            <div className="bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs p-10 text-center space-y-3">
              <Package className="w-8 h-8 text-[#8A8986] mx-auto" />
              <h3 className="font-serif text-lg font-medium text-[#2B1219]">No inquiries placed yet</h3>
              <p className="text-xs text-[#5E4B4E] max-w-sm mx-auto">
                Found a piece you love or want custom dimensions? Contact any artisan directly or
                request a bespoke commission from the bazaar.
              </p>
              <button
                onClick={() => setActiveTab("bazaar")}
                className="mt-2 px-4 py-2 bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium rounded-xs transition-colors"
              >
                Browse Bazaar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {inq.productImage && (
                      <div className="w-16 h-16 rounded-xs bg-[#F0E3C8] overflow-hidden shrink-0">
                        <ProtectedImage
                          src={inq.productImage}
                          alt={inq.productTitle || "Commission Piece"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#2B1219]">
                        {inq.productTitle}
                      </h4>
                      <p className="text-xs text-[#5E4B4E]">Artisan: {inq.sellerName}</p>
                      <p className="text-[11px] text-[#8A8986] mt-0.5">
                        Proposed Budget: ₹{inq.proposedBudget.toLocaleString("en-IN")} · Timeline:{" "}
                        {inq.timeline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                        inq.status === "Crafting in Progress"
                          ? "bg-[#FAF0EB] text-[#A33F1C] border-[#F3CFBF]"
                          : inq.status === "Dispatched"
                          ? "bg-[#EEF4F0] text-[#2D583B] border-[#C5DCCB]"
                          : "bg-[#F7F5EF] text-[#5E4B4E] border-[#E7E0D6]"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <button
                      onClick={() => router.push(`/dashboard/chat`)}
                      className="px-3 py-1.5 bg-[#FFFDF8] border border-[#D4CDC3] hover:bg-[#F0E3C8] text-xs text-[#2B1219] font-medium rounded-xs transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* VIEW 3: SAVED PIECES */}
      {activeTab === "saved" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-[#2B1219] font-medium">Saved Pieces</h2>
            <p className="text-xs text-[#5E4B4E] mt-1">
              Your bookmarked artworks, ceramics, and textiles to consider for your home.
            </p>
          </div>

          {savedProducts.length === 0 ? (
            <div className="bg-[#FFFDF8] border border-[#E7E0D6] rounded-xs p-10 text-center space-y-3">
              <Heart className="w-8 h-8 text-[#8A8986] mx-auto" />
              <h3 className="font-serif text-lg font-medium text-[#2B1219]">No saved pieces yet</h3>
              <p className="text-xs text-[#5E4B4E] max-w-sm mx-auto">
                Tap the heart on any artwork in the bazaar to save it to your personal wishlist.
              </p>
              <button
                onClick={() => setActiveTab("bazaar")}
                className="mt-2 px-4 py-2 bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium rounded-xs transition-colors"
              >
                Explore Bazaar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#FFFDF8] rounded-xs border border-[#E7E0D6] overflow-hidden flex flex-col"
                >
                  <div className="aspect-4/3 w-full bg-[#F0E3C8]/40 overflow-hidden relative">
                    <ProtectedImage
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleSaveProduct(p.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-xs bg-[#C85A32] text-white shadow-xs"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-[#2B1219]">{p.title}</h4>
                        <span className="text-xs font-bold text-[#2B1219]">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5E4B4E]">{p.sellerName}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(e, p)}
                        className="flex-1 py-1.5 bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium rounded-xs transition-colors"
                      >
                        Add to Cart
                      </button>
                      <Link
                        href={`/artwork/${p.id}`}
                        className="p-1.5 bg-[#FFFDF8] border border-[#D4CDC3] hover:bg-[#F0E3C8] text-[#2B1219] rounded-xs transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Commission Inquiry Modal */}
      {commissionModalProduct && (
        <div className="fixed inset-0 z-50 bg-[#1E2229]/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#D4CDC3] rounded-xs max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E0D6] pb-3">
              <h3 className="font-serif text-lg font-semibold text-[#2B1219]">
                Request Custom Piece from {commissionModalProduct.sellerName}
              </h3>
              <button
                onClick={() => setCommissionModalProduct(null)}
                className="text-[#8A8986] hover:text-[#2B1219]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCommissionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5E4B4E] font-medium mb-1">
                  Commission Requirements / Dimensions
                </label>
                <textarea
                  rows={3}
                  value={commissionRequirements}
                  onChange={(e) => setCommissionRequirements(e.target.value)}
                  placeholder="E.g., Looking for a 60 × 80 cm version of this style with warmer terracotta tones..."
                  className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs p-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5E4B4E] font-medium mb-1">Proposed Budget (₹)</label>
                  <input
                    type="number"
                    value={commissionBudget}
                    onChange={(e) => setCommissionBudget(Number(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs p-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                  />
                </div>
                <div>
                  <label className="block text-[#5E4B4E] font-medium mb-1">Desired Timeline</label>
                  <select
                    value={commissionTimeline}
                    onChange={(e) => setCommissionTimeline(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-xs p-2 text-xs text-[#2B1219] focus:outline-hidden focus:border-[#6E1F2E]"
                  >
                    <option value="Within 14 days">Within 14 days</option>
                    <option value="Within 30 days">Within 30 days</option>
                    <option value="Flexible / Heirloom piece">Flexible / Heirloom piece</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E7E0D6]">
                <button
                  type="button"
                  onClick={() => setCommissionModalProduct(null)}
                  className="px-4 py-2 border border-[#D4CDC3] rounded-xs text-[#5E4B4E] hover:bg-[#FAF7F2] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] font-medium rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-12">
          <p className="text-xs font-serif text-[#5E4B4E]">Loading artisan bazaar...</p>
        </div>
      }
    >
      <CustomerBazaarContent />
    </Suspense>
  );
}
