"use client";

import React from "react";
import { Product } from "@/types";
import { Heart, Clock, CheckCircle2, Eye, MessageCircle } from "lucide-react";

interface BazaarFeedProps {
  products: Product[];
  savedProductIds: string[];
  onToggleSave: (id: string) => void;
  onQuickView: (product: Product) => void;
  isHindi?: boolean;
}

export function BazaarFeed({
  products,
  savedProductIds,
  onToggleSave,
  onQuickView,
  isHindi = false,
}: BazaarFeedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const isSaved = savedProductIds.includes(product.id);

        return (
          <div
            key={product.id}
            className="rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-150 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-60 bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xs bg-[#1E2229] text-[#FAF7F2] text-[10px] font-medium">
                  {product.deliveryFormat === "On-site Commission"
                    ? "On-site Mural / Event"
                    : "Physical Ship"}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-sm border border-[#E8DEC8] transition-colors duration-150 ${
                    isSaved
                      ? "bg-rose-50 text-rose-600"
                      : "bg-white text-gray-500 hover:text-[#B4461F]"
                  }`}
                  title="Save to Shortlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-600" : ""}`} />
                </button>

                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-xs text-[10px] font-medium bg-[#FAF6EE] text-[#1E2229] border border-[#E8DEC8] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#B4461F]" />
                  <span>{product.leadTime}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-6 h-6 rounded-full object-cover aspect-square ring-1 ring-[#E8DEC8]"
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

                <h3
                  onClick={() => onQuickView(product)}
                  className="font-serif font-bold text-base text-[#1E2229] group-hover:text-[#B4461F] transition-colors duration-150 line-clamp-2 cursor-pointer mb-2"
                >
                  {isHindi && product.titleHindi ? product.titleHindi : product.title}
                </h3>

                {product.material && (
                  <p className="text-xs text-[#635C53] line-clamp-1 leading-relaxed">
                    <span className="font-semibold text-[#B4461F]">Medium: </span>
                    {product.material}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Row */}
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
                  onClick={() => onQuickView(product)}
                  className="p-2 rounded-sm bg-[#FAF5EC] border border-[#DACABA] text-[#1E2229] hover:bg-[#F3EADB] transition-colors duration-150"
                  title="Quick View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://wa.me/${product.sellerWhatsapp}?text=${encodeURIComponent(
                    `Namaste ${product.sellerName}, I am inquiring about "${product.title}" (Item ID: ${product.id}) listed on Hunar for ₹${product.price}. Is this currently available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
