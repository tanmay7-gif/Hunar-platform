"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { Search, ChevronDown, X } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All works";
  const initialQuery = searchParams.get("q") || "";

  const { products } = useHunar();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>("Newest first");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const categories = ["All works", "Paintings", "Ceramics", "Prints"];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      let matchCategory = true;
      if (activeCategory !== "All works") {
        if (activeCategory === "Paintings") {
          matchCategory = p.category === "Paintings" || p.category === "Madhubani Folk Art" || p.category === "Mural Design";
        } else if (activeCategory === "Ceramics") {
          matchCategory = p.category === "Ceramics" || p.category === "Terracotta & Pottery";
        } else if (activeCategory === "Prints") {
          matchCategory = p.category === "Prints" || p.category === "Textiles" || p.category === "Handloom & Textiles";
        } else {
          matchCategory = p.category.toLowerCase().includes(activeCategory.toLowerCase());
        }
      }

      // Search match
      let matchQuery = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchQuery =
          p.title.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.sellerCity.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q);
      }

      return matchCategory && matchQuery;
    });
  }, [products, activeCategory, searchQuery]);

  // Sort
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "Price: Low to High") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setActiveCategory("All works");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E2229] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#A33F1C] mb-1.5">
              From independent Indian studios
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E2229] font-medium tracking-tight">
              Find a piece of your own.
            </h1>
            <p className="text-xs sm:text-sm text-[#535A66] mt-1.5 max-w-xl">
              Original art and handmade objects, with a person behind every piece.
            </p>
          </div>

          {/* Search Input on Right */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E96A4]" />
            <input
              type="text"
              placeholder="Search art, artists or materials"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E7E0D6] rounded-full pl-8 pr-8 py-2 text-xs text-[#1E2229] placeholder-[#8E96A4] focus:outline-hidden focus:border-[#7A2828] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E96A4] hover:text-[#1E2229] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills and Sort dropdown bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-t border-[#E7E0D6]">
          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs transition-colors shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#1E2229] text-[#FAF8F5] font-medium"
                    : "bg-[#FAF5EC] hover:bg-[#EFE7DC] text-[#535A66] border border-[#E7E0D6]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-[#535A66] hover:text-[#1E2229] transition-colors"
            >
              <span>Sort by:</span>
              <span className="font-medium text-[#1E2229]">{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E7E0D6] rounded-xs shadow-md z-20 py-1 text-xs">
                {["Newest first", "Price: Low to High", "Price: High to Low"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#FAF5EC] transition-colors ${
                      sortBy === option ? "font-semibold text-[#7A2828]" : "text-[#1E2229]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Count indicator */}
        <div className="text-[11px] text-[#8E96A4] pb-6">
          {sortedProducts.length} works · {activeCategory === "All works" ? "All categories" : activeCategory}
        </div>

        {/* Products Grid (Screenshot 2: 3-column layout) */}
        {sortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {sortedProducts.map((work) => (
                <Link
                  key={work.id}
                  href={`/artwork/${work.id}`}
                  className="group block"
                >
                  <div className="aspect-4/3 rounded-xs overflow-hidden bg-[#EAE2D5] border border-[#E7E0D6] group-hover:border-[#C8B8A6] transition-colors relative">
                    <ProtectedImage
                      src={work.images[0] || "/artworks/the-quiet-courtyard.png"}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-xs font-semibold text-[#1E2229] group-hover:text-[#7A2828] transition-colors truncate">
                        {work.title}
                      </h3>
                      <span className="text-xs font-bold text-[#1E2229] shrink-0">
                        ₹{work.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#535A66] mt-0.5">
                      {work.sellerName} · {work.sellerCity}
                    </p>
                    <p className="text-[10px] text-[#8E96A4]">
                      {work.material || work.category} {work.dimensions ? `· ${work.dimensions}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* End collection footer note */}
            <div className="text-center py-14 text-xs text-[#8E96A4]">
              You&apos;ve seen all {sortedProducts.length} works in this collection.
            </div>
          </>
        ) : (
          /* ALTERNATE STATE: NO SEARCH RESULTS (Directly from Screenshot 2 bottom card) */
          <div className="my-10 bg-[#F5EDE1] border border-[#E7DEC8] rounded-xs p-10 max-w-xl mx-auto text-center space-y-4">
            {searchQuery && (
              <div className="inline-flex items-center gap-2 bg-white border border-[#E7E0D6] rounded-full px-3.5 py-1 text-xs text-[#1E2229]">
                <Search className="w-3 h-3 text-[#8E96A4]" />
                <span>{searchQuery}</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#8E96A4] hover:text-[#1E2229]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <h3 className="font-serif text-2xl text-[#7A2828] font-medium">
              Nothing here just yet.
            </h3>
            <p className="text-xs text-[#635C53] max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find a match. Try a material, an artist&apos;s name or a broader search —
              there&apos;s more to discover.
            </p>

            <div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xs border border-[#C8B8A6] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#1E2229] transition-colors"
              >
                Clear search &amp; filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#8E96A4]">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
