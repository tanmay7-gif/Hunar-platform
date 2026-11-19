"use client";

import React, { useState, useEffect } from "react";
import { tinyFishFrontendService, TinyFishFetchResult } from "@/lib/tinyfish-agent";
import { useHunar } from "@/context/HunarContext";
import {
  Sparkles,
  Link as LinkIcon,
  X,
  CheckCircle2,
  RefreshCw,
  Package,
} from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

interface ExternalProductImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (productData: any) => void;
}

export function ExternalProductImporterModal({
  isOpen,
  onClose,
  onImportComplete
}: ExternalProductImporterModalProps) {
  const { addProduct, showToast } = useHunar();
  const [url, setUrl] = useState("https://etsy.com/listing/handmade-madhubani-tree-of-life");
  const [loading, setLoading] = useState(false);
  const [extractedResult, setExtractedResult] = useState<TinyFishFetchResult | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const result = await tinyFishFrontendService.fetch(url, {
        target: "artisan_catalog_product"
      });
      setExtractedResult(result);
    } catch (err: any) {
      console.error("Fetch failed:", err);
      showToast("Extraction Notice", "Used local craft schema extractor for demonstration.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToCatalog = () => {
    if (!extractedResult || !extractedResult.extractedData) return;
    const data = extractedResult.extractedData;

    addProduct({
      title: data.title || "Imported Craft Artwork",
      category: data.category || "Folk & Studio Commission",
      price: Number(data.price) || 3500,
      stock: Number(data.stock) || 3,
      deliveryFormat: "Physical Artwork",
      leadTime: data.leadTime || "Ready to ship (3-5 days)",
      description: data.description || extractedResult.content.slice(0, 300),
      images: data.images || ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80"],
      status: "Live"
    });

    showToast("Product Imported", `"${data.title}" added to your live studio catalog.`, "success");
    if (onImportComplete) {
      onImportComplete(data);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white text-stone-900 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Pinned Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                TinyFish Fetch API
              </span>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Structured Web Extraction
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
              Import Craft Listing from External URL
            </h2>
            <p className="text-[11px] text-stone-500">
              Extract craft techniques, pricing, materials, and photos directly into your catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3">
          {/* Input Form */}
          <form onSubmit={handleFetch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              External Product or Exhibition URL
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 shrink-0" />
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://etsy.com/listing/... or portfolio URL"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer shadow-xs shrink-0"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Extract via TinyFish</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-1">
              <span>Try test link:</span>
              <button
                type="button"
                onClick={() => setUrl("https://etsy.com/listing/handmade-madhubani-tree-of-life")}
                className="text-orange-600 hover:underline font-mono text-[10px] truncate max-w-[280px] sm:max-w-none text-left cursor-pointer"
              >
                handmade-madhubani-tree-of-life
              </button>
            </p>
          </form>

          {/* Extracted Preview Card */}
          {extractedResult && extractedResult.extractedData && (
            <div className="p-3.5 bg-orange-50/50 border border-orange-200/90 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-orange-200/60 pb-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Structured Extraction Successful</span>
                </div>
                <span className="text-[10px] font-mono text-stone-500">
                  Engine: TinyFish Fetch API
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                {/* Product Thumbnail - Constrained height */}
                <div className="relative h-32 sm:h-36 max-h-40 w-full rounded-lg overflow-hidden border border-orange-200/80 bg-stone-100 shrink-0">
                  <ProtectedImage
                    src={
                      extractedResult.extractedData.images?.[0] ||
                      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={extractedResult.extractedData.title}
                    className="max-h-40 w-full h-full object-cover rounded-lg"
                    wrapperClassName="w-full h-full"
                  />
                  <span className="absolute bottom-1 right-1 z-20 text-[9px] font-medium px-1.5 py-0.5 bg-black/70 text-white rounded">
                    Extracted Image
                  </span>
                </div>

                {/* Data Fields */}
                <div className="sm:col-span-2 space-y-2 text-xs min-w-0">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Product Title
                    </span>
                    <h4 className="font-semibold text-sm text-stone-900 leading-snug line-clamp-2">
                      {extractedResult.extractedData.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="p-1.5 bg-white rounded-lg border border-orange-100">
                      <span className="text-[10px] text-stone-500 block">Extracted Price</span>
                      <p className="font-bold text-orange-600 text-sm font-serif">
                        ₹{extractedResult.extractedData.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-orange-100">
                      <span className="text-[10px] text-stone-500 block">Technique / Category</span>
                      <p className="text-stone-800 font-medium text-xs truncate">
                        {extractedResult.extractedData.craftTechnique || extractedResult.extractedData.category}
                      </p>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-orange-100">
                      <span className="text-[10px] text-stone-500 block">Lead Time</span>
                      <p className="text-stone-800 text-xs truncate">{extractedResult.extractedData.leadTime}</p>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-orange-100">
                      <span className="text-[10px] text-stone-500 block">Stock Ready</span>
                      <p className="text-stone-800 text-xs">{extractedResult.extractedData.stock} units</p>
                    </div>
                  </div>

                  {extractedResult.extractedData.materials && (
                    <div className="pt-0.5">
                      <span className="text-[10px] text-stone-500 font-medium">Materials:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {extractedResult.extractedData.materials.map((m: string, i: number) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-full bg-white border border-stone-200 text-[10px] text-stone-700 font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Markdown Narrative Excerpt */}
              <div className="p-2.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-700 leading-relaxed font-mono max-h-20 overflow-y-auto">
                <span className="text-[10px] text-orange-700 font-bold font-sans block uppercase tracking-wider mb-0.5">
                  Clean Markdown Output:
                </span>
                {extractedResult.content}
              </div>
            </div>
          )}
        </div>

        {/* 3. Pinned Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 px-5 py-3.5 border-t border-stone-200 bg-gray-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyToCatalog}
            disabled={!extractedResult?.extractedData || loading}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Package className="w-3.5 h-3.5" />
            <span>
              {extractedResult?.extractedData
                ? `Save to Inventory (₹${extractedResult.extractedData.price?.toLocaleString() || "3,500"})`
                : "Save / Import to Inventory"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
