"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import {
  Search,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Store,
  Clock,
  Sparkles,
  ShoppingBag,
  Check
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { currentUser, addToCart } = useHunar();

  const [activeCategory, setActiveCategory] = useState("All crafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Recent first");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Determine seller target link based on auth status
  const sellerLink = currentUser?.role === "SELLER" ? "/dashboard/seller" : "/auth?role=artist";

  // Hero showcase items (matching Screenshot 1)
  const heroItems = [
    {
      id: "prod-quiet-courtyard",
      title: "The quiet courtyard",
      artist: "Rhea Sharma · Jaipur · Gouache on paper",
      image: "/artworks/quiet-courtyard-detail.png",
      cta: "Discover this piece",
      link: "/artwork/prod-quiet-courtyard"
    },
    {
      id: "prod-pink-city-morning",
      title: "Pink city morning",
      artist: "Rhea Sharma · Jaipur · Acrylic on canvas",
      image: "/artworks/pink-city-morning.png",
      cta: "Discover this piece",
      link: "/artwork/prod-pink-city-morning",
      hasCtas: true
    },
    {
      id: "prod-river-pebble-bowl",
      title: "River pebble bowl",
      artist: "Kabir Mehta · Pune · Glazed stoneware",
      image: "/artworks/river-pebble-bowl.png",
      cta: "Discover this piece",
      link: "/artwork/prod-river-pebble-bowl"
    }
  ];

  // Category cards (matching Screenshot 1)
  const categories = [
    { name: "Paintings", image: "/artworks/cat-paintings.png", slug: "Paintings" },
    { name: "Ceramics", image: "/artworks/cat-ceramics.png", slug: "Ceramics" },
    { name: "Textiles", image: "/artworks/cat-textiles.png", slug: "Textiles" },
    { name: "Jewellery", image: "/artworks/cat-jewellery.png", slug: "Jewellery" },
    { name: "Prints", image: "/artworks/cat-prints.png", slug: "Prints" }
  ];

  // Curator's picks (6 items from Screenshot 1)
  const curatorPicks = [
    {
      id: "prod-quiet-courtyard",
      title: "The quiet courtyard",
      artist: "Rhea Sharma · Jaipur",
      medium: "Gouache on paper · 40 × 50 cm",
      price: 8400,
      image: "/artworks/the-quiet-courtyard.png",
      category: "Watercolour"
    },
    {
      id: "prod-earth-sky-vase",
      title: "Earth & sky vase",
      artist: "Kabir Mehta · Pune",
      medium: "Hand-thrown stoneware · 18 × 12 cm",
      price: 2200,
      image: "/artworks/earth-sky-vase.png",
      category: "Ceramics"
    },
    {
      id: "prod-monsoon-window",
      title: "Monsoon window",
      artist: "Rhea Sharma · Jaipur",
      medium: "Acrylic on canvas · 30 × 30 cm",
      price: 4800,
      image: "/artworks/monsoon-window.png",
      category: "Paintings"
    },
    {
      id: "prod-quiet-contemplation",
      title: "Quiet Contemplation",
      artist: "Meera Devi · Bagru",
      medium: "Block-printed cotton · 40 × 50 cm",
      price: 3200,
      image: "/artworks/quiet-contemplation.png",
      category: "Textiles"
    },
    {
      id: "prod-marigold-study",
      title: "Marigold study",
      artist: "Rhea Sharma · Jaipur",
      medium: "Gouache on paper · 21 × 30 cm",
      price: 3600,
      image: "/artworks/marigold-study.png",
      category: "Prints"
    },
    {
      id: "prod-sunlight-better-days",
      title: "Sunlight \"Better Days\"",
      artist: "Tara Joshi · Ahmedabad",
      medium: "Hand-formed brass · 25 × 30 cm",
      price: 1600,
      image: "/artworks/sunlight-better-days.png",
      category: "Jewellery"
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, piece: (typeof curatorPicks)[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `cart-${piece.id}-${Date.now()}`,
      productId: piece.id,
      title: piece.title,
      price: piece.price,
      medium: piece.medium,
      image: piece.image,
      quantity: 1,
      artist: piece.artist
    });
    setAddedItem(piece.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#2B1219]">
      {/* 1. HERO SEARCH & FILTERS BAR */}
      <section className="border-b border-[#E7E0D6] bg-[#F7F5EF] py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Quick Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["All crafts", "Paintings", "Ceramics", "Prints"].map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (cat !== "All crafts") {
                      router.push(`/shop?cat=${encodeURIComponent(cat)}`);
                    } else {
                      router.push("/shop");
                    }
                  }}
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

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#8A8986]" />
              <input
                type="text"
                placeholder="Search craft, artist, or material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D4CDC3] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#2B1219] placeholder-[#8A8986] focus:outline-hidden focus:border-[#6E1F2E] transition-colors shadow-2xs"
              />
            </div>
          </form>

          {/* Sort dropdown */}
          <div className="relative flex items-center gap-1 text-xs text-[#5E4B4E] shrink-0 self-end md:self-auto">
            <span>Sort by:</span>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 font-medium text-[#2B1219] hover:text-[#6E1F2E] transition-colors"
            >
              <span>{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#FFFDF8] border border-[#D4CDC3] rounded-sm shadow-md py-1 z-30">
                {["Recent first", "Price: Low to High", "Price: High to Low"].map((option) => (
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
      </section>

      {/* 2. HERO FEATURED SHOWCASE (3-Card Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {heroItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              <Link
                href={item.link}
                className="group block bg-[#FFFDF8] rounded-xs overflow-hidden border border-[#E7E0D6] hover:border-[#C8B8A6] transition-colors"
              >
                {/* Image Matting Frame */}
                <div className="aspect-4/3 w-full bg-[#F0E3C8]/40 overflow-hidden relative">
                  <ProtectedImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Card Meta */}
                <div className="p-3.5 bg-[#FFFDF8]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-[15px] font-semibold text-[#2B1219] group-hover:text-[#6E1F2E] transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#5E4B4E] mt-0.5 leading-snug truncate">
                        {item.artist}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#2B1219] font-medium shrink-0 flex items-center gap-0.5 group-hover:text-[#6E1F2E] transition-colors">
                      {item.cta} ↗
                    </span>
                  </div>
                </div>
              </Link>

              {/* Center Card CTAs (Exploration & Selling Hooks) */}
              {item.hasCtas && (
                <div className="mt-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-3">
                    <Link
                      href="/shop"
                      className="px-5 py-2 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Explore craft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={sellerLink}
                      className="px-5 py-2 rounded-xs bg-transparent border border-[#D4CDC3] hover:bg-[#F0E3C8] text-[#2B1219] text-xs font-medium transition-colors"
                    >
                      Start selling
                    </Link>
                  </div>
                  <p className="text-[11px] text-[#8A8986] mt-2 max-w-xs">
                    No 24-month lock-ins, non-exclusives &amp; direct buyer payouts.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. VALUE PROPOSITION TICKER (3-Point Strip) */}
      <section className="border-y border-[#E7E0D6] py-3.5 px-4 bg-[#F0E3C8]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs text-[#5E4B4E]">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
            <span>Handcrafted, not produced in bulk</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
            <span>Fair pay returned direct to every artist</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
            <span>Free 14-day insured returns</span>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY ("Find your kind of beautiful.") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
          Shop by category
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium tracking-tight mb-6">
          Find your kind of beautiful.
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?cat=${encodeURIComponent(cat.slug)}`}
              className="group block"
            >
              <div className="aspect-square rounded-xs overflow-hidden bg-[#F0E3C8]/40 border border-[#E7E0D6] group-hover:border-[#C8B8A6] transition-colors relative">
                <ProtectedImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#2B1219]">
                <span className="font-medium group-hover:text-[#6E1F2E] transition-colors">
                  {cat.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8A8986] group-hover:text-[#6E1F2E] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. CURATOR'S PICKS ("A few things to fall for.") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-[#E7E0D6]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
              Curator&apos;s picks
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium tracking-tight">
              A few things to fall for.
            </h2>
            <p className="text-xs text-[#5E4B4E] mt-1">
              Small creators. 12 new pieces at a time. Pieces worth making room for.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs text-[#5E4B4E] hover:text-[#2B1219] flex items-center gap-1 font-medium transition-colors"
          >
            <span>Explore all art</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Grid items (3x2 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
          {curatorPicks.map((piece) => {
            const isJustAdded = addedItem === piece.id;
            return (
              <div key={piece.id} className="group relative">
                <Link href={`/artwork/${piece.id}`} className="block">
                  <div className="aspect-4/3 rounded-xs overflow-hidden bg-[#F0E3C8]/40 border border-[#E7E0D6] group-hover:border-[#C8B8A6] transition-colors relative">
                    <ProtectedImage
                      src={piece.image}
                      alt={piece.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />

                    {/* Quick Add To Cart Button */}
                    <button
                      onClick={(e) => handleQuickAdd(e, piece)}
                      title="Add to cart"
                      className={`absolute bottom-2 right-2 p-1.5 rounded-xs transition-colors z-10 flex items-center gap-1 text-[11px] font-medium shadow-xs ${
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
                        <ShoppingBag className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-xs font-semibold text-[#2B1219] group-hover:text-[#6E1F2E] transition-colors truncate">
                        {piece.title}
                      </h3>
                      <span className="text-xs font-bold text-[#2B1219] shrink-0">
                        ₹{piece.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5E4B4E] mt-0.5">{piece.artist}</p>
                    <p className="text-[10px] text-[#8A8986]">{piece.medium}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SPOTLIGHT: THE ARTIST BEHIND THE BRUSH */}
      <section className="bg-[#F0E3C8]/60 border-y border-[#E7E0D6] py-14 px-4 sm:px-6 my-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Large portrait on left */}
          <div className="md:col-span-5 aspect-4/5 rounded-xs overflow-hidden border border-[#E7E0D6] bg-[#FFFDF8]">
            <ProtectedImage
              src="/artworks/rhea-sharma-portrait.png"
              alt="Rhea Sharma in her Jaipur studio"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story & text on right */}
          <div className="md:col-span-7 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
              The artist behind the brush
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium leading-tight">
              Colour, courtyards and everyday wonder.
            </h2>
            <p className="text-xs text-[#5E4B4E] leading-relaxed max-w-lg">
              For Jaipur-based painter Rhea Sharma, inspiration lives just outside her window:
              the warm pink glow of sunlit walls, lush familiar greenery and small moments worth
              pausing for.
            </p>
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-[#2B1219]">Rhea Sharma</h4>
              <p className="text-[11px] text-[#5E4B4E]">Florence · Aqua Palettes</p>
            </div>
            <div className="pt-2">
              <Link
                href="/artist/rhea-sharma"
                className="text-xs text-[#6E1F2E] hover:text-[#581723] font-medium flex items-center gap-1 group"
              >
                <span>Shop artist&apos;s collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR COMMITMENT / WHY HUNAR EXISTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Story text on left */}
          <div className="md:col-span-7 space-y-4 order-2 md:order-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
              Our commitment / Why Hunar exists
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B1219] font-medium leading-tight">
              Good things come from real people.
            </h2>
            <p className="text-xs text-[#5E4B4E] leading-relaxed max-w-lg">
              Across India, independent artists build traditions that don&apos;t belong in large factories.
              Too often, their work disappears into noisy feeds.
            </p>
            <p className="text-xs text-[#5E4B4E] leading-relaxed max-w-lg">
              Hunar gives it a place to breathe, understood and brought home — with the artist&apos;s name
              always in the picture.
            </p>
          </div>

          {/* Photo on right */}
          <div className="md:col-span-5 aspect-4/3 rounded-xs overflow-hidden border border-[#E7E0D6] bg-[#FFFDF8] order-1 md:order-2">
            <ProtectedImage
              src="/artworks/rhea-process.png"
              alt="Artisan at work table"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. FOR CREATORS ("More making. Less managing.") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 mb-12">
        <div className="bg-[#FAF0EB] rounded-xs border border-[#F3CFBF] p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#EAC9B8]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] mb-1">
                For creators
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2B1219] font-medium">
                More making. Less managing.
              </h2>
            </div>
            <Link
              href={sellerLink}
              className="px-5 py-2 rounded-xs bg-[#6E1F2E] hover:bg-[#581723] text-[#FFFDF8] text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center shadow-2xs"
            >
              <span>Start selling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 feature columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-2">
              <Store className="w-5 h-5 text-[#C85A32]" />
              <h4 className="text-xs font-semibold text-[#2B1219]">Your own rich storefront</h4>
              <p className="text-[11px] text-[#5E4B4E] leading-relaxed">
                A profile, a lookbook and your work in one place. No algorithms to outsmart:
                your link, your audience, your craft.
              </p>
            </div>

            <div className="space-y-2">
              <Clock className="w-5 h-5 text-[#C85A32]" />
              <h4 className="text-xs font-semibold text-[#2B1219]">List a piece in minutes</h4>
              <p className="text-[11px] text-[#5E4B4E] leading-relaxed">
                Upload your photos, write a few words and set your price. We handle payment
                and packaging guidelines.
              </p>
            </div>

            <div className="space-y-2">
              <Sparkles className="w-5 h-5 text-[#C85A32]" />
              <h4 className="text-xs font-semibold text-[#2B1219]">Keep the essentials together</h4>
              <p className="text-[11px] text-[#5E4B4E] leading-relaxed">
                See your available pieces and orders in one clear dashboard, so you can get back
                to creating.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
