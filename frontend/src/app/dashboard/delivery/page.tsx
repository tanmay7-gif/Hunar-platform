"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shipment } from "@/delivery/types";
import { loadShipments } from "@/delivery/mockCouriers";
import { CourierComparison } from "@/delivery/components/CourierComparison";
import { ShipmentBookingModal } from "@/delivery/components/ShipmentBookingModal";
import { TrackingStepper } from "@/delivery/components/TrackingStepper";
import { ShippingRevenueDashboard } from "@/delivery/components/ShippingRevenueDashboard";
import {
  Truck,
  Package,
  Plus,
  TrendingUp,
  Layers,
  MapPin,
  ShieldCheck,
  RotateCw,
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function DeliveryHubPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "tracking" | "revenue" | "couriers">("overview");

  useEffect(() => {
    const loaded = loadShipments();
    setShipments(loaded);
    if (loaded.length > 0) {
      setSelectedShipment(loaded[0]);
    }
  }, []);

  const handleShipmentBooked = (newShipment: Shipment) => {
    setShipments((prev) => [newShipment, ...prev]);
    setSelectedShipment(newShipment);
  };

  const handleShipmentUpdated = (updated: Shipment) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    if (selectedShipment?.id === updated.id) {
      setSelectedShipment(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Hero */}
      <div className="w-full rounded-2xl p-6 sm:p-8 border border-orange-200/80 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                Logistics & Delivery Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-orange-800 bg-orange-100 border border-orange-200">
                Phase 1 MVP • Asset-Light
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Artisan Parcel Delivery & Shipping Revenue
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Enabling grassroots artists to pack orders with specialized fragile buffers, compare pre-negotiated courier rates, book manifests instantly, and empower buyers with end-to-end live tracking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Shipment</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-orange-200/60 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-white/80 hover:bg-white text-stone-700 border border-stone-200"
            }`}
          >
            Hub Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tracking")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "tracking"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-white/80 hover:bg-white text-stone-700 border border-stone-200"
            }`}
          >
            Live Tracking Stepper
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "revenue"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-white/80 hover:bg-white text-stone-700 border border-stone-200"
            }`}
          >
            Shipping Revenue & Margins
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("couriers")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "couriers"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-white/80 hover:bg-white text-stone-700 border border-stone-200"
            }`}
          >
            Courier Rate Comparison
          </button>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Active Tracking Spotlight */}
          {selectedShipment && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-serif font-bold text-stone-900">
                  Featured Shipment Tracking
                </h2>
                {shipments.length > 1 && (
                  <select
                    value={selectedShipment.id}
                    onChange={(e) => {
                      const found = shipments.find((s) => s.id === e.target.value);
                      if (found) setSelectedShipment(found);
                    }}
                    className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-800 font-medium focus:ring-1 focus:ring-orange-500"
                  >
                    {shipments.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.awbNumber} - {s.artworkTitle} ({s.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <TrackingStepper
                shipment={selectedShipment}
                onShipmentUpdated={handleShipmentUpdated}
              />
            </div>
          )}

          {/* Revenue Analytics Module */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-stone-900">
                Logistics Margin & Volume Performance
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("revenue")}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
              >
                <span>View Full Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <ShippingRevenueDashboard
              shipments={shipments}
              onSelectShipmentForTracking={(s) => {
                setSelectedShipment(s);
                window.scrollTo({ top: 120, behavior: "smooth" });
              }}
              onShipmentsUpdated={setShipments}
            />
          </div>

          {/* Courier Comparison */}
          <div className="space-y-3 pt-2">
            <CourierComparison
              selectedCourierId={selectedShipment?.courier.id}
              showMarginDetails={true}
            />
          </div>
        </div>
      )}

      {activeTab === "tracking" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Select Parcel to Track</h2>
              <p className="text-xs text-stone-500">
                Switch between active manifests to inspect or advance checkpoints.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedShipment?.id || ""}
                onChange={(e) => {
                  const found = shipments.find((s) => s.id === e.target.value);
                  if (found) setSelectedShipment(found);
                }}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 font-semibold focus:ring-1 focus:ring-orange-500"
              >
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.awbNumber} • {s.pickupCity} → {s.deliveryCity} ({s.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedShipment ? (
            <TrackingStepper
              shipment={selectedShipment}
              onShipmentUpdated={handleShipmentUpdated}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <p className="text-xs text-stone-500">No shipments registered yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="space-y-6">
          <ShippingRevenueDashboard
            shipments={shipments}
            onSelectShipmentForTracking={(s) => {
              setSelectedShipment(s);
              setActiveTab("tracking");
            }}
            onShipmentsUpdated={setShipments}
          />
        </div>
      )}

      {activeTab === "couriers" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Courier Partner Network & Packaging Standards
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hunar partners with tier-1 logistics networks (BlueDart, Delhivery, DTDC, Xpressbees) to aggregate parcel volume from small artisan clusters, unlocking enterprise rate slabs and generating asset-light delivery margins.
            </p>
          </div>

          <CourierComparison showMarginDetails={true} />

          {/* Packaging Add-On Specifications Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Standardized Craft Packaging Specs
              </h3>
              <p className="text-xs text-stone-500">
                100% margin add-ons designed to prevent transit breakage for high-value artwork.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span>Basic Packaging</span>
                  <span className="text-orange-600 font-serif">₹0 (Free)</span>
                </div>
                <p className="text-xs text-stone-600">
                  Standard corrugated box with kraft paper padding. Ideal for textiles, lightweight craft tools, and apparel.
                </p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Breakage Rate: &lt; 2.1%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span>Fragile Protection</span>
                  <span className="text-orange-600 font-serif">+₹40</span>
                </div>
                <p className="text-xs text-stone-600">
                  Double bubble wrapping, thermo-foam corner buffers, and tamper-proof fragile security seals.
                </p>
                <span className="text-[10px] text-orange-700 font-medium block pt-1">
                  Breakage Rate: &lt; 0.4% • Recommended for Ceramics
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span>Premium Artwork Crate</span>
                  <span className="text-orange-600 font-serif">+₹90</span>
                </div>
                <p className="text-xs text-stone-600">
                  Solid pine/plywood reinforced bracing with moisture-seal vapor barrier. Best for framed canvases and stone sculptures.
                </p>
                <span className="text-[10px] text-amber-800 font-medium block pt-1">
                  Zero Transit Claims • Museum Grade
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Booking Modal */}
      <ShipmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onShipmentBooked={handleShipmentBooked}
      />
    </div>
  );
}
