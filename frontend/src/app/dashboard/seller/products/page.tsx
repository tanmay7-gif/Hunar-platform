"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/lib/data";
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Search,
  Layers,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { useTinyFishSyncQueue } from "@tinyfish/core";
import { ExternalProductImporterModal } from "@/components/tinyfish/ExternalProductImporterModal";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export default function SellerProductsPage() {
  const {
    products,
    currentUser,
    toggleProductStatus,
    deleteProduct,
    updateProduct,
    addProduct,
    showToast
  } = useHunar();
  const { t, currentLanguage } = useLanguage();
  const isHindi = currentLanguage === "hi";
  const { queue, pendingCount, isOnline, isSyncing, flushQueue } = useTinyFishSyncQueue();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Live" | "Draft">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Product["category"]>("Terracotta & Pottery");
  const [newPrice, setNewPrice] = useState(3200);
  const [newStock, setNewStock] = useState(6);
  const [newDeliveryFormat, setNewDeliveryFormat] = useState<"Physical Artwork" | "On-site Commission">("Physical Artwork");
  const [newLeadTime, setNewLeadTime] = useState("Ready to ship (2-3 days)");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80");

  // Edit Price/Stock Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(1);
  const [editLeadTime, setEditLeadTime] = useState<string>("");

  const sellerProducts = products.filter((p) => p.sellerId === currentUser.id);

  const filteredProducts = sellerProducts.filter((p) => {
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalStockCount = sellerProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalCatalogValue = sellerProducts.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditPrice(p.price);
    setEditStock(p.stock);
    setEditLeadTime(p.leadTime);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      price: Number(editPrice),
      stock: Number(editStock),
      leadTime: editLeadTime
    });

    setEditingProduct(null);
    showToast(
      "Listing Updated",
      `"${editingProduct.title}" stock and price were successfully saved.`,
      "success"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Studio Workbench Header */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#262A30] bg-[#121417] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                Studio Workbench
              </span>
              <span className="text-xs text-[#A59D92] font-semibold uppercase tracking-wider">
                {isHindi ? "शिल्प इन्वेंटरी" : "My Craft Inventory"}
              </span>
            </div>

            {/* Single-Line Artisan Identity Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-white">
                {currentUser.name || "Rohit Sharma"}
              </h1>
              <span className="text-[#756E65] text-lg font-light">•</span>
              <span className="text-sm font-medium text-[#A59D92] self-center">
                {currentUser.city || "Khurja / Delhi NCR"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap shrink-0">
            {/* TinyFish Offline Sync Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-mono border bg-[#1A1D23] border-[#2D323B] text-[#9B948A]">
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#E5A93B] animate-spin" />
                  <span className="text-[#E5A93B]">Syncing {pendingCount}...</span>
                </>
              ) : !isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#9B948A]" />
                  <span className="text-[#9B948A]">Offline ({pendingCount} pending)</span>
                </>
              ) : pendingCount > 0 ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#2D583B]" />
                  <span className="text-white">{pendingCount} local draft(s)</span>
                  <button
                    type="button"
                    onClick={() => flushQueue()}
                    className="ml-1 text-[11px] underline text-[#E5A93B] hover:text-white cursor-pointer"
                  >
                    Sync
                  </button>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B]" />
                  <span className="text-[#2D583B] font-semibold">Sync: Live</span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsImporterOpen(true)}
              className="px-3.5 py-2.5 rounded-sm bg-[#1A1D23] border border-[#2D323B] hover:border-[#C85A32] text-white text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Extract craft listings from Etsy, Instagram, or external URLs via TinyFish Fetch API"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span>Import via TinyFish Fetch</span>
            </button>

            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="px-4 py-2.5 rounded-sm bg-[#1A1D23] border border-[#2D323B] hover:border-[#C85A32] text-white text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#E5A93B]" />
              <span>+ Quick Add Product</span>
            </button>

            <Link
              href="/dashboard/seller/products/new"
              className="px-4 py-2.5 rounded-sm bg-[#B4461F] hover:bg-[#963715] text-white text-xs font-medium transition-colors duration-150 flex items-center gap-2 border border-[#C85A32] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Full Studio Upload</span>
            </Link>
          </div>
        </div>

        {/* Quick Inventory Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#262A30] text-xs">
          <div>
            <span className="text-[#9B948A] text-[10px] uppercase font-semibold">Total Catalog Pieces:</span>
            <p className="font-semibold text-base text-white mt-0.5">{totalStockCount} units</p>
          </div>
          <div>
            <span className="text-[#9B948A] text-[10px] uppercase font-semibold">Catalog Value:</span>
            <p className="font-semibold text-base text-[#E5A93B] mt-0.5">₹{totalCatalogValue.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <span className="text-[#9B948A] text-[10px] uppercase font-semibold">Active Listings:</span>
            <p className="font-semibold text-base text-white mt-0.5">
              {sellerProducts.filter((p) => p.status === "Live").length} Live
            </p>
          </div>
          <div>
            <span className="text-[#9B948A] text-[10px] uppercase font-semibold">Patron Views:</span>
            <p className="font-semibold text-base text-[#2D583B] mt-0.5">
              {currentUser.id === "demo-seller-rohit" ? "1,420" : "0"} visits
            </p>
          </div>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-white rounded-sm p-4 border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7561]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, medium, batch description..."
            className="w-full pl-9 pr-4 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
          />
        </div>

        {/* Filter Pills & View Mode Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
                statusFilter === "ALL"
                  ? "bg-[#1E2229] text-[#FAF7F2]"
                  : "bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816] hover:bg-[#F4EFE6]"
              }`}
            >
              All ({sellerProducts.length})
            </button>
            <button
              onClick={() => setStatusFilter("Live")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
                statusFilter === "Live"
                  ? "bg-[#1E2229] text-[#FAF7F2]"
                  : "bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816] hover:bg-[#F4EFE6]"
              }`}
            >
              Live ({sellerProducts.filter((p) => p.status === "Live").length})
            </button>
          </div>

          <div className="flex items-center gap-1 border-l pl-2 border-[#E8E2D7]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-sm border text-xs font-medium transition-colors duration-150 ${
                viewMode === "grid"
                  ? "bg-[#B4461F] text-white border-[#B4461F]"
                  : "bg-white text-[#635C53] border-[#E8E2D7] hover:bg-[#FAF7F2]"
              }`}
              title="Grid View"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-sm border text-xs font-medium transition-colors duration-150 ${
                viewMode === "table"
                  ? "bg-[#B4461F] text-white border-[#B4461F]"
                  : "bg-white text-[#635C53] border-[#E8E2D7] hover:bg-[#FAF7F2]"
              }`}
              title="Table View"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Display (Grid or Table) */}
      {sellerProducts.length === 0 ? (
        <div className="bg-white rounded-sm border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-[#D3CBBE] mx-auto stroke-1" />
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-[#1E2229]">
              {t("nav.inventory")}
            </h3>
            <p className="text-xs text-[#635C53] leading-relaxed">
              {t("dashboard.emptyInventory")}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="btn-terracotta px-5 py-2.5 rounded-sm text-xs font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t("cta.addNewProduct")}</span>
            </button>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-sm border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-[#D3CBBE] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#1E2229]">
            {isHindi ? "कोई मेल नहीं मिला" : "No Artworks Match Your Filter"}
          </h3>
          <p className="text-xs text-[#635C53]">
            {isHindi ? "फ़िल्टर साफ़ करें या अन्य खोज शब्द आज़माएं।" : "Try clearing search keywords or status filter."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isLive = product.status === "Live";

            // Explicit status badges: Live, Made-to-Order, Out of Stock
            let statusBadge = {
              text: "Live",
              color: "bg-[#2D583B] text-white"
            };
            if (product.stock === 0) {
              statusBadge = {
                text: "Out of Stock",
                color: "bg-red-700 text-white"
              };
            } else if (
              product.deliveryFormat === "On-site Commission" ||
              product.leadTime?.toLowerCase().includes("order") ||
              product.leadTime?.toLowerCase().includes("commission")
            ) {
              statusBadge = {
                text: "Made-to-Order",
                color: "bg-[#C85A32] text-white"
              };
            } else if (!isLive) {
              statusBadge = {
                text: "Draft",
                color: "bg-gray-700 text-white"
              };
            }

            const viewsCount = product.viewsCount || 160 + (product.price % 89);

            return (
              <div
                key={product.id}
                className="bg-white rounded-sm border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group"
              >
                {/* Product Image Cover */}
                <div className="relative aspect-4/3 bg-[#FAF7F2] overflow-hidden">
                  <ProtectedImage
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    wrapperClassName="w-full h-full"
                  />
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${statusBadge.color}`}
                    >
                      {statusBadge.text}
                    </span>
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-medium bg-[#1E2229] text-[#FAF7F2]">
                      {product.deliveryFormat}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 rounded-sm bg-white/95 text-[#1A1816] hover:bg-white shadow-xs border border-[#E8E2D7] transition-colors duration-150"
                      title="Edit price & stock"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#B4461F]" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded-sm bg-white/95 text-[#B4461F] hover:bg-[#FAF0E6] shadow-xs border border-[#F3CFBF] transition-colors duration-150"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                        {product.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {viewsCount} views
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#1E2229] line-clamp-1 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Stock, Lead Time & Price Box */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Stock / Availability</span>
                      <p className="font-bold text-[#1E2229] flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.stock > 0 ? "bg-[#2D583B]" : "bg-red-500"
                          }`}
                        />
                        {product.stock} units ({product.leadTime})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Price (INR)</span>
                      <p className="font-bold text-base text-[#C85A32]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EFECE6] text-xs">
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#C85A32]"
                    >
                      {isLive ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-[#2D583B]" />
                          <span>Visible in Bazaar</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                          <span>Hidden (Draft)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="text-xs font-bold text-[#C85A32] hover:underline"
                    >
                      Adjust Price & Stock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#E8DEC8] text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Artwork Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (₹)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Lead Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const isLive = product.status === "Live";

                  return (
                    <tr key={product.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <ProtectedImage
                            src={product.images[0]}
                            alt={product.title}
                            className="w-10 h-10 rounded-lg object-cover"
                            wrapperClassName="w-10 h-10 rounded-lg border shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#1E2229] truncate max-w-xs">{product.title}</p>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{product.category}</td>
                      <td className="py-3.5 px-4 font-bold text-[#C85A32]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1E2229]">{product.stock} units</td>
                      <td className="py-3.5 px-4 text-gray-500">{product.leadTime}</td>
                      <td className="py-3.5 px-4">
                        {(() => {
                          let badgeText = "Live";
                          let badgeStyle = "bg-[#EEF4F0] text-[#2D583B] border-[#C5DCCB]";
                          if (product.stock === 0) {
                            badgeText = "Out of Stock";
                            badgeStyle = "bg-red-50 text-red-700 border-red-200";
                          } else if (
                            product.deliveryFormat === "On-site Commission" ||
                            product.leadTime?.toLowerCase().includes("order")
                          ) {
                            badgeText = "Made-to-Order";
                            badgeStyle = "bg-[#FAF5EC] text-[#C85A32] border-[#E8DEC8]";
                          } else if (!isLive) {
                            badgeText = "Draft";
                            badgeStyle = "bg-gray-100 text-gray-600 border-gray-200";
                          }

                          return (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}
                            >
                              {badgeText}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleProductStatus(product.id)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-600"
                            title="Toggle Live / Draft"
                          >
                            {isLive ? <ToggleRight className="w-4 h-4 text-[#2D583B]" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-600"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1 rounded hover:bg-gray-100 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Price & Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 border border-[#E8E2D7] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                  Studio Inventory
                </p>
                <h3 className="font-serif font-bold text-base text-[#1E2229] mt-0.5">
                  Adjust Listing & Pricing
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#8A7561] hover:text-[#1E2229]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  disabled
                  value={editingProduct.title}
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FAF7F2] text-[#635C53]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Lead Time / Creation Estimate *
                </label>
                <input
                  type="text"
                  required
                  value={editLeadTime}
                  onChange={(e) => setEditLeadTime(e.target.value)}
                  placeholder="e.g. Ready to ship, or Made to order: 5 days"
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn-craft-secondary px-4 py-2 rounded-sm text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-terracotta px-5 py-2 rounded-sm text-xs font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instant Add New Product Drawer / Modal */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 border border-[#E8E2D7] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                  Quick Studio Listing
                </p>
                <h3 className="font-serif font-bold text-lg text-[#1E2229] mt-0.5">
                  Add New Craft Piece
                </h3>
              </div>
              <button
                onClick={() => setIsAddDrawerOpen(false)}
                className="p-1 text-[#8A7561] hover:text-[#1E2229]"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProduct({
                  title: newTitle || "Studio Terracotta Artwork",
                  category: newCategory,
                  price: Number(newPrice),
                  stock: Number(newStock),
                  deliveryFormat: newDeliveryFormat,
                  leadTime: newLeadTime,
                  description: newDescription || "Handmade authentic craft piece direct from artist studio.",
                  images: [newImage],
                  sellerId: currentUser.id,
                  sellerName: currentUser.name,
                  sellerCity: currentUser.city || "Khurja / Delhi NCR",
                  sellerAvatar: currentUser.avatarUrl,
                  status: "Live"
                });
                setIsAddDrawerOpen(false);
                setNewTitle("");
                setNewDescription("");
                showToast(
                  "Product Published!",
                  `"${newTitle || "New Artwork"}" is now live in the Bazaar.`,
                  "info"
                );
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hand-carved Glazed Teracotta Urn"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Craft Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Product["category"])}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  >
                    <option value="Terracotta & Pottery">Terracotta & Pottery</option>
                    <option value="Madhubani Folk Art">Madhubani Folk Art</option>
                    <option value="Mural Design">Mural Design</option>
                    <option value="Bridal Mehndi">Bridal Mehndi</option>
                    <option value="Woodwork & Stone">Woodwork & Stone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Delivery Format
                  </label>
                  <select
                    value={newDeliveryFormat}
                    onChange={(e) => setNewDeliveryFormat(e.target.value as "Physical Artwork" | "On-site Commission")}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  >
                    <option value="Physical Artwork">Physical Artwork</option>
                    <option value="On-site Commission">On-site Commission</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Lead Time / Readiness *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadTime}
                  onChange={(e) => setNewLeadTime(e.target.value)}
                  placeholder="e.g. Ready to ship (2-3 days), or Made-to-Order (7 days)"
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Artwork Photo URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                  />
                  <img
                    src={newImage}
                    alt="Preview"
                    className="w-9 h-9 rounded-xs object-cover border border-[#E8E2D7] shrink-0"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-[#8A7561]">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setNewImage("https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80")}
                    className="text-[10px] text-[#B4461F] hover:underline"
                  >
                    Vase
                  </button>
                  <span className="text-[#D3CBBE]">•</span>
                  <button
                    type="button"
                    onClick={() => setNewImage("https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80")}
                    className="text-[10px] text-[#B4461F] hover:underline"
                  >
                    Ceramic Bowl
                  </button>
                  <span className="text-[#D3CBBE]">•</span>
                  <button
                    type="button"
                    onClick={() => setNewImage("https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&auto=format&fit=crop&q=80")}
                    className="text-[10px] text-[#B4461F] hover:underline"
                  >
                    Hand-painted Plate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Craft techniques, materials used, dimensions..."
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="btn-craft-secondary px-4 py-2 rounded-sm text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-terracotta px-5 py-2 rounded-sm text-xs font-medium"
                >
                  Publish to Bazaar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TinyFish Fetch External Product Importer Modal */}
      <ExternalProductImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
      />
    </div>
  );
}
