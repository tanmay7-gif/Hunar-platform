"use client";

import React, { useState } from "react";
import { Shipment, ShippingMetrics, TrackingStatus } from "../types";
import { calculateMetrics, advanceShipmentStatus, saveShipments } from "../mockCouriers";
import {
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle2,
  Package,
  Search,
  RotateCw,
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";

interface ShippingRevenueDashboardProps {
  shipments: Shipment[];
  onSelectShipmentForTracking?: (shipment: Shipment) => void;
  onShipmentsUpdated?: (shipments: Shipment[]) => void;
}

export function ShippingRevenueDashboard({
  shipments,
  onSelectShipmentForTracking,
  onShipmentsUpdated
}: ShippingRevenueDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const metrics: ShippingMetrics = calculateMetrics(shipments);

  const handleAdvanceShipment = (shipment: Shipment) => {
    const updated = advanceShipmentStatus(shipment);
    const updatedList = shipments.map((s) => (s.id === updated.id ? updated : s));
    saveShipments(updatedList);
    if (onShipmentsUpdated) {
      onShipmentsUpdated(updatedList);
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.awbNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artworkTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pickupCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deliveryCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TrackingStatus) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Transit":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Picked Up":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Packed":
        return "bg-stone-100 text-stone-700 border-stone-200";
      default:
        return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Shipping Collected */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Shipping Collected
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="font-serif font-bold text-2xl text-stone-900">
              ₹{metrics.totalCollected.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-500">
              Buyer logistics fees & packaging add-ons
            </p>
          </div>
        </div>

        {/* Card 2: Estimated Courier Cost */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Courier Partner Cost
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="font-serif font-bold text-2xl text-stone-800">
              ₹{metrics.totalCourierCost.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-500">
              Contracted wholesale fleet payout
            </p>
          </div>
        </div>

        {/* Card 3: Hunar Gross Delivery Margin */}
        <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 rounded-2xl border border-orange-200/90 p-5 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-orange-900">
            <span className="text-xs font-bold uppercase tracking-wider">
              Hunar Gross Margin
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <p className="font-serif font-extrabold text-2xl text-orange-600">
                ₹{metrics.totalGrossMargin.toLocaleString()}
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {metrics.marginPercentage}% margin
              </span>
            </div>
            <p className="text-[11px] text-orange-800 font-medium">
              Asset-light logistics revenue stream
            </p>
          </div>
        </div>

        {/* Card 4: Completed Deliveries */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Delivered Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="font-serif font-bold text-2xl text-stone-900">
              {metrics.completedDeliveries}{" "}
              <span className="text-xs font-normal text-stone-500">
                / {shipments.length} total
              </span>
            </p>
            <p className="text-[11px] text-stone-500">
              {metrics.activeShipments} currently in transit
            </p>
          </div>
        </div>
      </div>

      {/* Shipment Manifests Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Table Header & Search Filter */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Logistics Manifests & Parcel Records
            </h3>
            <p className="text-xs text-stone-500">
              Live tracking status, partner routing, and margin accrued per shipment.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AWB or city..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="All">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Packed">Packed</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">AWB & Order</th>
                <th className="py-3 px-4">Artwork & Route</th>
                <th className="py-3 px-4">Courier Partner</th>
                <th className="py-3 px-4">Packaging Add-on</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Gross Margin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No shipments found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900">{s.awbNumber}</div>
                      <div className="text-[10px] text-stone-400">{s.orderId}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-semibold text-stone-900 truncate">
                        {s.artworkTitle}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {s.pickupCity} → {s.deliveryCity}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{s.courier.name}</div>
                      <div className="text-[10px] text-stone-400">ETA: {s.courier.eta}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                        {s.packaging.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          s.status
                        )}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-serif font-bold text-orange-600 text-sm">
                        +₹{s.grossMargin}
                      </span>
                      <div className="text-[10px] text-stone-400">
                        ₹{s.shippingFee + s.packagingFee} collected
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onSelectShipmentForTracking && (
                          <button
                            type="button"
                            onClick={() => onSelectShipmentForTracking(s)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors cursor-pointer"
                          >
                            Track
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAdvanceShipment(s)}
                          title="Advance status in Demo mode"
                          className="p-1 rounded-md text-stone-400 hover:text-orange-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Transparent Disclaimer Footer Note */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200/80 text-center">
          <p className="text-[11px] text-stone-500 italic">
            Illustrative Phase 1 demo rates. Gross margin excludes taxes, returns, and support costs. Phase 2 integrates Shiprocket / NimbusPost APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
