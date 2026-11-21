"use client";

import React, { useState, useEffect } from "react";
import { CourierOption, PackagingOption, Shipment } from "../types";
import { COURIER_OPTIONS, PACKAGING_OPTIONS, saveShipments, loadShipments } from "../mockCouriers";
import { X, Package, Shield, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface ShipmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShipmentBooked?: (shipment: Shipment) => void;
  defaultArtisanName?: string;
  defaultPickupCity?: string;
  defaultArtworkTitle?: string;
  defaultArtworkPrice?: number;
}

export function ShipmentBookingModal({
  isOpen,
  onClose,
  onShipmentBooked,
  defaultArtisanName = "Rohit Sharma",
  defaultPickupCity = "Khurja",
  defaultArtworkTitle = "Terracotta Floral Planter",
  defaultArtworkPrice = 1800
}: ShipmentBookingModalProps) {
  const [artisanName, setArtisanName] = useState(defaultArtisanName);
  const [pickupAddress, setPickupAddress] = useState("Pottery Colony, G.T. Road, Studio #4");
  const [pickupCity, setPickupCity] = useState(defaultPickupCity);

  const [buyerName, setBuyerName] = useState("Vikram Malhotra");
  const [deliveryAddress, setDeliveryAddress] = useState("Plot 42, Jubilee Hills Sector 2");
  const [deliveryCity, setDeliveryCity] = useState("Hyderabad");

  const [artworkTitle, setArtworkTitle] = useState(defaultArtworkTitle);
  const [artworkPrice, setArtworkPrice] = useState(defaultArtworkPrice);

  const [weightKg, setWeightKg] = useState(1.5);
  const [dimensions, setDimensions] = useState("25 x 20 x 15 cm");

  const [selectedCourier, setSelectedCourier] = useState<CourierOption>(COURIER_OPTIONS[2]);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(PACKAGING_OPTIONS[1]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedShipment, setBookedShipment] = useState<Shipment | null>(null);

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

  const shippingFee = selectedCourier.buyerFee;
  const packagingFee = selectedPackaging.price;
  const customerTotal = artworkPrice + shippingFee + packagingFee;
  const courierCost = selectedCourier.courierCost;
  const grossMargin = selectedCourier.grossMargin + packagingFee;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const awbNumber = `HNR-AWB-2026${randomSuffix}`;
    const shipmentId = `ship-${Date.now()}`;
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const nowFormatted = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newShipment: Shipment = {
      id: shipmentId,
      awbNumber,
      orderId,
      artworkTitle: artworkTitle.trim() || "Handcrafted Artwork",
      artworkPrice: Number(artworkPrice) || 1500,
      artisanName: artisanName.trim() || "Artisan Studio",
      pickupAddress: pickupAddress.trim() || `${pickupCity} Craft Cluster`,
      pickupCity: pickupCity.trim() || "Khurja",
      buyerName: buyerName.trim() || "Valued Buyer",
      deliveryAddress: deliveryAddress.trim() || `${deliveryCity} Metro`,
      deliveryCity: deliveryCity.trim() || "Delhi NCR",
      weightKg: Number(weightKg) || 1.0,
      dimensions: dimensions.trim() || "20 x 20 x 15 cm",
      courier: selectedCourier,
      packaging: selectedPackaging,
      shippingFee,
      packagingFee,
      totalCustomerPaid: customerTotal,
      courierCost,
      grossMargin,
      status: "Placed",
      checkpoints: [
        {
          status: "Placed",
          timestamp: nowFormatted,
          location: `${pickupCity} Studio`,
          note: `Shipment manifested via ${selectedCourier.name}. AWB generated.`
        }
      ],
      createdAt: new Date().toISOString()
    };

    const existing = loadShipments();
    const updated = [newShipment, ...existing];
    saveShipments(updated);

    setBookedShipment(newShipment);
    setIsSubmitting(false);

    if (onShipmentBooked) {
      onShipmentBooked(newShipment);
    }
  };

  const handleResetAndClose = () => {
    setBookedShipment(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white text-stone-900 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                Asset-Light Logistics
              </span>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Instant Courier Booking & AWB
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
              {bookedShipment ? "Shipment Booked Successfully!" : "Book Courier & Packing Add-On"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
          {bookedShipment ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  AWB Manifest Generated
                </h3>
                <p className="text-xs text-stone-600">
                  Parcel is officially scheduled for pickup by{" "}
                  <strong className="text-stone-900">{bookedShipment.courier.name}</strong>.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-orange-50/60 border border-orange-200 text-left space-y-2.5">
                <div className="flex items-center justify-between border-b border-orange-200/60 pb-2">
                  <span className="text-xs text-stone-600">Air Waybill (AWB)</span>
                  <span className="font-mono font-bold text-orange-700 text-sm">
                    {bookedShipment.awbNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Route</span>
                  <span className="font-semibold text-stone-900">
                    {bookedShipment.pickupCity} → {bookedShipment.deliveryCity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Estimated Delivery</span>
                  <span className="font-semibold text-stone-900">{bookedShipment.courier.eta}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Packaging Add-on</span>
                  <span className="font-semibold text-stone-900">{bookedShipment.packaging.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-orange-200/60">
                  <span className="text-orange-800 font-bold">Hunar Delivery Margin Earned</span>
                  <span className="text-orange-600 font-bold text-sm">+₹{bookedShipment.grossMargin}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400">
                You can track this live parcel in the Tracking Stepper or view margin on the Revenue Dashboard.
              </p>
            </div>
          ) : (
            <form id="shipment-form" onSubmit={handleBooking} className="space-y-4">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                  1. Artwork & Parcel Specifications
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Artwork Title</label>
                    <input
                      type="text"
                      required
                      value={artworkTitle}
                      onChange={(e) => setArtworkTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Item Value (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={artworkPrice}
                      onChange={(e) => setArtworkPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min={0.1}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Dimensions (L x W x H)</label>
                    <input
                      type="text"
                      required
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 block">
                    Pickup (Artisan)
                  </span>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Artisan Name</label>
                    <input
                      type="text"
                      required
                      value={artisanName}
                      onChange={(e) => setArtisanName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">City / Cluster</label>
                    <input
                      type="text"
                      required
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Studio Address</label>
                    <textarea
                      rows={2}
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                    Delivery (Buyer)
                  </span>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Buyer Name</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Destination City</label>
                    <input
                      type="text"
                      required
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Shipping Address</label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  2. Choose Courier Partner Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {COURIER_OPTIONS.map((c) => {
                    const isSelected = selectedCourier.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCourier(c)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500"
                            : "border-stone-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                          <span>{c.name}</span>
                          <span className="text-orange-600 font-serif">₹{c.buyerFee}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">ETA: {c.eta}</p>
                        <div className="text-[10px] text-orange-700 font-medium mt-1">
                          Margin: +₹{c.grossMargin}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
                  <span>3. Optional Packaging Add-On</span>
                  <span className="text-[11px] font-normal text-stone-500 lowercase">
                    retained 100% by Hunar
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PACKAGING_OPTIONS.map((pkg) => {
                    const isSelected = selectedPackaging.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackaging(pkg)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500"
                            : "border-stone-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                          <span>{pkg.name}</span>
                          <span className="text-orange-600 font-serif">
                            {pkg.price === 0 ? "Free" : `+₹${pkg.price}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Artwork Price</span>
                  <span>₹{artworkPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Shipping Fee ({selectedCourier.name})</span>
                  <span>₹{shippingFee}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Packaging Add-On ({selectedPackaging.name})</span>
                  <span>{packagingFee === 0 ? "₹0 (Included)" : `+₹${packagingFee}`}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-sm text-stone-900 border-t border-orange-200 pt-2">
                  <span>Customer Total</span>
                  <span className="text-orange-600 font-serif text-base">
                    ₹{customerTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-orange-800 font-semibold pt-1 border-t border-dashed border-orange-200/80">
                  <span>Hunar Gross Shipping Margin</span>
                  <span>+₹{grossMargin} ({Math.round((grossMargin / (shippingFee + packagingFee)) * 100)}%)</span>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-end gap-3 px-5 py-3.5 border-t border-stone-200 bg-gray-50/90">
          {bookedShipment ? (
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Done & View In Dashboard
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shipment-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Package className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Generating AWB..." : "Book Shipment & Generate AWB"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
