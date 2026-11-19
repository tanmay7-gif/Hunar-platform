"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Share2,
  Copy,
  MessageCircle,
  MessageSquare,
  Star,
  Award,
  Layers,
  Phone,
  Calendar,
  Clock,
  Video,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Heart,
  Bookmark,
  ExternalLink,
  Store,
  Eye
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

function ArtisanProfileContent() {
  const params = useParams();
  const router = useRouter();
  const artisanIdOrUsername = params.id as string;
  const {
    creators,
    products,
    currentUser,
    language,
    startOrGetConversation,
    showToast,
    toggleSaveCreator,
    savedCreatorIds
  } = useHunar();
  const isHindi = language === "hi";

  // Find creator by ID or username (case-insensitive)
  const creator = creators.find(
    (c) =>
      c.id === artisanIdOrUsername ||
      c.username?.toLowerCase() === artisanIdOrUsername?.toLowerCase() ||
      (c.userId && c.userId === artisanIdOrUsername)
  );

  const [copied, setCopied] = useState(false);

  // If creator is not found, render clean fallback
  if (!creator) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#FDFCFB] text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF5EC] border border-[#E8DEC8] flex items-center justify-center text-[#B4461F] mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E2229] mb-2">
          {isHindi ? "कारीगर प्रोफ़ाइल नहीं मिली" : "Artisan Profile Not Found"}
        </h2>
        <p className="text-xs text-[#635C53] max-w-md mb-6 leading-relaxed">
          {isHindi
            ? "यह प्रोफ़ाइल लिंक अमान्य हो सकता है या अभी तक पंजीकृत नहीं हुआ है।"
            : "The requested artisan profile could not be located in our verified directory. They may have updated their handle or account."}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/customer/artisans"
            className="px-5 py-2.5 rounded-sm bg-[#1E2229] text-white text-xs font-semibold hover:bg-[#111418] transition-colors"
          >
            {isHindi ? "सभी कारीगर देखें" : "Explore All Artisans"}
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs font-semibold text-[#1E2229] hover:bg-white"
          >
            {isHindi ? "पीछे जाएं" : "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  // Filter products by this artisan
  const artisanProducts = products.filter(
    (p) =>
      p.sellerId === creator.id ||
      p.sellerName?.toLowerCase() === creator.name.toLowerCase() ||
      (creator.userId && p.sellerId === creator.userId)
  );

  const isSaved = savedCreatorIds.includes(creator.id);

  const handleMessageArtisan = () => {
    const conv = startOrGetConversation({
      sellerId: creator.id,
      initialMessage: `Namaste ${creator.name}! I am inquiring about commissioning custom handcrafted work after viewing your profile.`
    });
    router.push(`/dashboard/chat/${conv.id}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast(
        isHindi ? "लिंक कॉपी हो गया!" : "Link Copied!",
        isHindi ? "कारीगर प्रोफ़ाइल लिंक क्लिपबोर्ड पर कॉपी किया गया।" : "Artisan profile link copied to clipboard.",
        "success"
      );
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1E2229] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-[#635C53] border-b border-[#EAE6DF] pb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#B4461F] transition-colors">
              Hunar
            </Link>
            <span>/</span>
            <Link href="/dashboard/customer/artisans" className="hover:text-[#B4461F] transition-colors">
              {isHindi ? "कारीगर" : "Artisans"}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1E2229] truncate max-w-[200px]">
              {creator.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-sm border border-[#D3CBBE] hover:border-[#1E2229] bg-white text-xs font-semibold text-[#1E2229] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#B4461F]" />
              <span>{copied ? (isHindi ? "कॉपी हुआ!" : "Copied!") : (isHindi ? "शेयर करें" : "Share")}</span>
            </button>
            <button
              onClick={() => toggleSaveCreator(creator.id)}
              className={`p-1.5 rounded-sm border transition-colors cursor-pointer ${
                isSaved
                  ? "bg-[#FAF0E6] border-[#F3CFBF] text-[#B4461F]"
                  : "bg-white border-[#D3CBBE] text-gray-500 hover:text-[#B4461F]"
              }`}
              title={isSaved ? "Remove from wishlist" : "Bookmark artisan"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-lg border border-[#EAE6DF] shadow-xs overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-44 sm:h-56 w-full bg-stone-100 overflow-hidden">
            <img
              src={
                creator.coverImage ||
                "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80"
              }
              alt={`${creator.name} workshop banner`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-2 text-white text-xs">
              <span className="px-2 py-0.5 rounded-xs bg-[#1E2229]/80 backdrop-blur-xs font-semibold text-[10px] tracking-wide uppercase border border-white/20">
                Verified Studio
              </span>
              <span className="text-white/80">•</span>
              <span className="font-medium text-white/90">{creator.city}, India</span>
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              {/* Profile Photo */}
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover aspect-square ring-4 ring-white shadow-md bg-white"
                  />
                  {creator.isVerified && (
                    <span
                      className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#2D583B] border-2 border-white flex items-center justify-center text-white"
                      title="Verified Master Craftsman"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2229]">
                      {creator.name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <span className="text-xs font-semibold text-[#B4461F]">
                      {creator.primaryArtForm}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-800 text-xs sm:text-sm font-medium shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">
                        {(() => {
                          const rawCity = creator.city || "Khurja / Delhi NCR";
                          const parts = rawCity.split("/").map((p) => p.trim());
                          if (parts.length > 1) {
                            return (
                              <>
                                <span>{parts[0]}</span>
                                <span className="text-orange-400 mx-1">/</span>
                                <span>{parts.slice(1).join(" / ")}</span>
                              </>
                            );
                          }
                          return rawCity;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Message & WhatsApp */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleMessageArtisan}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-sm bg-[#1E2229] hover:bg-[#111418] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isHindi ? "कारीगर को संदेश भेजें" : "Message Artisan"}</span>
                </button>

                <a
                  href={`https://wa.me/${creator.whatsapp || "919876543210"}?text=${encodeURIComponent(
                    creator.whatsappInquiryText ||
                      `Namaste ${creator.name}, I found your profile on Hunar and would like to inquire about your craft.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-sm bg-[#2D583B] hover:bg-[#23452E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#EAE6DF]">
              <div className="p-3.5 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Base Pricing</span>
                <span className="font-serif font-bold text-sm text-[#1E2229] mt-0.5 block">
                  ₹{creator.minPricing.toLocaleString("en-IN")}+
                </span>
                <span className="text-[10px] text-[#8A7561]">{creator.unitPricingLabel}</span>
              </div>

              <div className="p-3.5 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Experience</span>
                <span className="font-serif font-bold text-sm text-[#1E2229] mt-0.5 block">
                  {creator.experienceLevel || "Established (3-7 yrs)"}
                </span>
                <span className="text-[10px] text-[#8A7561]">Verified Studio</span>
              </div>

              <div className="p-3.5 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Rating & Reviews</span>
                <div className="flex items-center gap-1 font-bold text-sm text-[#1E2229] mt-0.5">
                  <Star className="w-3.5 h-3.5 text-[#E5A93B] fill-current" />
                  <span>{creator.rating || 5.0}</span>
                  <span className="text-gray-400 text-[10px]">({creator.reviewsCount || 1})</span>
                </div>
                <span className="text-[10px] text-[#2D583B] font-medium">100% On-Time</span>
              </div>

              <div className="p-3.5 rounded-sm bg-[#F9FBFB] border border-[#E3EDEC]">
                <span className="text-[10px] uppercase font-bold text-[#635C53] block">Languages</span>
                <span className="font-serif font-bold text-sm text-[#1E2229] mt-0.5 block">
                  {creator.languages?.join(", ") || "Hindi, English"}
                </span>
                <span className="text-[10px] text-[#8A7561]">Vernacular Voice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Craftsmanship Section */}
        <div className="bg-white rounded-lg border border-[#EAE6DF] shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1E2229]">
            {isHindi ? "शिल्पकार परिचय एवं पृष्ठभूमि" : "About the Craft & Lineage"}
          </h3>
          <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed whitespace-pre-line max-w-4xl">
            {isHindi && creator.bioHindi ? creator.bioHindi : creator.bio}
          </p>

          <div className="pt-3">
            <span className="text-[11px] font-bold text-[#1E2229] block mb-2">
              {isHindi ? "विशेष कौशल एवं माध्यम" : "Techniques & Skills"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {creator.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-xs bg-[#FAF8F5] text-[#1E2229] border border-[#EAE6DF] font-medium"
                >
                  {skill}
                </span>
              ))}
              {creator.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-xs bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB] font-semibold"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Listed Crafts & Artwork Catalog */}
        <div className="bg-white rounded-lg border border-[#EAE6DF] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                {isHindi ? "उपलब्ध कलाकृतियां एवं कमीशन कार्य" : "Handcrafted Works & Commissions"}
              </h3>
              <p className="text-xs text-[#635C53]">
                {isHindi
                  ? `${creator.name} द्वारा बनाए गए प्रामाणिक हस्तशिल्प`
                  : `Explore verified handcrafted creations by ${creator.name}`}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF5EC] text-[#B4461F] border border-[#E8DEC8]">
              {artisanProducts.length} {isHindi ? "कृतियां" : "pieces"}
            </span>
          </div>

          {artisanProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisanProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-sm bg-white border border-[#EAE6DF] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <ProtectedImage
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xs bg-[#1E2229] text-white text-[10px] font-medium">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#1E2229] line-clamp-1 group-hover:text-[#B4461F] transition-colors">
                      {product.title}
                    </h4>
                    {product.material && (
                      <p className="text-[11px] text-[#635C53] line-clamp-1">
                        <span className="font-semibold text-[#8A7561]">Material: </span>
                        {product.material}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE6DF]">
                      <span className="font-serif font-bold text-sm text-[#1E2229]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={handleMessageArtisan}
                        className="text-xs font-semibold text-[#B4461F] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inquire</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Portfolio Showcase if no separate store products */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creator.portfolioImages?.map((port, idx) => (
                <div
                  key={idx}
                  className="rounded-sm border border-[#EAE6DF] p-4 flex gap-4 bg-[#FAF8F5] items-center"
                >
                  <div className="w-20 h-20 rounded-xs overflow-hidden border border-[#EAE6DF] shrink-0">
                    <ProtectedImage
                      src={port.imageUrl}
                      alt={port.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#1E2229]">{port.title}</h4>
                    <p className="text-[11px] text-[#635C53] mt-0.5">{port.medium}</p>
                    <span className="text-xs font-bold text-[#B4461F] block mt-1">
                      Commissions from ₹{(port.price || creator.minPricing).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PublicArtisanProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center text-[#635C53] font-medium text-xs">
          Loading artisan profile...
        </div>
      }
    >
      <ArtisanProfileContent />
    </Suspense>
  );
}
