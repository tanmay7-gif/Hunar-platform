"use client";

import React, { useState } from "react";
import { tinyFishFrontendService, TinyFishSearchResult } from "@/lib/tinyfish-agent";
import {
  Search,
  Globe,
  Sparkles,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X
} from "lucide-react";

export function MarketIntelligenceBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TinyFishSearchResult[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);

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

  return (
    <div className="w-full bg-[#1E2229] border border-[#2C323D] rounded-sm p-4 text-[#FAF7F2] shadow-sm">
      {/* Top Banner / Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#B4461F]/20 border border-[#B4461F]/40 flex items-center justify-center text-[#E5A93B]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E5A93B] uppercase tracking-wider">
                TinyFish Search API
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#2D583B]/40 text-[#4E9B6E] border border-[#2D583B]">
                Live Web Intelligence
              </span>
            </div>
            <h3 className="text-sm font-medium text-[#FAF7F2]">
              Artisan Raw Material Spot Index & Heritage GI Radar
            </h3>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search clay rates, silk yarn, dye prices, GI tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#16191F] border border-[#2C323D] rounded-xs text-[#FAF7F2] placeholder-stone-500 focus:outline-none focus:border-[#B4461F]"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-3 py-1.5 bg-[#B4461F] hover:bg-[#963816] text-white text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Fetch Trends</span>
          </button>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#2C323D]/60 overflow-x-auto text-[11px]">
        <span className="text-stone-400 whitespace-nowrap">Suggested Audits:</span>
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`px-2.5 py-1 rounded-xs border transition-colors whitespace-nowrap cursor-pointer ${
              activePreset === preset.label
                ? "bg-[#B4461F]/20 border-[#B4461F] text-[#FAF7F2]"
                : "bg-[#16191F] border-[#2C323D] text-stone-300 hover:border-stone-500"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Expandable Live Search Results Drawer */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#2C323D] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <TrendingUp className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span>
                Live intelligence extracted for <strong className="text-white">"{query}"</strong> via TinyFish Search
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-stone-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-[#E5A93B]" />
              <span>Scanning official repositories, EPCH, and GI tag databases...</span>
            </div>
          ) : results.length > 0 ? (
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
          )}
        </div>
      )}
    </div>
  );
}
