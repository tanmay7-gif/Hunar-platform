"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHunar } from "@/context/HunarContext";
import { CustomerInquiry } from "@/lib/data";
import {
  Inbox,
  MessageCircle,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  Calendar,
  AlertCircle,
  ArrowRight,
  Filter,
  Check,
  Send,
  UserCheck,
  Package
} from "lucide-react";

export default function SellerInquiriesPage() {
  const router = useRouter();
  const {
    inquiries,
    currentUser,
    language,
    updateInquiryStatus,
    startOrGetConversation,
    showToast
  } = useHunar();

  const isHindi = language === "hi";

  // Filter & Active tab
  const [stageFilter, setStageFilter] = useState<"ALL" | "PENDING" | "CRAFTING" | "DISPATCHED">("ALL");

  // Inline Status Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CustomerInquiry["status"]>("Crafting in Progress");
  const [statusNote, setStatusNote] = useState("");

  // Strict user isolation: Inquiries addressed strictly to this authenticated artisan
  const sellerInquiries = inquiries.filter((inq) => inq.sellerId === currentUser.id);

  const filteredInquiries = sellerInquiries.filter((inq) => {
    if (stageFilter === "PENDING") return inq.status === "Under Review";
    if (stageFilter === "CRAFTING") return inq.status === "Crafting in Progress";
    if (stageFilter === "DISPATCHED") return inq.status === "Dispatched" || inq.status === "Completed";
    return true;
  });

  const handleUpdateStatus = (inquiryId: string) => {
    updateInquiryStatus(inquiryId, selectedStatus, statusNote || `Status updated to ${selectedStatus}`);
    setEditingId(null);
    setStatusNote("");
    showToast(
      "Client Lead Progressed",
      `Commission stage successfully updated to "${selectedStatus}".`,
      "success"
    );
  };

  const getStageBadge = (status: CustomerInquiry["status"]) => {
    switch (status) {
      case "Under Review":
        return {
          label: "Quote Received (Under Review)",
          class: "bg-[#FEF7E6] text-[#9E6B0E] border-[#F6DFA3]"
        };
      case "Crafting in Progress":
        return {
          label: "Crafting in Progress",
          class: "bg-[#FBF0EB] text-[#A33F1C] border-[#F3CFBF]"
        };
      case "Dispatched":
        return {
          label: "Dispatched & In Transit",
          class: "bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border-[#00E676]/40 font-semibold"
        };
      case "Completed":
        return {
          label: "Completed",
          class: "bg-[#00E676]/15 text-[#00C853] dark:text-[#00E676] border-[#00E676]/40 font-semibold"
        };
      default:
        return {
          label: status,
          class: "bg-gray-100 text-gray-700 border-gray-200"
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#2C323D] bg-[#1E2229] text-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                Studio CRM & Leads
              </span>
              <span className="text-xs text-[#E5A93B] font-mono">Direct Patron Boli & Briefs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
              {isHindi ? "ग्राहक लीड्स" : "Client Leads"}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-sm bg-[#2A313D] border border-[#3E4756] text-xs text-center">
              <span className="text-[#8A7561] block text-[10px] uppercase font-semibold">Pending Reviews:</span>
              <span className="text-base font-bold text-[#E5A93B]">
                {sellerInquiries.filter((i) => i.status === "Under Review").length} briefs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D7] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setStageFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            stageFilter === "ALL"
              ? "bg-[#1E2229] text-[#FAF7F2]"
              : "bg-white text-[#635C53] border border-[#E8E2D7] hover:bg-[#FAF7F2]"
          }`}
        >
          All Leads ({sellerInquiries.length})
        </button>
        <button
          onClick={() => setStageFilter("PENDING")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            stageFilter === "PENDING"
              ? "bg-[#1E2229] text-[#FAF7F2]"
              : "bg-white text-[#635C53] border border-[#E8E2D7] hover:bg-[#FAF7F2]"
          }`}
        >
          Under Review ({sellerInquiries.filter((i) => i.status === "Under Review").length})
        </button>
        <button
          onClick={() => setStageFilter("CRAFTING")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            stageFilter === "CRAFTING"
              ? "bg-[#1E2229] text-[#FAF7F2]"
              : "bg-white text-[#635C53] border border-[#E8E2D7] hover:bg-[#FAF7F2]"
          }`}
        >
          In Studio Crafting ({sellerInquiries.filter((i) => i.status === "Crafting in Progress").length})
        </button>
        <button
          onClick={() => setStageFilter("DISPATCHED")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150 ${
            stageFilter === "DISPATCHED"
              ? "bg-[#1E2229] text-[#FAF7F2]"
              : "bg-white text-[#635C53] border border-[#E8E2D7] hover:bg-[#FAF7F2]"
          }`}
        >
          Dispatched ({sellerInquiries.filter((i) => i.status === "Dispatched" || i.status === "Completed").length})
        </button>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredInquiries.map((lead) => {
          const badge = getStageBadge(lead.status);
          const whatsappUrl = `https://wa.me/${(lead.customerPhone || "919871144220").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            `Namaste ${lead.customerName}! I am ${currentUser.name} from ${currentUser.city || "Hunar Artisan Studio"}. I received your commission request for "${lead.productTitle || "Custom Brief"}" on Hunar. Let's discuss your requirements!`
          )}`;

          return (
            <div
              key={lead.id}
              className="bg-white rounded-sm border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-6"
            >
              {/* Header: Patron info & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E2D7]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center font-serif text-xl font-bold text-[#B4461F] shrink-0">
                    {lead.customerName ? lead.customerName[0] : "P"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#8A7561]">LEAD ID: {lead.id}</span>
                      <span className="text-[#D3CBBE]">•</span>
                      <span className="text-xs text-[#635C53] font-medium">{lead.createdAt}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#1E2229]">
                      {lead.customerName}
                    </h3>
                    <p className="text-xs text-[#635C53] mt-0.5">
                      Patron Contact: <span className="text-[#1A1816] font-semibold">{lead.customerPhone || "+91 98711 44220"}</span> • {lead.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider border ${badge.class}`}>
                    {badge.label}
                  </span>

                  {/* Open In-App Chat CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      const conv = startOrGetConversation({
                        sellerId: currentUser.id,
                        productId: lead.productId,
                        initialMessage: `Namaste ${lead.customerName}! I received your commission inquiry for "${lead.productTitle || "Custom Brief"}" (Budget: ₹${lead.proposedBudget}). Let's discuss details and timelines.`
                      });
                      router.push(`/dashboard/chat/${conv.id}`);
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-sm btn-terracotta text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open In-App Chat & Invoice</span>
                  </button>
                </div>
              </div>

              {/* Requirement & Proposed Budget Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs bg-[#FAF7F2] p-5 rounded-sm border border-[#E8E2D7]">
                <div className="md:col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561]">
                    Customer Requirement & Dimensions:
                  </span>
                  <p className="text-[#1A1816] font-medium leading-relaxed mt-1.5">
                    {lead.requirements}
                  </p>
                  {lead.productTitle && (
                    <p className="text-xs text-[#B4461F] font-semibold mt-2">
                      Referenced Listing: {lead.productTitle}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561]">Proposed Budget:</span>
                    <p className="font-bold text-base text-[#B4461F]">
                      ₹{lead.proposedBudget.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561]">Requested Timeline:</span>
                    <p className="text-[#1A1816] font-medium">{lead.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Pipeline Status Transitions Controller */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E8E2D7]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#635C53] font-semibold">Studio Stage:</span>
                  <span className="font-semibold text-[#1A1816]">{lead.status}</span>
                </div>

                {editingId === lead.id ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as CustomerInquiry["status"])}
                      className="px-3 py-1.5 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Crafting in Progress">Crafting in Progress</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add studio note (e.g. Clay bisqued)..."
                      className="px-3 py-1.5 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                    />

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStatus(lead.id)}
                        className="btn-terracotta px-3.5 py-1.5 rounded-sm text-xs font-medium"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-craft-secondary px-2.5 py-1.5 rounded-sm text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(lead.id);
                      setSelectedStatus(lead.status);
                    }}
                    className="text-xs font-semibold text-[#B4461F] hover:underline flex items-center gap-1"
                  >
                    <span>Update Crafting Stage & Log Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Updates Feed */}
              {lead.statusUpdates && lead.statusUpdates.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#E8E2D7]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7561]">
                    Artisan Status Log:
                  </span>
                  {lead.statusUpdates.map((update, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#635C53]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] dark:text-[#00E676] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#1A1816]">{update.timestamp}:</strong> {update.note}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredInquiries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-sm border border-[#E8E2D7] p-8 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Inbox className="w-10 h-10 text-[#D3CBBE] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1E2229]">No Leads in this Stage</h3>
            <p className="text-xs text-[#635C53] max-w-md mx-auto">
              Your studio inbox will populate whenever patrons submit inquiries or custom commission briefs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
