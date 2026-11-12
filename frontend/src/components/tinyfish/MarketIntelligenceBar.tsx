"use client";

import React, { useState, useEffect } from "react";
import { tinyFishFrontendService, TinyFishSearchResult } from "@/lib/tinyfish-agent";
import { ApiService } from "@/lib/api";
import { Channel3TrendMetric, Channel3ValuationResponse } from "@/types";
import {
  Search,
  Globe,
  Sparkles,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X,
  Scale,
  Building2,
  DollarSign
} from "lucide-react";

export function MarketIntelligenceBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"TINYFISH" | "CHANNEL3">("CHANNEL3");
  const [results, setResults] = useState<TinyFishSearchResult[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Channel3 State
  const [channel3Trends, setChannel3Trends] = useState<Channel3TrendMetric[]>([
    {
      category: "Terracotta & Pottery",
      averageCommercialPrice: 2125,
      suggestedHandmadePrice: 2850,
      premiumPercentage: 34,
      sampleCommercialTitle: "Target Ceramic Machine-Molded Vase",
      merchant: "Target Home",
    },
    {
      category: "Brass Dhokra Sculptures",
      averageCommercialPrice: 3400,
      suggestedHandmadePrice: 4600,
      premiumPercentage: 35,
      sampleCommercialTitle: "AmazonBasics Die-Cast Brass Figurine",
      merchant: "Amazon Basics",
    },
    {
      category: "Handwoven Pashmina",
      averageCommercialPrice: 2650,
      suggestedHandmadePrice: 3800,
      premiumPercentage: 43,
      sampleCommercialTitle: "Zara Jacquard Poly-Blend Stole",
      merchant: "Zara Trend",
    },
    {
      category: "Blue Pottery",
      averageCommercialPrice: 2250,
      suggestedHandmadePrice: 3050,
      premiumPercentage: 35,
      sampleCommercialTitle: "Crate & Barrel Screen-Printed Platter",
      merchant: "Crate & Barrel",
    },
    {
      category: "Madhubani Folk Art",
      averageCommercialPrice: 2175,
      suggestedHandmadePrice: 2900,
      premiumPercentage: 33,
      sampleCommercialTitle: "Society6 Giclée Litho Canvas Print",
      merchant: "Society6",
    },
  ]);
  const [channel3Valuation, setChannel3Valuation] = useState<Channel3ValuationResponse | null>(null);
  const [activeTrendCategory, setActiveTrendCategory] = useState<string | null>(null);

  // Load trends from backend
  useEffect(() => {
    ApiService.getChannel3Trends()
      .then((res) => {
        if (res.success && res.trends && res.trends.length > 0) {
          setChannel3Trends(res.trends);
        }
      })
      .catch((err) => {
        console.warn("[MarketIntelligenceBar] Failed to fetch live trends:", err);
      });
  }, []);

  const presets = [
    { label: "Khurja Terracotta Clay Wholesale", query: "Khurja terracotta raw clay wholesale price 2026" },
    { label: "Chanderi Mulberry Silk Yarn Spot Rates", query: "Chanderi handloom mulberry silk yarn spot rates" },
    { label: "Surajkund Crafts Mela 2026 Grants", query: "Surajkund international crafts mela 2026 master artisan stalls" },
    { label: "Natural Indigo & Bagru Dabu Dyes", query: "Natural indigo dye wholesale suppliers Rajasthan" }
  ];

  const handleSearch = async (searchTerm?: string) => {
    const q = searchTerm || query;
    if (!q.trim()) return;

    setLoading(true);
    setIsOpen(true);
    setActiveTab("TINYFISH");
    try {
      const data = await tinyFishFrontendService.search(q);
      setResults(data);
    } catch (err) {
      console.error("Market intelligence search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    setActivePreset(preset.label);
    setQuery(preset.query);
    handleSearch(preset.query);
  };

  // Inspect Channel3 Category Benchmark
  const handleInspectChannel3Category = async (metric: Channel3TrendMetric) => {
    setActiveTrendCategory(metric.category);
    setActiveTab("CHANNEL3");
    setLoading(true);
    setIsOpen(true);

    try {
      const res = await ApiService.getChannel3Valuation({
        query: metric.sampleCommercialTitle,
        category: metric.category,
        currency: "INR",
      });

      if (res.success && res.valuation) {
        setChannel3Valuation(res.valuation);
      }
    } catch (err) {
      console.error("Channel3 category inspection error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#1E2229] border border-[#2C323D] rounded-sm p-4 text-[#FAF7F2] shadow-sm">
      {/* Top Banner / Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Market Intelligence Hub
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/30 text-sky-300 border border-sky-400/40 font-mono">
                Channel3 + TinyFish
              </span>
            </div>
            <h3 className="text-sm font-medium text-[#FAF7F2]">
              Real-World Retail Benchmarks & Fair-Wage Valuation Index
            </h3>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search craft retail alternatives, raw materials, dyes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#16191F] border border-[#2C323D] rounded-xs text-[#FAF7F2] placeholder-stone-500 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Fetch Radar</span>
          </button>
        </div>
      </div>

      {/* Channel3 Retail-to-Handmade Benchmark Index Ticker */}
      <div className="mt-3 pt-3 border-t border-[#2C323D]/60 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-sky-300 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span>Channel3 Retail Price Index (Mass-Market vs Authentic Handmade):</span>
          </span>
          <span className="text-stone-400 text-[10px] hidden sm:inline font-mono">
            api.trychannel3.com
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          {channel3Trends.map((metric) => (
            <button
              key={metric.category}
              onClick={() => handleInspectChannel3Category(metric)}
              className={`px-2.5 py-1.5 rounded-xs border transition-colors whitespace-nowrap text-left flex items-center gap-2 cursor-pointer ${
                activeTrendCategory === metric.category && isOpen && activeTab === "CHANNEL3"
                  ? "bg-sky-500/25 border-sky-400 text-sky-200"
                  : "bg-[#16191F] border-[#2C323D] text-stone-300 hover:border-stone-500"
              }`}
            >
              <div>
                <span className="font-semibold block text-[#FAF7F2]">{metric.category}</span>
                <span className="text-[10px] text-stone-400 block">
                  Retail: ₹{metric.averageCommercialPrice.toLocaleString("en-IN")} ➔ Handmade:{" "}
                  <strong className="text-sky-300">₹{metric.suggestedHandmadePrice.toLocaleString("en-IN")}</strong>
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-bold bg-[#2D583B]/60 text-[#71C28D] border border-[#2D583B]">
                +{metric.premiumPercentage}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TinyFish Raw Material Presets */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2C323D]/40 overflow-x-auto text-[11px]">
        <span className="text-stone-400 whitespace-nowrap text-[10px]">TinyFish Raw Materials:</span>
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`px-2 py-0.5 rounded-xs border transition-colors whitespace-nowrap cursor-pointer text-[10px] ${
              activePreset === preset.label && isOpen && activeTab === "TINYFISH"
                ? "bg-amber-500/20 border-amber-400 text-amber-200"
                : "bg-[#16191F] border-[#2C323D] text-stone-400 hover:text-stone-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Expandable Live Search & Channel3 Benchmark Results Drawer */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#2C323D] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("CHANNEL3")}
                className={`text-xs font-semibold px-2.5 py-1 rounded-xs cursor-pointer transition-colors ${
                  activeTab === "CHANNEL3"
                    ? "bg-sky-600 text-white"
                    : "bg-[#16191F] text-stone-400 hover:text-white"
                }`}
              >
                Channel3 Retail Benchmarks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("TINYFISH")}
                className={`text-xs font-semibold px-2.5 py-1 rounded-xs cursor-pointer transition-colors ${
                  activeTab === "TINYFISH"
                    ? "bg-sky-600 text-white"
                    : "bg-[#16191F] text-stone-400 hover:text-white"
                }`}
              >
                TinyFish Spot Rates & GI Tag Radar
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
              <span>Querying Channel3 product market data and heritage pricing index...</span>
            </div>
          ) : activeTab === "CHANNEL3" ? (
            /* Channel3 Benchmark Cards */
            channel3Valuation ? (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3 bg-[#16191F] border border-[#2C323D] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-sky-400 font-mono font-semibold uppercase tracking-wider block">
                      Category Valuation: {channel3Valuation.category}
                    </span>
                    <h4 className="text-xs font-medium text-[#FAF7F2]">
                      Commercial Retail Benchmark:{" "}
                      <strong className="text-stone-300">₹{channel3Valuation.averageMarketPrice.toLocaleString("en-IN")}</strong>{" "}
                      | Fair Handmade Target:{" "}
                      <strong className="text-[#4E9B6E]">
                        ₹{channel3Valuation.suggestedOptimalPrice.toLocaleString("en-IN")} (+{channel3Valuation.craftPremiumPercentage}%)
                      </strong>
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#2D583B]/50 text-[#71C28D] border border-[#2D583B]">
                      Floor Wage: ₹{channel3Valuation.artisanWageProtection.floorWage.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {channel3Valuation.benchmarks.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#16191F] border border-[#2C323D] rounded-xs space-y-2 flex flex-col justify-between hover:border-stone-500 transition-colors"
                    >
                      <div className="space-y-1.5">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-24 object-cover rounded-xs border border-[#2C323D]"
                          />
                        )}
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="font-medium text-sky-300 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-stone-400" />
                            <span>{item.merchant || "Commercial Retail"}</span>
                          </span>
                          <span className="font-mono text-amber-400">Mass Produced</span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#FAF7F2] line-clamp-2 leading-tight">
                          {item.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-[#2C323D]/60 flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-white">
                          ₹{item.price.toLocaleString("en-IN")}{" "}
                          {item.priceUsd && (
                            <span className="text-[10px] font-normal text-stone-400">
                              (${item.priceUsd})
                            </span>
                          )}
                        </span>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:underline inline-flex items-center gap-1 text-[10px]"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-3 text-center">
                Select a craft category chip above to inspect Channel3 real-world retail pricing benchmarks.
              </p>
            )
          ) : (
            /* TinyFish Results */
            results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#16191F] border border-[#2C323D] rounded-xs space-y-2 flex flex-col justify-between hover:border-stone-500 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-stone-400">
                        <span className="font-mono text-[#E5A93B]">{r.source || "TinyFish Live Web"}</span>
                        <ShieldCheck className="w-3 h-3 text-[#4E9B6E]" />
                      </div>
                      <h4 className="text-xs font-semibold text-[#FAF7F2] line-clamp-2">{r.title}</h4>
                      <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-3">{r.snippet}</p>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#E5A93B] hover:underline flex items-center gap-1 pt-1 border-t border-[#2C323D]/40"
                    >
                      <span>Inspect Source</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-3 text-center">
                No direct matches found. Try queries like "Khurja Terracotta" or "Chanderi Silk".
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
