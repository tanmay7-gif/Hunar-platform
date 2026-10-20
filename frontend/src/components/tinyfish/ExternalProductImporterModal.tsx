"use client";

import React, { useState } from "react";
import { tinyFishFrontendService, TinyFishFetchResult } from "@/lib/tinyfish-agent";
import { useHunar } from "@/context/HunarContext";
import {
  FileText,
  Sparkles,
  Link as LinkIcon,
  X,
  CheckCircle2,
  RefreshCw,
  Package,
  Layers,
  ArrowRight,
  Eye,
  ExternalLink
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

    showToast("Product Imported", `"${data.title}" added to your live studio catalog.`);
    if (onImportComplete) {
      onImportComplete(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1E2229] border border-[#2C323D] rounded-sm max-w-2xl w-full p-6 text-[#FAF7F2] shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E5A93B] bg-[#E5A93B]/10 border border-[#E5A93B]/30 px-2 py-0.5 rounded-xs">
                TinyFish Fetch API
              </span>
              <span className="text-xs text-stone-400">Structured Web Page Extraction</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#FAF7F2]">
              Import Craft Listing from External URL
            </h2>
            <p className="text-xs text-stone-300">
              Extract clean markdown, craft techniques, pricing, and high-res imagery directly from Etsy, Instagram, or artisan blogs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleFetch} className="space-y-3">
          <label className="block text-xs font-medium text-stone-300">
            External Product or Exhibition URL
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://etsy.com/listing/... or portfolio URL"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#16191F] border border-[#2C323D] rounded-xs text-[#FAF7F2] placeholder-stone-500 focus:outline-none focus:border-[#B4461F]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#B4461F] hover:bg-[#963816] text-white text-xs font-semibold rounded-xs flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract via TinyFish</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Try test links: <code className="text-[#E5A93B]">https://etsy.com/listing/handmade-madhubani-tree-of-life</code> or any craft shop URL.
          </p>
        </form>

        {/* Extraction Preview Card */}
        {extractedResult && extractedResult.extractedData && (
          <div className="p-4 bg-[#16191F] border border-[#2C323D] rounded-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C323D] pb-3">
              <div className="flex items-center gap-2 text-xs text-[#4E9B6E]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">Structured Extraction Successful</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                Engine: TinyFish Fetch API (JSON Schema)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Thumbnail */}
              <div className="relative aspect-square rounded-xs overflow-hidden border border-[#2C323D] bg-stone-900">
                <ProtectedImage
                  src={
                    extractedResult.extractedData.images?.[0] ||
                    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={extractedResult.extractedData.title}
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
                <span className="absolute bottom-1 right-1 z-20 text-[9px] px-1 bg-black/70 text-white rounded">
                  Extracted Image
                </span>
              </div>

              {/* Data Fields */}
              <div className="md:col-span-2 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">Product Title</span>
                  <h4 className="font-semibold text-sm text-[#FAF7F2]">
                    {extractedResult.extractedData.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-stone-400">Extracted Price</span>
                    <p className="font-bold text-[#E5A93B] text-base">
                      ₹{extractedResult.extractedData.price?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Technique / Category</span>
                    <p className="text-stone-200">
                      {extractedResult.extractedData.craftTechnique || extractedResult.extractedData.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Lead Time</span>
                    <p className="text-stone-200">{extractedResult.extractedData.leadTime}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Stock Ready</span>
                    <p className="text-stone-200">{extractedResult.extractedData.stock} units</p>
                  </div>
                </div>

                {extractedResult.extractedData.materials && (
                  <div className="pt-1">
                    <span className="text-[10px] text-stone-400">Raw Materials:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {extractedResult.extractedData.materials.map((m: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 rounded-xs bg-[#2C323D] text-[10px] text-stone-300">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Markdown Narrative Excerpt */}
            <div className="p-3 bg-[#1E2229] border border-[#2C323D]/60 rounded-xs text-[11px] text-stone-300 leading-relaxed font-mono max-h-24 overflow-y-auto">
              <span className="text-[10px] text-[#E5A93B] block uppercase tracking-wider mb-1 font-sans">
                Clean Markdown Output:
              </span>
              {extractedResult.content}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyToCatalog}
                className="px-4 py-2 bg-[#00E676] hover:bg-[#00C853] text-[#121417] text-xs font-bold rounded-xs flex items-center gap-2 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,230,118,0.3)]"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Save to Studio Catalog (₹{extractedResult.extractedData.price})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
