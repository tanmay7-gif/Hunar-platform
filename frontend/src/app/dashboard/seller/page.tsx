"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { Product, CustomerInquiry } from "@/lib/data";
import {
  Package,
  PlusCircle,
  TrendingUp,
  Eye,
  MessageCircle,
  MessageSquare,
  Phone,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  DollarSign,
  ArrowRight,
  FolderOpen,
  Filter,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Video
} from "lucide-react";
import { MentorshipManager } from "@/components/seller/MentorshipManager";
import { MarketIntelligenceBar } from "@/components/tinyfish/MarketIntelligenceBar";
import { ExternalProductImporterModal } from "@/components/tinyfish/ExternalProductImporterModal";
import { AutonomousOpportunityAgentModal } from "@/components/tinyfish/AutonomousOpportunityAgentModal";
import { CloudBrowserViewerModal } from "@/components/tinyfish/CloudBrowserViewerModal";
import {
  Globe,
  Bot,
  Monitor,
  FileText
} from "lucide-react";

export default function SellerStudioDashboard() {
  const router = useRouter();
  const {
    language,
    currentUser,
    switchDemoRole,
    products,
    inquiries,
    mentorshipBookings,
    deleteProduct,
    toggleProductStatus,
    updateInquiryStatus,
    sellerTotalEarnings,
    startOrGetConversation,
    showToast
  } = useHunar();

  const isHindi = language === "hi";

  // Filter or tab state
  const [activeTab, setActiveTab] = useState<"catalog" | "inbox" | "mentorship" | "intelligence">("catalog");
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isCloudBrowserOpen, setIsCloudBrowserOpen] = useState(false);
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<CustomerInquiry["status"]>("Crafting in Progress");
  const [statusNote, setStatusNote] = useState("");

  // Strict user isolation: Filter products strictly belonging to this authenticated artisan
  const sellerProducts = products.filter((p) => p.sellerId === currentUser.id);

  // Inquiries strictly addressed to this authenticated artisan
  const sellerInquiries = inquiries.filter((inq) => inq.sellerId === currentUser.id);

  // Mentorship Bookings addressed to this artisan
  const sellerMentorshipBookings = mentorshipBookings.filter(
    (b) =>
      b.mentorId === currentUser.id ||
      b.mentorId === "demo-seller-rohit" ||
      (currentUser.username && b.mentorId === "creator-rohit")
  );

  // Studio Metrics Overview Calculation
  const totalCatalogValue = sellerProducts.reduce((acc, p) => acc + p.price * p.stock, 0);
  const activeListingsCount = sellerProducts.filter((p) => p.status === "Live").length;
  const totalInquiriesCount = sellerInquiries.length;
  const simulatedViewsCount = currentUser.id === "demo-seller-rohit" ? 1420 : 0;

  const handleStatusUpdate = (inquiryId: string) => {
    updateInquiryStatus(inquiryId, newStatus, statusNote || `Status updated to ${newStatus}`);
    setEditingInquiryId(null);
    setStatusNote("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Studio Top Banner & Quick Actions */}
      <div className="rounded-sm bg-[#1E2229] text-[#FAF7F2] p-6 sm:p-8 border border-[#2C323D] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-20 h-20 rounded-sm object-cover aspect-square border border-[#3E4756] shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                {isHindi ? "कारीगर स्टूडियो (SELLER WORKSPACE)" : "ARTISAN STUDIO WORKSPACE"}
              </span>
              <span className="text-xs text-[#E5A93B] font-mono">
                {currentUser.city}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2] tracking-tight">
              {currentUser.name} {isHindi ? "का शिल्प स्टूडियो" : "'s Craft Studio"}
            </h1>
            <p className="text-xs text-[#FAF7F2]/80 mt-1.5 leading-relaxed">
              {currentUser.tagline || (isHindi ? "मास्टर सेरेमिक एवं टेराकोटा शिल्पकार" : "Master Ceramicist & Terracotta Sculptor")} • {currentUser.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/seller/products"
            className="px-4 py-2.5 rounded-sm bg-[#2A313D] border border-[#3E4756] text-xs font-medium text-[#FAF7F2] hover:bg-[#343C4B] transition-colors duration-150 flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-[#B4461F]" />
            <span>Manage Inventory</span>
          </Link>

          <Link
            href="/dashboard/seller/products/new"
            className="btn-terracotta px-5 py-2.5 rounded-sm text-xs font-medium flex items-center gap-2 transition-colors duration-150"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isHindi ? "नई कलाकृति जोड़ें" : "Upload New Artwork"}</span>
          </Link>
        </div>
      </div>

      {/* Studio Metrics Overview (At A Glance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-sm bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-[#8A7561] font-semibold uppercase tracking-wider mb-3">
            <span>{isHindi ? "कुल कैटलॉग मूल्य" : "Total Catalog Value"}</span>
            <DollarSign className="w-4 h-4 text-[#B4461F]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
            ₹{totalCatalogValue.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#2D583B] font-medium mt-2">
            {sellerProducts.length} {isHindi ? "कुल कलाकृतियां" : "total inventory items"}
          </p>
        </div>

        <div className="p-6 rounded-sm bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-[#8A7561] font-semibold uppercase tracking-wider mb-3">
            <span>{isHindi ? "सक्रिय लाइव लिस्टिंग" : "Active Live Listings"}</span>
            <Package className="w-4 h-4 text-[#2D583B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#2D583B]">
            {activeListingsCount}
          </p>
          <p className="text-[11px] text-[#635C53] mt-2">
            {sellerProducts.filter((p) => p.status === "Draft").length} {isHindi ? "ड्राफ्ट में" : "in draft state"}
          </p>
        </div>

        <div className="p-6 rounded-sm bg-white border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-[#8A7561] font-semibold uppercase tracking-wider mb-3">
            <span>{isHindi ? "प्राप्त पूछताछ / कमीशन" : "Received Inquiries"}</span>
            <MessageCircle className="w-4 h-4 text-[#B4461F]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#B4461F]">
            {totalInquiriesCount}
          </p>
          <p className="text-[11px] text-[#635C53] mt-2">
            {sellerInquiries.filter((inq) => inq.status === "Under Review").length} {isHindi ? "समीक्षा हेतु लंबित" : "pending review"}
          </p>
        </div>

        <div className="p-6 rounded-sm bg-white border border-[#E8DEC8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-[#8A7561] font-semibold uppercase tracking-wider mb-3">
            <span>{isHindi ? "पुष्टीकृत स्टूडियो आय" : "Studio Confirmed Earnings"}</span>
            <DollarSign className="w-4 h-4 text-[#2D583B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#2D583B]">
            ₹{sellerTotalEarnings.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#2D583B]" />
            <span className="text-[11px] text-[#2D583B] font-semibold">
              Order Paid / In Production
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs Bar */}
      <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
              activeTab === "catalog"
                ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
                : "border-transparent text-[#635C53] hover:text-[#1E2229]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isHindi ? "लाइव इन्वेंटरी एवं उत्पाद" : "Live Studio Inventory"}</span>
            <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#E8E2D7] text-[#1E2229]">
              {sellerProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
              activeTab === "inbox"
                ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
                : "border-transparent text-[#635C53] hover:text-[#1E2229]"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isHindi ? "कमीशन इनबॉक्स" : "Inquiry & Commission Inbox"}</span>
            {sellerInquiries.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#B4461F] text-white">
                {sellerInquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("mentorship")}
            className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
              activeTab === "mentorship"
                ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
                : "border-transparent text-[#635C53] hover:text-[#1E2229]"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isHindi ? "१-ऑन-१ मेंटरशिप" : "Mentorship & 1-on-1 Guidance"}</span>
            {sellerMentorshipBookings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#2D583B] text-white">
                {sellerMentorshipBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("intelligence")}
            className={`px-4 py-2 rounded-sm text-xs font-medium transition-colors duration-150 flex items-center gap-2 border-b-2 ${
              activeTab === "intelligence"
                ? "border-[#B4461F] text-[#B4461F] bg-[#FAF7F2]"
                : "border-transparent text-[#635C53] hover:text-[#1E2229]"
            }`}
          >
            <Globe className="w-4 h-4 text-[#E5A93B]" />
            <span>{isHindi ? "वेब इंटेलिजेंस एवं एजेंट्स" : "TinyFish Web Intelligence"}</span>
            <span className="px-1.5 py-0.2 rounded-xs text-[10px] bg-[#B4461F] text-white">
              4 APIs
            </span>
          </button>
        </div>

        <Link
          href="/dashboard/seller/products/new"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#B4461F] hover:text-[#8E3211] transition-colors duration-150"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isHindi ? "+ नया उत्पाद" : "+ Add Product"}</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LIVE INVENTORY TABLE & ACTIONS                     */}
      {/* ========================================================= */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="rounded-sm bg-white border border-[#E8E2D7] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="p-6 border-b border-[#E8E2D7] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                  {isHindi ? "स्टूडियो कैटलॉग" : "Studio Inventory"}
                </h3>
              </div>

              <Link
                href="/dashboard/seller/products/new"
                className="btn-terracotta px-4 py-2 rounded-sm text-xs font-medium self-start sm:self-auto flex items-center gap-2 transition-colors duration-150"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isHindi ? "नया उत्पाद जोड़ें" : "Add Product"}</span>
              </Link>
            </div>

              {sellerProducts.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <FolderOpen className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="font-bold text-sm text-[#1E2229]">
                    {isHindi ? "कैटलॉग में कोई कलाकृति नहीं है" : "No Artworks Listed in Studio"}
                  </p>
                  <Link
                    href="/dashboard/seller/products/new"
                    className="inline-block px-4 py-2 rounded-xl bg-[#C85A32] text-white text-xs font-bold"
                  >
                    Upload First Artwork
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF6ED] text-gray-500 uppercase tracking-wider font-bold border-b border-[#E8DEC8] text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Artwork Item</th>
                        <th className="py-3 px-4">Craft Category</th>
                        <th className="py-3 px-4">Price (₹)</th>
                        <th className="py-3 px-4">Stock & Lead Time</th>
                        <th className="py-3 px-4">Visibility</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D7]">
                      {sellerProducts.map((product) => {
                        const isLive = product.status === "Live";

                        return (
                          <tr key={product.id} className="hover:bg-[#FAF7F2] transition-colors duration-150">
                            {/* Artwork item info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-12 h-12 rounded-sm object-cover border border-[#E8E2D7] shrink-0"
                                />
                                <div>
                                  <h4 className="font-semibold text-[#1A1816] line-clamp-1">
                                    {product.title}
                                  </h4>
                                  <p className="text-[11px] text-[#635C53] font-mono">
                                    ID: {product.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF] whitespace-nowrap">
                                {product.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#1E2229]">
                              ₹{product.price.toLocaleString("en-IN")}
                            </td>

                            {/* Stock & Lead time */}
                            <td className="py-3.5 px-4 space-y-0.5">
                              <p className="font-medium text-[#2D583B]">
                                {product.stock} units in stock
                              </p>
                              <p className="text-[11px] text-[#635C53]">{product.leadTime}</p>
                            </td>

                            {/* Visibility Badge */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => toggleProductStatus(product.id)}
                                className={`px-2.5 py-1 rounded-xs text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150 flex items-center gap-1.5 ${
                                  isLive
                                    ? "bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB]"
                                    : "bg-gray-100 text-[#635C53] border border-gray-300"
                                }`}
                                title="Click to toggle status"
                              >
                                <span className={`w-1.5 h-1.5 rounded-xs ${isLive ? "bg-[#2D583B]" : "bg-gray-400"}`} />
                                <span>{product.status}</span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => toggleProductStatus(product.id)}
                                  className="p-1.5 rounded-sm border border-[#E8E2D7] text-[#635C53] hover:text-[#1A1816] hover:bg-[#FAF7F2] transition-colors duration-150"
                                  title={isLive ? "Set to Draft" : "Publish to Live"}
                                >
                                  {isLive ? <ToggleRight className="w-4 h-4 text-[#2D583B]" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                                </button>

                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="p-1.5 rounded-sm border border-[#F3CFBF] text-[#B4461F] hover:bg-[#FAF0E6] transition-colors duration-150"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INQUIRY INBOX                                      */}
        {/* ========================================================= */}
        {activeTab === "inbox" && (
          <div className="space-y-4">
            <div className="border-b border-[#E8E2D7] pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                  {isHindi ? "ग्राहक कमीशन अनुरोध" : "Commission Requests"}
                </h3>
              </div>

              <span className="px-3 py-1 rounded-xs text-xs font-semibold bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]">
                {sellerInquiries.length} {isHindi ? "प्राप्त अनुरोध" : "Requests Received"}
              </span>
            </div>

            {sellerInquiries.length === 0 ? (
              <div className="rounded-sm bg-white border border-[#E8E2D7] p-12 text-center space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <MessageCircle className="w-10 h-10 text-[#D3CBBE] mx-auto" />
                <h4 className="font-serif font-bold text-base text-[#1E2229]">
                  {isHindi ? "कोई नई पूछताछ नहीं है" : "No Pending Inquiries"}
                </h4>
                <p className="text-xs text-[#635C53]">
                  {isHindi
                    ? "जब कला संरक्षक आपकी कलाकृतियों पर पूछताछ करेंगे, वे यहां दिखाई देंगी।"
                    : "Client requests submitted from the Customer Dashboard will populate here."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerInquiries.map((inq) => {
                  const isEditing = editingInquiryId === inq.id;

                  return (
                    <div
                      key={inq.id}
                      className="rounded-sm bg-white border border-[#E8E2D7] p-6 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D7] pb-5">
                        <div className="flex items-center gap-4">
                          {inq.productImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={inq.productImage}
                              alt={inq.productTitle || "Custom"}
                              className="w-14 h-14 rounded-sm object-cover border border-[#E8E2D7]"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-serif font-bold text-base text-[#1E2229]">
                                {inq.productTitle || "Bespoke Custom Commission"}
                              </h4>
                              <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]">
                                {inq.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#635C53]">
                              From: <span className="font-semibold text-[#1A1816]">{inq.customerName}</span> ({inq.customerEmail})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Direct Contact Buttons */}
                          <button
                            type="button"
                            onClick={() => {
                              const conv = startOrGetConversation({
                                sellerId: currentUser.id,
                                productId: inq.productId,
                                initialMessage: `Namaste ${inq.customerName}, this is ${currentUser.name}. I received your commission request for "${inq.productTitle || "Custom Art"}" (Proposed Budget: ₹${inq.proposedBudget}). Let's discuss details and timelines.`
                              });
                              router.push(`/dashboard/chat/${conv.id}`);
                            }}
                            className="btn-terracotta px-3.5 py-2 rounded-sm text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>In-App Chat</span>
                          </button>

                          <a
                            href={`tel:${inq.customerPhone}`}
                            className="btn-craft-secondary px-3.5 py-2 rounded-sm text-xs font-medium flex items-center gap-1.5 transition-colors duration-150"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#B4461F]" />
                            <span>{inq.customerPhone}</span>
                          </a>
                        </div>
                      </div>

                      {/* Brief Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#FAF7F2] p-5 rounded-sm border border-[#E8E2D7] text-xs">
                        <div className="sm:col-span-2 space-y-1">
                          <p className="font-semibold uppercase tracking-wider text-[#8A7561] text-[10px]">
                            Customer Specifications & Brief:
                          </p>
                          <p className="text-[#1A1816] leading-relaxed">{inq.requirements}</p>
                          <p className="text-[#635C53] mt-1">Requested Delivery: {inq.timeline}</p>
                        </div>

                        <div>
                          <p className="font-semibold uppercase tracking-wider text-[#8A7561] text-[10px]">
                            Offered Budget:
                          </p>
                          <p className="font-serif font-bold text-xl text-[#B4461F] mt-0.5">
                            ₹{inq.proposedBudget.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[11px] text-[#2D583B] font-medium mt-1">
                            100% Direct Payout
                          </p>
                        </div>
                      </div>

                      {/* Status Updater Row */}
                      <div className="pt-2 border-t border-[#E8E2D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {!isEditing ? (
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#635C53]">Current Status:</span>
                            <span className="font-semibold text-xs text-[#B4461F]">{inq.status}</span>
                            <button
                              onClick={() => {
                                setEditingInquiryId(inq.id);
                                setNewStatus(inq.status);
                              }}
                              className="px-3 py-1 rounded-sm border border-[#E8E2D7] text-xs font-medium text-[#1A1816] hover:bg-[#FAF7F2] transition-colors duration-150 flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3 text-[#B4461F]" />
                              <span>Update Status</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value as CustomerInquiry["status"])}
                              className="px-3 py-1.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs font-semibold text-[#1A1816]"
                            >
                              <option value="Under Review">Under Review</option>
                              <option value="Crafting in Progress">Crafting in Progress</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Completed">Completed</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Optional status note (e.g. 'Glaze fired; packaging today')..."
                              value={statusNote}
                              onChange={(e) => setStatusNote(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-sm bg-[#FDFCF9] border border-[#D3CBBE] text-xs text-[#1A1816]"
                            />

                            <button
                              onClick={() => handleStatusUpdate(inq.id)}
                              className="btn-terracotta px-3.5 py-1.5 rounded-sm text-xs font-medium"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingInquiryId(null)}
                              className="px-2.5 py-1.5 text-xs text-[#635C53] hover:text-[#1A1816]"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <span className="text-[11px] text-[#635C53] self-end sm:self-auto">
                          Received {inq.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      {/* ========================================================= */}
      {/* TAB 3: MENTORSHIP SETTINGS & BOOKINGS                     */}
      {/* ========================================================= */}
      {activeTab === "mentorship" && (
        <MentorshipManager isHindi={isHindi} />
      )}

      {/* ========================================================= */}
      {/* TAB 4: TINYFISH WEB INTELLIGENCE & AGENTS                 */}
      {/* ========================================================= */}
      {activeTab === "intelligence" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-sm bg-[#1E2229] border border-[#2C323D] text-[#FAF7F2] shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                Live AI Web Connectivity
              </span>
              <span className="text-xs text-[#E5A93B] font-mono">
                Official TinyFish Infrastructure
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2]">
              {isHindi ? "वेब इंटेलिजेंस" : "Web Intelligence & Automation"}
            </h2>
          </div>

          {/* Capability 1: Search API (Live Market Intelligence) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E5A93B]" />
              <span>1. Search API: Live Web Intelligence & Spot Rates</span>
            </div>
            <MarketIntelligenceBar />
          </div>

          {/* Capabilities 2, 3, 4: Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capability 2: Fetch API */}
            <div className="p-6 bg-white border border-[#E8E2D7] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#B4461F]/10 border border-[#B4461F]/30 flex items-center justify-center text-[#B4461F]">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4461F]">
                    Fetch API
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                    JSON & Markdown
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E2229]">
                  External Catalog Importer
                </h3>
                <p className="text-xs text-[#635C53] leading-relaxed">
                  Extract clean markdown, craft techniques, pricing, and high-res imagery directly from Etsy, Instagram, or artisan portfolio blogs into your Hunar catalog.
                </p>
              </div>
              <button
                onClick={() => setIsImporterOpen(true)}
                className="w-full py-2.5 bg-[#B4461F] hover:bg-[#963816] text-white text-xs font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93B]" />
                <span>Launch URL Importer</span>
              </button>
            </div>

            {/* Capability 3: Web Agent */}
            <div className="p-6 bg-white border border-[#E8E2D7] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#2D583B]/10 border border-[#2D583B]/30 flex items-center justify-center text-[#2D583B]">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D583B]">
                    Web Agent
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                    Autonomous Multi-Step
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E2229]">
                  Autonomous Grant & Fair Scout
                </h3>
                <p className="text-xs text-[#635C53] leading-relaxed">
                  Autonomous AI agent navigates official directories (handicrafts.nic.in, Dastkar, TRIFED), evaluates eligibility requirements, and synthesizes bespoke application strategies.
                </p>
              </div>
              <button
                onClick={() => setIsAgentOpen(true)}
                className="w-full py-2.5 bg-[#2D583B] hover:bg-[#23452e] text-white text-xs font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-[#81C784]" />
                <span>Deploy Scout Agent</span>
              </button>
            </div>

            {/* Capability 4: Browser Infrastructure */}
            <div className="p-6 bg-white border border-[#E8E2D7] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#1E2229]/10 border border-[#1E2229]/30 flex items-center justify-center text-[#1E2229]">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E2229]">
                    Cloud Browser
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                    Playwright / CDP
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E2229]">
                  Remote Verification Sandbox
                </h3>
                <p className="text-xs text-[#635C53] leading-relaxed">
                  Connects to TinyFish cloud browser sessions to inspect live pages, verify GI tag licenses, and audit external sources without requiring local browser drivers.
                </p>
              </div>
              <button
                onClick={() => setIsCloudBrowserOpen(true)}
                className="w-full py-2.5 bg-[#1E2229] hover:bg-[#2A313D] text-[#FAF7F2] text-xs font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5 text-[#E5A93B]" />
                <span>Launch Cloud Sandbox</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TinyFish Modals */}
      <ExternalProductImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
      />
      <AutonomousOpportunityAgentModal
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
      />
      <CloudBrowserViewerModal
        isOpen={isCloudBrowserOpen}
        onClose={() => setIsCloudBrowserOpen(false)}
      />
    </div>
  );
}
