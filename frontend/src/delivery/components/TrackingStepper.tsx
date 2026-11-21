"use client";

import React, { useState } from "react";
import { Shipment, TrackingStatus } from "../types";
import { TRACKING_STEPS, advanceShipmentStatus, saveShipments, loadShipments } from "../mockCouriers";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  RotateCw,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface TrackingStepperProps {
  shipment: Shipment;
  onShipmentUpdated?: (updated: Shipment) => void;
  showDemoControls?: boolean;
}

export function TrackingStepper({
  shipment,
  onShipmentUpdated,
  showDemoControls = true
}: TrackingStepperProps) {
  const [currentShipment, setCurrentShipment] = useState<Shipment>(shipment);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Sync with prop when parent selection changes
  React.useEffect(() => {
    setCurrentShipment(shipment);
  }, [shipment]);

  const currentIndex = TRACKING_STEPS.indexOf(currentShipment.status);

  const handleAdvance = () => {
    setIsAdvancing(true);
    const updated = advanceShipmentStatus(currentShipment);
    setCurrentShipment(updated);

    // Save to storage
    const all = loadShipments();
    const updatedList = all.map((s) => (s.id === updated.id ? updated : s));
    saveShipments(updatedList);

    if (onShipmentUpdated) {
      onShipmentUpdated(updated);
    }
    setTimeout(() => setIsAdvancing(false), 300);
  };

  const getStepIcon = (step: TrackingStatus, index: number) => {
    const isCompleted = index < currentIndex;
    const isCurrent = index === currentIndex;

    if (isCompleted) {
      return <CheckCircle2 className="w-4 h-4 text-white" />;
    }
    if (isCurrent) {
      switch (step) {
        case "Placed":
          return <Clock className="w-4 h-4 text-white animate-pulse" />;
        case "Packed":
          return <Package className="w-4 h-4 text-white animate-pulse" />;
        case "Picked Up":
        case "In Transit":
          return <Truck className="w-4 h-4 text-white animate-pulse" />;
        case "Delivered":
          return <CheckCircle2 className="w-4 h-4 text-white" />;
      }
    }
    return <span className="text-xs font-semibold text-stone-400">{index + 1}</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header with AWB & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-200/80 px-2 py-0.5 rounded-full">
              Live Transit Radar
            </span>
            <span className="text-xs font-mono font-bold text-stone-900">
              AWB: {currentShipment.awbNumber}
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">
            {currentShipment.artworkTitle}
          </h3>
          <p className="text-xs text-stone-500">
            {currentShipment.pickupCity} → {currentShipment.deliveryCity} • Courier:{" "}
            <strong className="text-stone-800">{currentShipment.courier.name}</strong> •{" "}
            {currentShipment.packaging.name}
          </p>
        </div>

        {showDemoControls && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAdvance}
              disabled={isAdvancing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAdvancing ? "animate-spin" : ""}`} />
              <span>
                {currentShipment.status === "Delivered"
                  ? "Reset Tracking (Demo)"
                  : "Advance Status (Demo)"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 5-Step Visual Progress Stepper */}
      <div className="py-2">
        <div className="relative">
          {/* Progress bar line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-stone-100 -translate-y-1/2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 transition-all duration-500"
              style={{
                width: `${(currentIndex / (TRACKING_STEPS.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* Stepper circles */}
          <div className="relative flex items-center justify-between">
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isPending = idx > currentIndex;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isCompleted
                        ? "bg-orange-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-orange-600 text-white ring-4 ring-orange-100 shadow-md scale-110"
                        : "bg-white border-2 border-stone-200 text-stone-400"
                    }`}
                  >
                    {getStepIcon(step, idx)}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold transition-colors text-center ${
                      isCurrent
                        ? "text-orange-700 font-bold"
                        : isCompleted
                        ? "text-stone-800"
                        : "text-stone-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Status Highlights Box */}
      <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wide block">
              Current Node: {currentShipment.status}
            </span>
            <p className="text-stone-700">
              {currentShipment.checkpoints[currentShipment.checkpoints.length - 1]?.note ||
                "In dispatch pipeline"}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[11px] text-stone-500 block">ETA Delivery</span>
          <span className="font-semibold text-stone-900">{currentShipment.courier.eta}</span>
        </div>
      </div>

      {/* Detailed Checkpoint Timeline */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          Milestone Checkpoint Log
        </h4>
        <div className="space-y-2.5">
          {currentShipment.checkpoints
            .slice()
            .reverse()
            .map((cp, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-stone-50/70 border border-stone-100 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-stone-900">{cp.status}</span>
                    <span className="text-[11px] text-stone-400 font-mono shrink-0">
                      {cp.timestamp}
                    </span>
                  </div>
                  <p className="text-stone-600 mt-0.5">{cp.note}</p>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Location: {cp.location}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
