"use client";

import React from "react";
import { CourierOption } from "../types";
import { COURIER_OPTIONS } from "../mockCouriers";
import { Truck, Zap, Shield, CheckCircle2, Clock } from "lucide-react";

interface CourierComparisonProps {
  selectedCourierId?: string;
  onSelectCourier?: (courier: CourierOption) => void;
  showMarginDetails?: boolean;
}

export function CourierComparison({
  selectedCourierId,
  onSelectCourier,
  showMarginDetails = true
}: CourierComparisonProps) {
  const getCourierIcon = (id: string) => {
    switch (id) {
      case "courier-express":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "courier-fragile":
        return <Shield className="w-5 h-5 text-orange-600" />;
      default:
        return <Truck className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-serif font-bold text-stone-900">
            Compare Courier Partners
          </h3>
          <p className="text-xs text-stone-500">
            Integrated delivery partners with pre-negotiated wholesale rates for Indian artisans.
          </p>
        </div>
        <span className="text-[11px] font-medium text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full shrink-0 w-fit">
          Asset-Light Logistics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {COURIER_OPTIONS.map((courier) => {
          const isSelected = selectedCourierId === courier.id;

          return (
            <div
              key={courier.id}
              onClick={() => onSelectCourier?.(courier)}
              className={`relative rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                onSelectCourier ? "cursor-pointer" : ""
              } ${
                isSelected
                  ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 shadow-sm"
                  : "border-stone-200 bg-white hover:border-orange-300 hover:shadow-xs"
              }`}
            >
              {courier.badge && (
                <span className="absolute -top-2.5 right-3 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  {courier.badge}
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-orange-100/80 border border-orange-200/60 flex items-center justify-center shrink-0">
                      {getCourierIcon(courier.id)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm leading-tight">
                        {courier.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>ETA: {courier.eta}</span>
                      </div>
                    </div>
                  </div>

                  {onSelectCourier && (
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-stone-300 bg-stone-50"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed min-h-[36px]">
                  {courier.tagline}
                </p>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-stone-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">Buyer Delivery Fee</span>
                  <span className="font-serif font-bold text-lg text-stone-900">
                    ₹{courier.buyerFee}
                  </span>
                </div>

                {showMarginDetails && (
                  <div className="rounded-lg bg-stone-50 border border-stone-200/80 p-2 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-stone-500">
                      <span>Courier Cost (payout)</span>
                      <span className="font-mono">₹{courier.courierCost}</span>
                    </div>
                    <div className="flex items-center justify-between text-orange-800 font-semibold border-t border-stone-200/60 pt-1">
                      <span>Hunar Gross Margin</span>
                      <span className="text-orange-600 font-bold">+₹{courier.grossMargin}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
