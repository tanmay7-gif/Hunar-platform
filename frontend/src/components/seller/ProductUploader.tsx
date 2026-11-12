"use client";

import React, { useState } from "react";
import { Product, ProductCategory, DeliveryFormat, Channel3ValuationResponse } from "@/types";
import { ApiService } from "@/lib/api";
import {
  Upload,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Scale,
  Building2,
  AlertCircle
} from "lucide-react";

interface ProductUploaderProps {
  onPublish: (product: Partial<Product>) => void;
  isHindi?: boolean;
}

export function ProductUploader({ onPublish, isHindi = false }: ProductUploaderProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Terracotta & Pottery");
  const [price, setPrice] = useState(2500);
  const [description, setDescription] = useState("");
  const [deliveryFormat, setDeliveryFormat] = useState<DeliveryFormat>("Physical Artwork");
  const [leadTime, setLeadTime] = useState("Made to order: 7-10 days");
  const [material, setMaterial] = useState("Natural red river clay, hand-burnished");
  const [dimensions, setDimensions] = useState("12in x 6in x 6in");
  const [stock, setStock] = useState(5);

  // Channel3 Fair-Pricing Copilot State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [valuation, setValuation] = useState<Channel3ValuationResponse | null>(null);
  const [valuationError, setValuationError] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const categories: ProductCategory[] = [
    "Terracotta & Pottery",
    "Madhubani Folk Art",
    "Handloom & Textiles",
    "Mural Design",
    "Bridal Mehndi",
    "Woodwork & Stone",
  ];

  // Analyze Channel3 market benchmark
  const handleAnalyzeBenchmark = async () => {
    const queryTerm = title.trim() || category;
    setIsAnalyzing(true);
    setValuationError(null);
    setAppliedNotice(false);

    try {
      const res = await ApiService.getChannel3Valuation({
        query: queryTerm,
        category,
        currency: "INR",
      });

      if (res.success && res.valuation) {
        setValuation(res.valuation);
      } else {
        setValuationError(
          isHindi
            ? "बाजार बेंचमार्क लोड करने में असमर्थ। कृपया पुनः प्रयास करें।"
            : "Unable to retrieve market benchmarks. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Channel3 valuation error:", err);
      setValuationError(
        err.message ||
          (isHindi
            ? "Channel3 बाजार विश्लेषण में त्रुटि हुई।"
            : "Channel3 benchmark query failed.")
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // One-click apply suggested optimal price
  const handleApplyOptimalPrice = () => {
    if (!valuation) return;
    setPrice(valuation.suggestedOptimalPrice);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish({
      title,
      category,
      price: Number(price),
      description,
      deliveryFormat,
      leadTime,
      material,
      dimensions,
      stock: Number(stock),
      images: [
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
      ],
      status: "Live",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title Field with Copilot Action */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#1E2229]">
              {isHindi ? "कलाकृति का शीर्षक *" : "Artwork Title *"}
            </label>
            <button
              type="button"
              onClick={handleAnalyzeBenchmark}
              disabled={isAnalyzing}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-60"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
              ) : (
                <Sparkles className="w-3 h-3 text-sky-600" />
              )}
              <span>
                {isHindi ? "Channel3 बाजार तुलना करें" : "Analyze Market Benchmark (Channel3)"}
              </span>
            </button>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hand-burnished Khurja Terracotta Vase"
            className="w-full px-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
          />
        </div>

        {/* Category & Price Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E2229] mb-1">
              {isHindi ? "शिल्प श्रेणी *" : "Craft Category *"}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3 py-2.5 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#1E2229]">
                {isHindi ? "मूल्य (₹ INR) *" : "Price (₹ INR) *"}
              </label>
              {valuation && (
                <span className="text-[10px] text-[#2D583B] font-medium flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Fair Living Wage</span>
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                required
                min={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816] font-mono font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8A7561] font-mono">
                ≈ ${(price / 85).toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CHANNEL3 AI FAIR-PRICE COPILOT WIDGET                    */}
        {/* ========================================================= */}
        {isAnalyzing && (
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-sm text-center space-y-2 animate-in fade-in duration-150">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-sky-600" />
            <p className="text-xs font-medium text-sky-950">
              {isHindi
                ? "Channel3 Product Data API से वाणिज्यिक खुदरा डेटा का विश्लेषण हो रहा है..."
                : "Scanning live retail equivalents via Channel3 Product Data API..."}
            </p>
            <p className="text-[11px] text-sky-800">
              Benchmarking mass-produced retail pricing vs. authentic handcrafted living wages
            </p>
          </div>
        )}

        {valuationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{valuationError}</span>
          </div>
        )}

        {valuation && !isAnalyzing && (
          <div className="p-4 bg-[#FAF7F2] border border-[#E8DEC8] rounded-sm space-y-4 shadow-xs animate-in zoom-in-98 duration-150">
            {/* Widget Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEC8] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xs bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#1E2229] flex items-center gap-2">
                    <span>AI Fair-Price Intelligence</span>
                    <span className="px-1.5 py-0.2 rounded-xs text-[9px] bg-sky-100 text-sky-700 border border-sky-300 font-mono font-bold">
                      Powered by Channel3
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#635C53]">
                    Commercial Retail Benchmark vs. Authentic Artisan Craftsmanship
                  </p>
                </div>
              </div>

              {/* One-Click Apply Button */}
              <button
                type="button"
                onClick={handleApplyOptimalPrice}
                className="px-3 py-1.5 rounded-sm bg-[#2D583B] hover:bg-[#23452E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                {appliedNotice ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? "मूल्य लागू किया गया!" : "Fair Price Applied!"}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>
                      {isHindi
                        ? `अनुशंसित मूल्य लागू करें (₹${valuation.suggestedOptimalPrice.toLocaleString("en-IN")})`
                        : `Apply Suggested Price (₹${valuation.suggestedOptimalPrice.toLocaleString("en-IN")})`}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Pricing Recommendation Comparison Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-white border border-[#E8DEC8] rounded-xs text-left space-y-1">
                <span className="text-[10px] text-[#8A7561] block uppercase tracking-wider font-semibold">
                  Commercial Retail Price
                </span>
                <span className="font-serif font-bold text-base text-[#635C53] block">
                  ₹{valuation.averageMarketPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-[#8A7561] block">
                  ≈ ${valuation.averageMarketPriceUsd} USD (Factory Alternative)
                </span>
              </div>

              <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-xs text-left space-y-1 ring-1 ring-sky-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sky-900 uppercase tracking-wider font-semibold">
                    Fair Handmade Value
                  </span>
                  <span className="px-1 py-0.2 rounded-xs text-[9px] font-bold bg-sky-200/70 text-sky-800">
                    +{valuation.craftPremiumPercentage}% Premium
                  </span>
                </div>
                <span className="font-serif font-bold text-base text-sky-900 block">
                  ₹{valuation.suggestedOptimalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-sky-700 block">
                  Target: ₹{valuation.suggestedMinPrice.toLocaleString("en-IN")} – ₹{valuation.suggestedPremiumPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E8DEC8] rounded-xs text-left space-y-1">
                <span className="text-[10px] text-[#8A7561] block uppercase tracking-wider font-semibold">
                  Artisan Living Floor
                </span>
                <span className="font-serif font-bold text-base text-[#2D583B] block">
                  ₹{valuation.artisanWageProtection.floorWage.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-[#2D583B] block">
                  Guarantees ₹280+/hr Master Wage
                </span>
              </div>
            </div>

            {/* AI Valuation Reasoning Explanation */}
            <div className="p-3 bg-white border border-[#E8DEC8] rounded-xs text-left space-y-1">
              <span className="text-[10px] font-bold text-[#8A7561] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B4461F]" />
                <span>Fair-Wage Copilot Evaluation</span>
              </span>
              <p className="text-xs text-[#635C53] leading-relaxed">
                {valuation.reasoning}
              </p>
            </div>

            {/* Live Commercial Products Comparison Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#1E2229] block">
                Top Commercial Alternatives from Retail (Channel3 Data):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {valuation.benchmarks.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white border border-[#E8DEC8] rounded-xs flex flex-col justify-between space-y-2 hover:border-[#B4461F]/40 transition-colors"
                  >
                    <div className="space-y-1.5">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-24 object-cover rounded-xs border border-[#E8DEC8]"
                        />
                      )}
                      <div className="flex items-center justify-between text-[10px] text-[#8A7561]">
                        <span className="font-medium text-[#1E2229] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#8A7561]" />
                          <span>{item.merchant || "Commercial Retail"}</span>
                        </span>
                        <span className="font-mono text-[#B4461F]">Mass Produced</span>
                      </div>
                      <h5 className="font-medium text-[11px] text-[#1E2229] line-clamp-2 leading-tight">
                        {item.title}
                      </h5>
                    </div>

                    <div className="pt-1.5 border-t border-[#E8DEC8] flex items-center justify-between text-[11px]">
                      <span className="font-serif font-bold text-[#1E2229]">
                        ₹{item.price.toLocaleString("en-IN")}{" "}
                        {item.priceUsd && (
                          <span className="text-[10px] font-normal text-[#8A7561]">
                            (${item.priceUsd})
                          </span>
                        )}
                      </span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-700 hover:text-sky-900 inline-flex items-center gap-0.5 text-[10px]"
                        >
                          <span>Retail Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description Field */}
        <div>
          <label className="block text-xs font-semibold text-[#1E2229] mb-1">
            {isHindi ? "विवरण और निर्माण कथा *" : "Craft Description & Provenance *"}
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe origin, materials, firing techniques, motifs..."
            className="w-full p-3 rounded-sm border border-[#D3CBBE] text-xs focus:outline-none focus:border-[#B4461F] bg-[#FDFCF9] text-[#1A1816]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 rounded-sm bg-[#B4461F] text-white text-xs font-medium hover:bg-[#963716] transition-colors duration-150 flex items-center gap-2 cursor-pointer shadow-xs"
      >
        <Upload className="w-4 h-4" />
        <span>{isHindi ? "कैटलॉग में प्रकाशित करें" : "Publish to Catalog"}</span>
      </button>
    </form>
  );
}
