"use client";

import React from "react";
import { CustomerInquiry } from "@/types";
import { CheckCircle2, MessageCircle } from "lucide-react";

interface OrderTrackerProps {
  inquiries: CustomerInquiry[];
  isHindi?: boolean;
}

export function OrderTracker({ inquiries, isHindi = false }: OrderTrackerProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-[#F5F2EB] text-[#635C53] border-[#E8E2D7]";
      case "Crafting in Progress":
        return "bg-[#FBF0EB] text-[#B4461F] border-[#F3CFBF]";
      case "Dispatched":
        return "bg-[#EEF4F0] text-[#2D583B] border-[#C5DCCB]";
      case "Completed":
        return "bg-[#FAF5EC] text-[#1E2229] border-[#DACABA]";
      default:
        return "bg-[#F5F2EB] text-[#635C53] border-[#E8E2D7]";
    }
  };

  const statusSteps = [
    "Under Review",
    "Crafting in Progress",
    "Dispatched",
    "Completed",
  ];

  return (
    <div className="space-y-4">
      {inquiries.map((inq) => {
        const currentIdx = statusSteps.indexOf(inq.status);

        return (
          <div
            key={inq.id}
            className="rounded-sm bg-white border border-[#E8DEC8] p-6 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8D9] pb-4">
              <div className="flex items-center gap-3">
                {inq.productImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={inq.productImage}
                    alt={inq.productTitle || "Custom"}
                    className="w-12 h-12 rounded-sm object-cover border border-[#E8DEC8]"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-[#1E2229]">
                      {inq.productTitle || "Custom Heritage Commission"}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                        inq.status
                      )}`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#635C53] mt-0.5">
                    Artisan Studio:{" "}
                    <span className="font-semibold text-[#1E2229]">
                      {inq.sellerName}
                    </span>{" "}
                    • Proposed Budget:{" "}
                    <span className="font-bold text-[#B4461F]">
                      ₹{inq.proposedBudget.toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-gray-400 font-mono">ID: {inq.id}</span>
                <span className="text-xs text-gray-400">• {inq.createdAt}</span>
              </div>
            </div>

            {/* Visual Stepper */}
            <div>
              <div className="grid grid-cols-4 gap-2">
                {statusSteps.map((step, idx) => {
                  const isPastOrCurrent = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="space-y-1.5">
                      <div
                        className={`h-2 rounded-xs transition-colors duration-150 ${
                          isPastOrCurrent
                            ? isCurrent
                              ? "bg-[#B4461F]"
                              : "bg-[#2D583B]"
                            : "bg-[#E8DEC8]"
                        }`}
                      />
                      <p
                        className={`text-[10px] sm:text-xs font-semibold truncate ${
                          isCurrent
                            ? "text-[#B4461F]"
                            : isPastOrCurrent
                            ? "text-[#2D583B]"
                            : "text-gray-400"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requirements & Activity Log */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6ED] p-4 rounded-sm border border-[#E8DEC8] text-xs">
              <div>
                <p className="font-semibold uppercase tracking-wider text-[#635C53] text-[10px]">
                  Commission Brief / Requirements:
                </p>
                <p className="text-[#1E2229] mt-1 leading-relaxed">{inq.requirements}</p>
                <p className="text-[#635C53] mt-1">Timeline: {inq.timeline}</p>
              </div>

              <div>
                <p className="font-semibold uppercase tracking-wider text-[#635C53] text-[10px]">
                  Studio Status Activity Log:
                </p>
                <div className="space-y-1 mt-1">
                  {inq.statusUpdates && inq.statusUpdates.length > 0 ? (
                    inq.statusUpdates.map((u, i) => (
                      <p key={i} className="text-[#635C53] flex items-start gap-1">
                        <span className="font-mono text-gray-400 text-[10px] shrink-0">
                          [{u.timestamp}]
                        </span>
                        <span>{u.note}</span>
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No studio updates logged yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
