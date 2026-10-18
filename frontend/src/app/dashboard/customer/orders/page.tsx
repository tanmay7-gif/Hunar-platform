"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { CustomerInquiry } from "@/lib/data";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function CustomerOrdersPage() {
  const { currentUser, inquiries, language } = useHunar();
  const isHindi = language === "hi";

  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  // Strict user isolation: Inquiries placed strictly by this authenticated patron
  const customerOrders = inquiries.filter(
    (inq) =>
      inq.customerId === currentUser.id ||
      (currentUser.email &&
        inq.customerEmail &&
        inq.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const filteredOrders = customerOrders.filter((order) => {
    if (statusFilter === "ACTIVE") return order.status === "Under Review" || order.status === "Crafting in Progress";
    if (statusFilter === "COMPLETED") return order.status === "Dispatched" || order.status === "Completed";
    return true;
  });

  const getStatusStage = (status: CustomerInquiry["status"]) => {
    switch (status) {
      case "Under Review":
        return {
          step: 1,
          label: isHindi ? "बोली / समीक्षा जारी" : "Quote Received & Under Review",
          color: "text-[#8A7561] bg-[#FAF6ED] border-[#E8DEC8]"
        };
      case "Crafting in Progress":
        return {
          step: 2,
          label: isHindi ? "स्टूडियो में निर्माण जारी" : "Crafting & Clay Work in Progress",
          color: "text-[#B4461F] bg-[#FBF0EB] border-[#F3CFBF]"
        };
      case "Dispatched":
        return {
          step: 3,
          label: isHindi ? "सुरक्षित रूप से प्रेषित" : "Ready for Pickup / Dispatched",
          color: "text-[#2D583B] bg-[#EEF4F0] border-[#C5DCCB]"
        };
      case "Completed":
        return {
          step: 4,
          label: isHindi ? "सफलतापूर्वक प्राप्त" : "Delivered & Complete",
          color: "text-[#1E2229] bg-[#FAF5EC] border-[#DACABA]"
        };
      default:
        return {
          step: 1,
          label: status,
          color: "text-[#635C53] bg-[#F5F2EB] border-[#E8E2D7]"
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#E8DEC8] bg-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                Live Commission Tracker
              </span>
              <span className="text-xs text-[#635C53] font-medium">• Real-Time Artisan Updates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]">
              {isHindi ? "मेरे ऑर्डर एवं कस्टम कमीशन" : "My Orders & Custom Commission Bids"}
            </h1>
            <p className="text-xs sm:text-sm text-[#635C53] max-w-2xl">
              {isHindi
                ? "कारीगर से सीधे जुड़े रहें। मिट्टी की तैयारी से लेकर अंतिम पैकेजिंग और शिपिंग तक हर चरण पर नज़र रखें।"
                : "Track every milestone of your bespoke handcrafted commissions. Transparent timeline from raw clay or pigment preparation to safe dispatch."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/customer/post-gig"
              className="px-4 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150 flex items-center gap-1.5"
            >
              <span>+ New Custom Request</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DEC8] pb-3">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            statusFilter === "ALL"
              ? "bg-[#2D583B] text-white"
              : "bg-white text-[#635C53] border border-[#D3CBBE] hover:bg-[#FAF7F2]"
          }`}
        >
          All Commissions ({customerOrders.length})
        </button>
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            statusFilter === "ACTIVE"
              ? "bg-[#2D583B] text-white"
              : "bg-white text-[#635C53] border border-[#D3CBBE] hover:bg-[#FAF7F2]"
          }`}
        >
          In Progress ({customerOrders.filter((o) => o.status === "Under Review" || o.status === "Crafting in Progress").length})
        </button>
        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            statusFilter === "COMPLETED"
              ? "bg-[#2D583B] text-white"
              : "bg-white text-[#635C53] border border-[#D3CBBE] hover:bg-[#FAF7F2]"
          }`}
        >
          Dispatched & Done ({customerOrders.filter((o) => o.status === "Dispatched" || o.status === "Completed").length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const stageInfo = getStatusStage(order.status);
          const whatsappUrl = `https://wa.me/919811876543?text=${encodeURIComponent(
            `Namaste ${order.sellerName}, I am following up regarding commission order "${order.productTitle || "Custom Brief"}" (Inquiry ID: ${order.id}) on Hunar.`
          )}`;

          return (
            <div
              key={order.id}
              className="bg-white rounded-sm border border-[#E8DEC8] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-150 space-y-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8DEC8]">
                <div className="flex items-center gap-3.5">
                  {order.productImage ? (
                    <img
                      src={order.productImage}
                      alt={order.productTitle || "Order"}
                      className="w-14 h-14 rounded-sm object-cover border border-[#E8DEC8] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-sm bg-[#FAF5EC] border border-[#E8DEC8] flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-[#B4461F]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#635C53] uppercase">
                        ID: {order.id}
                      </span>
                      <span className="text-[#635C53]">•</span>
                      <span className="text-xs text-[#635C53] font-medium">{order.createdAt}</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#1E2229]">
                      {order.productTitle || "Custom Artisan Commission"}
                    </h3>
                    <p className="text-xs text-[#635C53]">
                      Artisan: <span className="font-semibold text-[#1E2229]">{order.sellerName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-xs text-xs font-semibold border ${stageInfo.color}`}
                  >
                    {stageInfo.label}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-sm bg-[#2D583B] text-white hover:bg-[#23452E] transition-colors duration-150"
                    title="Direct WhatsApp Chat with Artisan"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Requirements & Budget Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs bg-[#FAF8F5] p-5 sm:p-6 rounded-sm border border-[#E8DEC8]">
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase font-semibold text-[#8A7561]">Design Brief & Requirements:</span>
                  <p className="text-[#1A1816] mt-1 leading-relaxed font-normal">
                    {order.requirements}
                  </p>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8A7561]">Agreed Payout / Budget:</span>
                    <p className="font-bold text-sm text-[#1E2229]">₹{order.proposedBudget.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8A7561]">Timeline:</span>
                    <p className="text-[#635C53]">{order.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Visual 3-Stage Progress Timeline */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#635C53] mb-2">
                  <span className={stageInfo.step >= 1 ? "text-[#1E2229]" : ""}>
                    1. Quote Received
                  </span>
                  <span className={stageInfo.step >= 2 ? "text-[#B4461F]" : ""}>
                    2. Under Creation
                  </span>
                  <span className={stageInfo.step >= 3 ? "text-[#2D583B]" : ""}>
                    3. Ready for Dispatch
                  </span>
                </div>
                <div className="w-full h-2 rounded-xs bg-[#E8DEC8] overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-150 ${
                      stageInfo.step === 1
                        ? "w-1/3 bg-[#8A7561]"
                        : stageInfo.step === 2
                        ? "w-2/3 bg-[#B4461F]"
                        : "w-full bg-[#2D583B]"
                    }`}
                  />
                </div>
              </div>

              {/* Milestone Notes Feed */}
              {order.statusUpdates && order.statusUpdates.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E8DEC8]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561]">
                    Artisan Status Log:
                  </span>
                  <div className="space-y-1.5">
                    {order.statusUpdates.map((update, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#635C53]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D583B] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#1E2229]">{update.timestamp}:</strong> {update.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-sm border border-[#E8DEC8] p-8 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1E2229]">No Orders in this View</h3>
            <p className="text-xs text-[#635C53] max-w-md mx-auto">
              You haven&apos;t commissioned any custom artwork yet. Browse the craft bazaar or post a custom brief to connect with regional masters.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard/customer"
                className="px-4 py-2 rounded-sm bg-[#2D583B] text-white text-xs font-medium hover:bg-[#23452E] transition-colors duration-150"
              >
                Explore Bazaar
              </Link>
              <Link
                href="/dashboard/customer/post-gig"
                className="px-4 py-2 rounded-sm border border-[#D3CBBE] text-[#1E2229] text-xs font-medium hover:bg-[#FAF7F2] transition-colors duration-150"
              >
                Post a Requirement
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
