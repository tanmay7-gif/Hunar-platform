"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useTinyFishQuery } from "@tinyfish/core";
import { Product, CustomerInquiry, Creator } from "@/lib/data";
import {
  Search,
  Filter,
  Heart,
  MessageCircle,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  ExternalLink,
  X,
  Send,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShoppingBag,
  Palette,
  Truck,
  DollarSign,
  Star,
  RefreshCw
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const {
    language,
    currentUser,
    switchDemoRole,
    products,
    creators,
    inquiries,
    savedProductIds,
    toggleSaveProduct,
    createInquiry,
    startOrGetConversation,
    showToast
  } = useHunar();

  const handleStartChat = (product: Product) => {
    const conv = startOrGetConversation({
      sellerId: product.sellerId,
      productId: product.id,
      initialMessage: `Namaste ${product.sellerName}! I am inquiring about "${product.title}" (₹${product.price}). Is this currently available?`
    });
    router.push(`/dashboard/chat/${conv.id}`);
  };

  const isHindi = language === "hi";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [selectedFormat, setSelectedFormat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Tabs: "marketplace" | "activity" | "saved"
  const [activeTab, setActiveTab] = useState<"marketplace" | "activity" | "saved">("marketplace");

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [commissionModalProduct, setCommissionModalProduct] = useState<Product | null>(null);
  const [selectedArtisanProfile, setSelectedArtisanProfile] = useState<Creator | null>(null);

  // Commission Form State
  const [commissionRequirements, setCommissionRequirements] = useState("");
  const [commissionBudget, setCommissionBudget] = useState<number>(5000);
  const [commissionTimeline, setCommissionTimeline] = useState("Within 14 days");

  // Inquiries for this customer
  const myInquiries = inquiries.filter((inq) => inq.customerId === currentUser.id);

  // Saved products
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  // Category list
  const categories = [
    { id: "All", label: isHindi ? "सभी शिल्प" : "All Crafts" },
    { id: "Pottery & Terracotta", label: isHindi ? "टेराकोटा व कुम्हार कला" : "Pottery & Terracotta" },
    { id: "Folk Paintings & Murals", label: isHindi ? "लोक चित्रकला व भित्तिचित्र" : "Folk Paintings & Murals" },
    { id: "Henna & Body Art", label: isHindi ? "पारंपरिक मेहंदी व श्रृंगार" : "Henna & Body Art" },
    { id: "Sculpture & Woodcarving", label: isHindi ? "मूर्ति व काष्ठकला" : "Sculpture & Woodcarving" },
    { id: "Textiles & Weaving", label: isHindi ? "हथकरघा व वस्त्रकला" : "Textiles & Weaving" }
  ];

  const cities = ["All", "Jaipur", "Khurja", "Madhubani", "Delhi NCR", "Udaipur", "Kolkata"];

  const formats = [
    { id: "All", label: isHindi ? "सभी प्रारूप" : "All Delivery Types" },
    { id: "Physical Product", label: isHindi ? "भौतिक उत्पाद (शिपिंग)" : "Physical Shipping" },
    { id: "On-site Commission", label: isHindi ? "साइट पर कला / लाइव सर्विस" : "On-site Commission / Mural" }
  ];

  // Numeric price range conversion for TinyFish indexing engine
  const priceFilter = useMemo(() => {
    if (priceRange === "under3000") return { max: 2999 };
    if (priceRange === "3000to10000") return { min: 3000, max: 10000 };
    if (priceRange === "10000to25000") return { min: 10000, max: 25000 };
    if (priceRange === "above25000") return { min: 25000 };
    return undefined;
  }, [priceRange]);

  // TinyFish Reactive Query: instant sub-millisecond edge indexing across all craft facets
  const {
    items: filteredProducts,
    totalCount: totalFilteredCount,
    executionTimeMs,
    facets: liveFacets
  } = useTinyFishQuery<Product>(
    "products",
    {
      text: searchQuery,
      facets: {
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        sellerCity: selectedCity !== "All" ? selectedCity : undefined,
        deliveryFormat: selectedFormat !== "All" ? selectedFormat : undefined
      },
      range: {
        price: priceFilter
      },
      sortBy: sortBy === "priceAsc" ? "price" : sortBy === "priceDesc" ? "price" : "relevance",
      sortOrder: sortBy === "priceAsc" ? "asc" : "desc"
    },
    [searchQuery, selectedCategory, selectedCity, selectedFormat, priceFilter, sortBy]
  );

  // Handle Commission Form Submission
  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionModalProduct) return;

    if (!commissionRequirements.trim()) {
      showToast(isHindi ? "कृपया अपनी आवश्यकताएं दर्ज करें" : "Please enter your commission requirements", "error");
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
    showToast(
      isHindi
        ? "कमीशन अनुरोध सफलतापूर्वक कारीगर को भेजा गया!"
        : "Commission brief sent directly to the artisan's studio!",
      "success"
    );
    setActiveTab("activity");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-[#F5F2EB] text-[#635C53] border-[#E8E2D7]";
      case "Crafting in Progress":
        return "bg-[#FBF0EB] text-[#B4461F] border-[#F3CFBF]";
      case "Dispatched":
        return "bg-[#EEF4F0] text-[#2D583B] border-[#C5DCCB]";
      case "Completed":
        return "bg-[#FAF5EC] text-[#1E2229] border-[#DACABA]";
      default:
        return "bg-[#F5F2EB] text-[#635C53] border-[#E8E2D7]";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Patron Greeting & Hero Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#E8DEC8] bg-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                {isHindi ? "संरक्षक शिल्प बाज़ार" : "Patron Craft Bazaar"}
              </span>
              <span className="text-xs text-[#635C53] font-medium font-mono">
                • {currentUser.name} ({currentUser.city})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229] tracking-tight">
              {isHindi ? "शिल्प बाज़ार" : "Bazaar"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/customer/post-gig"
              className="px-4 py-2.5 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center gap-1.5"
            >
              <span>{isHindi ? "ज़रूरत पोस्ट करें" : "Post a Requirement"}</span>
            </Link>
            <Link
              href="/dashboard/customer/artisans"
              className="px-4 py-2.5 rounded-sm border border-[#D9D0C3] bg-transparent text-[#2D2A26] text-xs font-medium hover:bg-[#EFEAE1] transition-colors duration-150 flex items-center gap-1.5"
            >
              <span>{isHindi ? "कारीगर निर्देशिका" : "Discover Artisans"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DEC8] pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`px-4 py-2.5 rounded-xs text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
            activeTab === "marketplace"
              ? "border-[#B4461F] text-[#B4461F] bg-[#FAF5EC]"
              : "border-transparent text-[#635C53] hover:text-[#1E2229]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isHindi ? "शिल्प बाज़ार व खोज" : "Curated Artisan Feed & Marketplace"}</span>
          <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#E8DEC8] text-[#1E2229]">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2.5 rounded-xs text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
            activeTab === "activity"
              ? "border-[#B4461F] text-[#B4461F] bg-[#FAF5EC]"
              : "border-transparent text-[#635C53] hover:text-[#1E2229]"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isHindi ? "सक्रिय कमीशन ट्रैकर" : "Commission Orders Tracker"}</span>
          {myInquiries.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#B4461F] text-white">
              {myInquiries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2.5 rounded-xs text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
            activeTab === "saved"
              ? "border-[#B4461F] text-[#B4461F] bg-[#FAF5EC]"
              : "border-transparent text-[#635C53] hover:text-[#1E2229]"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{isHindi ? "सहेजे गए शिल्पी व कलाकृतियां" : "Saved Shortlist"}</span>
          <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#E8DEC8] text-[#1E2229]">
            {savedProductIds.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CURATED ARTISAN FEED & MARKETPLACE                 */}
      {/* ========================================================= */}
      {activeTab === "marketplace" && (
        <div className="space-y-8">
          {/* Search & Dynamic Filters Bar */}
          <div className="p-6 sm:p-7 rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isHindi
                      ? "कलाकृति, कारीगर या शहर खोजें (जैसे: 'खुर्जा टेराकोटा', 'मधुबनी', 'दिल्ली')..."
                      : "Search artwork, artisan name or city (e.g., 'Khurja Terracotta vases', 'Madhubani silk')..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                {/* City selector */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? (isHindi ? "सभी शहर / क्षेत्र" : "All Cities") : c}
                    </option>
                  ))}
                </select>

                {/* Budget range */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  <option value="All">{isHindi ? "सभी बजट दायरे" : "All Budgets"}</option>
                  <option value="under3000">{isHindi ? "₹3,000 से कम" : "Under ₹3,000"}</option>
                  <option value="3000to10000">₹3,000 - ₹10,000</option>
                  <option value="10000to25000">₹10,000 - ₹25,000</option>
                  <option value="above25000">{isHindi ? "₹25,000+" : "₹25,000+"}</option>
                </select>

                {/* Delivery Format */}
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="px-3 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  {formats.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Craft Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const facetCount = cat.id === "All" 
                  ? products.length 
                  : (liveFacets.category?.[cat.id.toLowerCase()] || liveFacets.category?.[cat.id] || 0);

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap transition-colors duration-150 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#B4461F] text-white"
                        : "bg-[#FAF6ED] text-[#535A66] hover:bg-[#F3EADB] border border-[#E8DEC8]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1 rounded-xs ${isSelected ? "bg-white/20 text-white" : "bg-[#E8DEC8]/60 text-[#8A7561]"}`}>
                      {facetCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count Strip & TinyFish Zero-Latency Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#635C53] px-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-medium text-[#1E2229]">
                {filteredProducts.length} {isHindi ? "हस्तनिर्मित कृतियां उपलब्ध" : "verified handmade artworks found"}
              </p>

              {/* TinyFish Edge Indexing Benchmark Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8DEC8] text-[10px] text-[#8A7561]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D583B]"></span>
                <span className="font-mono text-[#B4461F] font-semibold">{executionTimeMs}ms</span>
                <span>{isHindi ? "• टाइनीफिश एज अनुक्रमित" : "• TinyFish zero-latency indexed"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Snappy Sort Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#8A7561]">{isHindi ? "क्रम:" : "Sort:"}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 rounded-xs bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                >
                  <option value="relevance">{isHindi ? "प्रासंगिकता (Relevance)" : "Relevance (Default)"}</option>
                  <option value="priceAsc">{isHindi ? "कीमत: कम से अधिक" : "Price: Low to High"}</option>
                  <option value="priceDesc">{isHindi ? "कीमत: अधिक से कम" : "Price: High to Low"}</option>
                </select>
              </div>

              <span className="text-[11px] text-[#2D583B] font-semibold hidden sm:flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />
                {isHindi ? "100% बिचौलिया-मुक्त • सीधा कारीगर भुगतान" : "Zero Middleman Cut • Direct Studio Settlement"}
              </span>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isSaved = savedProductIds.includes(product.id);
              const relatedCreator = creators.find((c) => c.name === product.sellerName);

              return (
                <div
                  key={product.id}
                  className="rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-150 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image & Badges */}
                    <div className="relative h-60 bg-gray-100 overflow-hidden">
                      <ProtectedImage
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        wrapperClassName="w-full h-full cursor-pointer"
                        shieldClassName="cursor-pointer"
                        onClick={() => setQuickViewProduct(product)}
                      />

                      {/* Format Tag */}
                      <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-xs bg-[#1E2229] text-[#FAF7F2] text-[10px] font-medium">
                        {product.deliveryFormat === "On-site Commission" ? "On-site Mural / Event" : "Physical Ship"}
                      </div>

                      {/* Save Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveProduct(product.id);
                        }}
                        className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-sm border border-[#E8DEC8] transition-colors duration-150 ${
                          isSaved
                            ? "bg-rose-50 text-rose-600"
                            : "bg-white text-gray-500 hover:text-[#B4461F]"
                        }`}
                        title="Save to Shortlist"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-600" : ""}`} />
                      </button>

                      {/* Lead time badge */}
                      <div className="absolute bottom-2.5 left-2.5 z-20 px-2 py-0.5 rounded-xs text-[10px] font-medium bg-[#FAF6EE] text-[#1E2229] border border-[#E8DEC8] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B4461F]" />
                        <span>{product.leadTime}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      {/* Artisan Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          if (relatedCreator) setSelectedArtisanProfile(relatedCreator);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <ProtectedImage
                            src={product.sellerAvatar}
                            alt={product.sellerName}
                            className="w-6 h-6 rounded-full object-cover aspect-square"
                            wrapperClassName="w-6 h-6 rounded-full ring-1 ring-[#E8DEC8] shrink-0"
                          />
                          <span className="text-xs font-semibold text-[#1E2229] hover:text-[#B4461F] transition-colors duration-150 flex items-center gap-1">
                            {product.sellerName}
                            {product.sellerVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#635C53] truncate max-w-[100px]">
                          {product.sellerCity.split("/")[0]}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="font-serif font-bold text-base text-[#1E2229] group-hover:text-[#B4461F] transition-colors duration-150 line-clamp-2 cursor-pointer mb-2"
                      >
                        {isHindi && product.titleHindi ? product.titleHindi : product.title}
                      </h3>

                      {/* Material / Details */}
                      {product.material && (
                        <p className="text-xs text-[#635C53] line-clamp-1 leading-relaxed">
                          <span className="font-semibold text-[#B4461F]">Medium: </span>
                          {product.material}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Row: Price & CTAs */}
                  <div className="p-6 pt-3 border-t border-[#E8DEC8] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-[#635C53] font-semibold block">
                        {isHindi ? "कीमत (INR)" : "Price (₹)"}
                      </span>
                      <span className="font-serif font-bold text-base text-[#1E2229]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-2 rounded-sm bg-[#FAF5EC] border border-[#DACABA] text-[#1E2229] hover:bg-[#F3EADB] transition-colors duration-150"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartChat(product)}
                        className="px-3 py-2 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963715] transition-colors duration-150 flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isHindi ? "सीधी बात करें" : "Inquire / Chat"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ACTIVE INQUIRIES & COMMISSION ORDER TRACKER        */}
      {/* ========================================================= */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          <div className="border-b border-[#E8DEC8] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#1E2229]">
                {isHindi ? "आपके सक्रिय कमीशन एवं पूछताछ आदेश" : "Your Active Inquiries & Commissions Tracker"}
              </h2>
              <p className="text-xs text-[#635C53] mt-0.5">
                {isHindi
                  ? "कारीगर के साथ प्रगति की स्थिति ट्रैक करें: 'समीक्षाधीन' -> 'निर्माण प्रगति पर' -> 'प्रेषित'"
                  : "Track live status directly from the artisan's studio: Under Review -> Crafting in Progress -> Dispatched."}
              </p>
            </div>

            <span className="px-3 py-1 rounded-xs text-xs font-semibold bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]">
              {myInquiries.length} {isHindi ? "सक्रिय कार्य" : "Active Orders"}
            </span>
          </div>

          {myInquiries.length === 0 ? (
            <div className="rounded-sm bg-white border border-[#E8DEC8] p-12 text-center space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                {isHindi ? "कोई सक्रिय कमीशन आदेश नहीं है" : "No Active Commission Requests Yet"}
              </h3>
              <p className="text-xs text-[#635C53] max-w-md mx-auto">
                {isHindi
                  ? "मार्केटप्लेस से किसी भी कलाकृति पर 'कमीशन कस्टमाइज़ करें' बटन दबाकर सीधे शिल्पी को अपना प्रस्ताव भेजें।"
                  : "Browse our marketplace and click 'Commission Custom Work' on any artisan piece to kick off a direct collaboration."}
              </p>
              <button
                onClick={() => setActiveTab("marketplace")}
                className="px-5 py-2.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150"
              >
                {isHindi ? "शिल्प बाज़ार देखें" : "Explore Marketplace"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myInquiries.map((inq) => {
                const statusSteps = ["Under Review", "Crafting in Progress", "Dispatched", "Completed"];
                const currentIdx = statusSteps.indexOf(inq.status);

                return (
                  <div
                    key={inq.id}
                    className="rounded-sm bg-white border border-[#E8DEC8] p-6 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8D9] pb-4">
                      <div className="flex items-center gap-3">
                        {inq.productImage && (
                          <ProtectedImage
                            src={inq.productImage}
                            alt={inq.productTitle || "Custom"}
                            className="w-12 h-12 rounded-sm object-cover"
                            wrapperClassName="w-12 h-12 rounded-sm border border-[#E8DEC8] shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-bold text-base text-[#1E2229]">
                              {inq.productTitle || "Custom Heritage Commission"}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(inq.status)}`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#635C53] mt-0.5">
                            Artisan Studio: <span className="font-semibold text-[#1E2229]">{inq.sellerName}</span> • Proposed Budget: <span className="font-bold text-[#B4461F]">₹{inq.proposedBudget.toLocaleString("en-IN")}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs text-gray-400 font-mono">ID: {inq.id}</span>
                        <span className="text-xs text-gray-400">• {inq.createdAt}</span>
                      </div>
                    </div>

                    {/* Visual Progress Stepper */}
                    <div>
                      <div className="grid grid-cols-4 gap-2">
                        {statusSteps.map((step, idx) => {
                          const isPastOrCurrent = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={step} className="space-y-1.5">
                              <div
                                className={`h-2 rounded-xs transition-colors duration-150 ${
                                  isPastOrCurrent ? (isCurrent ? "bg-[#B4461F]" : "bg-[#2D583B]") : "bg-[#E8DEC8]"
                                }`}
                              />
                              <p
                                className={`text-[10px] sm:text-xs font-semibold truncate ${
                                  isCurrent ? "text-[#B4461F]" : isPastOrCurrent ? "text-[#2D583B]" : "text-gray-400"
                                }`}
                              >
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Requirements and Latest Studio Update */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6ED] p-4 rounded-sm border border-[#E8DEC8] text-xs">
                      <div>
                        <p className="font-semibold uppercase tracking-wider text-[#635C53] text-[10px]">
                          Commission Brief / Requirements:
                        </p>
                        <p className="text-[#1E2229] mt-1 leading-relaxed">{inq.requirements}</p>
                        <p className="text-[#635C53] mt-1">Timeline: {inq.timeline}</p>
                      </div>

                      <div>
                        <p className="font-semibold uppercase tracking-wider text-[#635C53] text-[10px]">
                          Studio Status Activity Log:
                        </p>
                        <div className="space-y-1 mt-1">
                          {inq.statusUpdates && inq.statusUpdates.length > 0 ? (
                            inq.statusUpdates.map((u, i) => (
                              <p key={i} className="text-[#635C53] flex items-start gap-1">
                                <span className="font-mono text-gray-400 text-[10px] shrink-0">[{u.timestamp}]</span>
                                <span>{u.note}</span>
                              </p>
                            ))
                          ) : (
                            <p className="text-gray-400 italic">No studio updates logged yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SAVED ARTISANS & ARTWORK SHORTLIST                 */}
      {/* ========================================================= */}
      {activeTab === "saved" && (
        <div className="space-y-6">
          <div className="border-b border-[#E8DEC8] pb-4">
            <h2 className="font-serif font-bold text-xl text-[#1E2229]">
              {isHindi ? "आपकी सहेजी गई कलाकृतियां व शिल्पी" : "Your Saved Artworks & Artisan Shortlist"}
            </h2>
            <p className="text-xs text-[#635C53] mt-0.5">
              {isHindi
                ? "भविष्य की सजावट परियोजनाओं, उपहारों या कस्टम कमीशन के लिए सहेजे गए उत्पाद।"
                : "Bookmarked pieces for upcoming residential interior or corporate gifting commissions."}
            </p>
          </div>

          {savedProducts.length === 0 ? (
            <div className="rounded-sm bg-white border border-[#E8DEC8] p-12 text-center space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                {isHindi ? "कोई सहेजी गई कलाकृति नहीं है" : "No Saved Artworks Yet"}
              </h3>
              <p className="text-xs text-[#635C53] max-w-md mx-auto">
                {isHindi
                  ? "मार्केटप्लेस में किसी भी कलाकृति पर दिल के आइकन पर क्लिक करके उसे यहां सहेजें।"
                  : "Click the heart icon on any artwork card in the marketplace to add it to your personal patron shortlist."}
              </p>
              <button
                onClick={() => setActiveTab("marketplace")}
                className="px-5 py-2.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150"
              >
                {isHindi ? "शिल्प बाज़ार ब्राउज़ करें" : "Browse Marketplace"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-sm bg-white border border-[#E8DEC8] overflow-hidden flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="relative h-48 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleSaveProduct(product.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-sm bg-rose-50 text-rose-600 border border-[#E8DEC8]"
                        title="Remove from saved"
                      >
                        <Heart className="w-4 h-4 fill-rose-600" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] text-[#635C53] font-medium">{product.sellerName}</span>
                      <h4 className="font-serif font-bold text-sm text-[#1E2229] line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="font-serif font-bold text-base text-[#B4461F]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setCommissionModalProduct(product)}
                      className="w-full py-2 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150 flex items-center justify-center gap-1.5"
                    >
                      <span>{isHindi ? "कस्टम कमीशन मांगें" : "Commission Custom Work"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: PRODUCT QUICK VIEW & ARTISAN PROFILE PREVIEW     */}
      {/* ========================================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-2xl w-full p-6 sm:p-8 border border-[#E8DEC8] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Image showcase */}
                <div className="space-y-2">
                  <div className="h-64 rounded-sm bg-gray-100 overflow-hidden border border-[#E8DEC8]">
                    <ProtectedImage
                      src={quickViewProduct.images[0]}
                      alt={quickViewProduct.title}
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full"
                    />
                  </div>
                  {quickViewProduct.images.length > 1 && (
                    <div className="flex gap-2">
                      {quickViewProduct.images.slice(1).map((img, idx) => (
                        <ProtectedImage
                          key={idx}
                          src={img}
                          alt="thumbnail"
                          className="w-16 h-16 rounded-sm object-cover"
                          wrapperClassName="w-16 h-16 rounded-sm border border-[#E8DEC8] shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details column */}
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#FBF0EB] text-[#B4461F] border border-[#F3CFBF]">
                    {quickViewProduct.category}
                  </span>

                  <h2 className="font-serif font-bold text-xl text-[#1E2229]">
                    {quickViewProduct.title}
                  </h2>

                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-2xl text-[#B4461F]">
                      ₹{quickViewProduct.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#635C53]">({quickViewProduct.deliveryFormat})</span>
                  </div>

                  <div className="p-3 rounded-sm bg-[#FAF6ED] border border-[#E8DEC8] text-xs space-y-1">
                    <p className="flex justify-between">
                      <span className="text-[#635C53]">Lead Time:</span>
                      <span className="font-medium text-[#1E2229]">{quickViewProduct.leadTime}</span>
                    </p>
                    {quickViewProduct.dimensions && (
                      <p className="flex justify-between">
                        <span className="text-[#635C53]">Dimensions:</span>
                        <span className="font-medium text-[#1E2229]">{quickViewProduct.dimensions}</span>
                      </p>
                    )}
                    {quickViewProduct.material && (
                      <p className="flex justify-between">
                        <span className="text-[#635C53]">Material / Medium:</span>
                        <span className="font-medium text-[#1E2229]">{quickViewProduct.material}</span>
                      </p>
                    )}
                  </div>

                  {/* Artisan Micro Card */}
                  <div className="p-3 rounded-sm border border-[#DACABA] bg-[#FFFDF9] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ProtectedImage
                        src={quickViewProduct.sellerAvatar}
                        alt={quickViewProduct.sellerName}
                        className="w-10 h-10 rounded-sm object-cover"
                        wrapperClassName="w-10 h-10 rounded-sm border border-[#B4461F] shrink-0"
                      />
                      <div>
                        <p className="font-medium text-xs text-[#1E2229] flex items-center gap-1">
                          {quickViewProduct.sellerName}
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />
                        </p>
                        <p className="text-[11px] text-[#635C53]">{quickViewProduct.sellerCity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-[#F0E8D9] pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B4461F] mb-1">
                  Craft Story & Description:
                </h4>
                <p className="text-xs text-[#635C53] leading-relaxed font-normal">
                  {quickViewProduct.description}
                </p>
              </div>

              {/* 2 Clear Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleStartChat(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full sm:flex-1 py-3 rounded-sm bg-[#B4461F] text-white font-medium text-xs hover:bg-[#963715] transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isHindi ? "कारीगर से चैट / खरीदें" : "Inquire & Chat / Buy Now"}</span>
                </button>

                <button
                  onClick={() => {
                    setCommissionModalProduct(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full sm:flex-1 py-3 rounded-sm bg-[#B4461F] text-white font-medium text-xs hover:bg-[#963716] transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  <span>Commission Custom Work</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: COMMISSION CUSTOM WORK FORM                      */}
      {/* ========================================================= */}
      {commissionModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 sm:p-8 border border-[#E8DEC8] shadow-2xl relative">
            <button
              onClick={() => setCommissionModalProduct(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-3 border-b border-[#F0E8D9]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B4461F]">
                {isHindi ? "सीधा कारीगर कमीशन अनुरोध" : "Direct Artisan Commission Request"}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1E2229] mt-0.5">
                Commission {commissionModalProduct.sellerName}
              </h3>
              <p className="text-xs text-[#635C53]">
                Inspired by &ldquo;{commissionModalProduct.title}&rdquo;
              </p>
            </div>

            <form onSubmit={handleCommissionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                  {isHindi ? "विशिष्ट आवश्यकताएं (आकार, रंग, मात्रा):" : "Custom Requirements (Dimensions, Motif, Units):"}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    isHindi
                      ? "जैसे: हमें अपने लिविंग रूम के लिए इस तरह के 2 बड़े टेराकोटा वास चाहिए..."
                      : "e.g., We need 2 large planters in this finish with custom floral jaali carving for our foyer..."
                  }
                  value={commissionRequirements}
                  onChange={(e) => setCommissionRequirements(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                    {isHindi ? "प्रस्तावित बजट (₹):" : "Proposed Budget (₹):"}
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={commissionBudget}
                    onChange={(e) => setCommissionBudget(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2229] mb-1">
                    {isHindi ? "अपेक्षित समयसीमा:" : "Target Timeline:"}
                  </label>
                  <select
                    value={commissionTimeline}
                    onChange={(e) => setCommissionTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  >
                    <option value="Urgent: Within 7 days">Urgent (Within 7 days)</option>
                    <option value="Within 14 days">Standard (Within 14 days)</option>
                    <option value="Within 1 month">Relaxed (Within 1 month)</option>
                    <option value="Flexible / Custom Date">Flexible Date</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-[#FAF6ED] border border-[#E8DEC8] text-[11px] text-[#635C53] space-y-1">
                <p className="font-semibold text-[#1E2229]">
                  Patron Direct Guarantee:
                </p>
                <p>
                  100% of your proposed budget goes directly to the creator. No platform deduction. The artisan will confirm specifications via WhatsApp or call.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCommissionModalProduct(null)}
                  className="px-4 py-2.5 rounded-sm border border-[#DACABA] text-xs font-medium text-[#1E2229] hover:bg-[#FAF6ED] transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Commission Brief</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
