"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MessageSquare,
  ExternalLink,
  Trash2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Package,
  Users
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export default function SavedCollectionsPage() {
  const router = useRouter();
  const {
    products,
    creators,
    savedProductIds,
    toggleSaveProduct,
    savedCreatorIds,
    toggleSaveCreator,
    startOrGetConversation
  } = useHunar();
  const { t, currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";
  const [activeTab, setActiveTab] = useState<"artworks" | "artisans">("artworks");

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));
  const savedCreators = creators.filter((c) => savedCreatorIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#E8DEC8] bg-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                Patron Moodboard
              </span>
              <span className="text-xs text-[#635C53] font-medium">• Curated Regional Treasures</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "सहेजे गए संग्रह" : "Saved Collections"}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/customer"
              className="px-4 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Browse More Art</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DEC8] pb-3">
        <button
          onClick={() => setActiveTab("artworks")}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors duration-150 flex items-center gap-2 ${
            activeTab === "artworks"
              ? "bg-[#2D583B] text-white"
              : "bg-white text-[#635C53] border border-[#D3CBBE] hover:bg-[#FAF7F2]"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Artworks ({savedProducts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("artisans")}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors duration-150 flex items-center gap-2 ${
            activeTab === "artisans"
              ? "bg-[#2D583B] text-white"
              : "bg-white text-[#635C53] border border-[#D3CBBE] hover:bg-[#FAF7F2]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Shortlisted Artisans ({savedCreators.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === "artworks" ? (
        <div>
          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedProducts.map((prod) => {
                const whatsappUrl = `https://wa.me/${prod.sellerWhatsapp || "919811876543"}?text=${encodeURIComponent(
                  `Namaste ${prod.sellerName}, I am inquiring about "${prod.title}" (Item ID: ${prod.id}) listed on Hunar for ₹${prod.price}. Is this currently available?`
                )}`;

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-sm border border-[#E8DEC8] hover:border-[#B4461F] transition-all duration-150 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md flex flex-col"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      <ProtectedImage
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        wrapperClassName="w-full h-full"
                      />
                      <button
                        onClick={() => toggleSaveProduct(prod.id)}
                        className="absolute top-3 right-3 z-20 p-2 rounded-sm bg-white border border-[#E8DEC8] text-[#B4461F] hover:bg-[#FAF7F2] transition-colors duration-150"
                        title="Remove from saved collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#B4461F]">
                          {prod.category}
                        </span>
                        <h3 className="font-serif font-bold text-sm text-[#1E2229] line-clamp-1 mt-0.5">
                          {prod.title}
                        </h3>
                        <p className="text-xs text-[#635C53] mt-0.5">
                          By <span className="font-semibold text-[#1E2229]">{prod.sellerName}</span> • {prod.sellerCity}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E8DEC8]">
                        <div>
                          <span className="text-[10px] text-[#635C53] uppercase font-semibold">Direct Price:</span>
                          <p className="font-bold text-base text-[#1E2229]">₹{prod.price.toLocaleString("en-IN")}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const conv = startOrGetConversation({
                              sellerId: prod.sellerId,
                              productId: prod.id,
                              initialMessage: `Namaste ${prod.sellerName}! I have saved "${prod.title}" (₹${prod.price}) to my wishlist and would like to inquire about ordering.`
                            });
                            router.push(`/dashboard/chat/${conv.id}`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm btn-terracotta text-white text-xs font-semibold shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Inquire / Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-sm border border-[#E8DEC8] p-8 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Bookmark className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#1E2229]">{t("nav.wishlist")}</h3>
              <p className="text-xs text-[#635C53] max-w-md mx-auto">
                {t("dashboard.emptyWishlist")}
              </p>
              <Link
                href="/dashboard/customer"
                className="inline-block mt-2 px-4 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150"
              >
                {t("cta.browseArt")}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          {savedCreators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedCreators.map((creator) => {
                const whatsappUrl = `https://wa.me/${creator.whatsapp}?text=${encodeURIComponent(
                  `Namaste ${creator.name}, I shortlisted your studio on Hunar and would like to discuss a custom project.`
                )}`;

                return (
                  <div
                    key={creator.id}
                    className="bg-white rounded-sm border border-[#E8DEC8] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-150 space-y-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <ProtectedImage
                          src={creator.avatarUrl}
                          alt={creator.name}
                          className="w-14 h-14 rounded-full object-cover aspect-square"
                          wrapperClassName="w-14 h-14 rounded-full ring-1 ring-[#E8DEC8] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="font-serif font-bold text-base text-[#1E2229]">
                              {creator.name}
                            </h3>
                            {creator.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] dark:text-[#00E676]" />
                            )}
                          </div>
                          <p className="text-xs text-[#B4461F] font-semibold">{creator.primaryArtForm}</p>
                          <p className="text-[11px] text-[#635C53]">{creator.city}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveCreator(creator.id)}
                        className="p-1.5 rounded-sm text-gray-400 hover:text-red-600 transition-colors duration-150"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#635C53] line-clamp-2 leading-relaxed">{creator.bio}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-[#E8DEC8]">
                      <div>
                        <span className="text-[10px] text-[#635C53] uppercase font-semibold">Starts from:</span>
                        <p className="font-bold text-xs text-[#1E2229]">₹{creator.minPricing.toLocaleString("en-IN")}+</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const conv = startOrGetConversation({
                              sellerId: creator.id,
                              initialMessage: `Namaste ${creator.name}! I shortlisted your craft studio on Hunar and would like to discuss a custom project.`
                            });
                            router.push(`/dashboard/chat/${conv.id}`);
                          }}
                          className="px-3 py-1.5 rounded-sm btn-terracotta text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                        <Link
                          href={`/u/${creator.username}`}
                          className="p-1.5 rounded-sm border border-[#D3CBBE] text-[#635C53] hover:bg-[#FAF7F2] transition-colors duration-150"
                          title="View lookbook card"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-sm border border-[#E8DEC8] p-8 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Users className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#1E2229]">No Shortlisted Artisans Yet</h3>
              <p className="text-xs text-[#635C53] max-w-md mx-auto">
                Discover folk masters, ceramicists, and muralists in the directory and shortlist them for your projects.
              </p>
              <Link
                href="/dashboard/customer/artisans"
                className="inline-block mt-2 px-4 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150"
              >
                Discover Artisans
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
