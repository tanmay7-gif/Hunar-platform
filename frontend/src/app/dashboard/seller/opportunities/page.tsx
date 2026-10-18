"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHunar } from "@/context/HunarContext";
import { Opportunity } from "@/lib/data";
import {
  Target,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Search,
  Filter,
  Send,
  Building2,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function SellerOpportunitiesPage() {
  const {
    opportunities,
    currentUser,
    language,
    applyToOpportunity,
    applications,
    showToast
  } = useHunar();

  const isHindi = language === "hi";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [pitch, setPitch] = useState("");
  const [proposedRate, setProposedRate] = useState<number>(0);

  const categories = ["All", "Mural Design", "Folk & Studio Commission", "Wedding & Henna", "Corporate Bulk"];
  const types = ["All", "Murals", "Commission", "Event Booking", "Exhibition", "Grant"];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchCat = selectedCategory === "All" || opp.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchType = selectedType === "All" || opp.type === selectedType;
    const matchSearch =
      searchQuery.trim() === "" ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  const handleOpenApply = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setProposedRate(opp.budgetMax);
    setPitch(
      `Namaste, I am ${currentUser.name} (${currentUser.tagline || "Master Artisan"}). I specialize in this craft with 12+ years of verified studio experience.`
    );
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    applyToOpportunity(selectedOpportunity.id, pitch, proposedRate);
    setSelectedOpportunity(null);
    setPitch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-sm p-6 sm:p-8 border border-[#2C323D] bg-[#1E2229] text-[#FAF7F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#B4461F] text-white">
                Live Gigs Radar
              </span>
              <span className="text-xs text-[#E5A93B] font-mono">Grassroots Boli & Direct Bids</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
              {isHindi ? "खुले अवसर एवं गिग रडार" : "Open Gigs & Regional Boli Radar"}
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-2xl">
              Verified local commissioning opportunities: specialty cafe walls, wedding bridal mehndi packages, luxury boutique pottery orders, and government cultural grants.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-sm bg-[#2A313D] border border-[#3E4756] text-xs">
              <span className="text-[#8A7561] block text-[10px] uppercase font-semibold">Matched Radar Gigs:</span>
              <span className="text-base font-bold text-[#E5A93B]">{opportunities.length} Live Openings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-sm p-4 border border-[#E8E2D7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7561]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gigs by title, location (Delhi, Jaipur...), client..."
              className="w-full pl-9 pr-4 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full md:w-44 px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Gigs Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredOpportunities.map((opp) => {
          const hasApplied = applications.some((app) => app.opportunityId === opp.id);

          return (
            <div
              key={opp.id}
              className="bg-white rounded-sm border border-[#E8E2D7] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider bg-[#FAF0E6] text-[#B4461F] border border-[#F3CFBF]">
                      {opp.type}
                    </span>
                    <span className="text-xs text-[#D3CBBE]">•</span>
                    <span className="text-xs text-[#635C53] font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8A7561]" />
                      {opp.location}
                    </span>
                  </div>

                  <span className="text-xs text-[#635C53] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {opp.deadline}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#1E2229] mb-2">
                  {opp.title}
                </h3>
                <p className="text-xs text-[#635C53] line-clamp-3 leading-relaxed mb-4">
                  {opp.description}
                </p>

                {/* Client Box */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-sm bg-[#FAF7F2] border border-[#E8E2D7] text-xs">
                  <img
                    src={opp.postedByAvatar}
                    alt={opp.postedBy}
                    className="w-9 h-9 rounded-sm object-cover aspect-square border border-[#E8E2D7] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1816] truncate">{opp.postedBy}</p>
                    <p className="text-[10px] text-[#635C53] truncate">{opp.postedByOrg}</p>
                  </div>
                  {opp.postedByVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#2D583B] shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Requirements tags */}
                {opp.requirements && opp.requirements.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {opp.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FAF7F2] border border-[#E8E2D7] text-[#1A1816]"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Payout & Action */}
              <div className="pt-4 border-t border-[#E8E2D7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8A7561] uppercase font-semibold">Estimated Payout / Budget:</span>
                  <p className="font-serif font-bold text-base text-[#B4461F]">
                    ₹{opp.budgetMin.toLocaleString("en-IN")} - ₹{opp.budgetMax.toLocaleString("en-IN")}
                  </p>
                </div>

                {hasApplied ? (
                  <span className="px-3.5 py-1.5 rounded-sm bg-[#EEF4F0] text-[#2D583B] border border-[#C5DCCB] text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Quote Submitted</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApply(opp)}
                    className="btn-terracotta px-4 py-2 rounded-sm text-xs font-medium flex items-center gap-1.5 transition-colors duration-150"
                  >
                    <span>Express Interest / Send Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Express Interest Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 border border-[#E8E2D7] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7561]">
                  Commission Proposal
                </p>
                <h3 className="font-serif font-bold text-base text-[#1E2229] mt-0.5">
                  Send Studio Quote & Pitch
                </h3>
                <p className="text-xs text-[#B4461F] font-semibold mt-0.5">{selectedOpportunity.title}</p>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-1 text-[#8A7561] hover:text-[#1E2229]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Proposed Payout / Rate (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  min={selectedOpportunity.budgetMin}
                  value={proposedRate}
                  onChange={(e) => setProposedRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
                <p className="text-[10px] text-[#635C53] mt-1">
                  Client budget: ₹{selectedOpportunity.budgetMin.toLocaleString("en-IN")} - ₹{selectedOpportunity.budgetMax.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1816] mb-1">
                  Artisan Pitch & Craft Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Mention previous works, materials you'll use, timeline commitment..."
                  className="w-full p-3 rounded-sm border border-[#D3CBBE] text-xs bg-[#FDFCF9] text-[#1A1816] focus:outline-none focus:border-[#B4461F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(null)}
                  className="btn-craft-secondary px-4 py-2 rounded-sm text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-terracotta px-5 py-2 rounded-sm text-xs font-medium"
                >
                  Submit Studio Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
